import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import { razorpay } from "../lib/razorpay.js";
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from "../lib/email.js";
import crypto from "crypto";

export const createCheckoutSession = async (req, res) => {
  try {
    console.log("=== CREATE CHECKOUT SESSION START ===");
    console.log("User ID:", req.user?._id);
    console.log("Environment:", process.env.NODE_ENV);
    
    const { products, couponCode, shippingAddress } = req.body;

    // Validate products
    if (!Array.isArray(products) || products.length === 0) {
      console.log("ERROR: Invalid products array");
      return res.status(400).json({ error: "Invalid or empty products array" });
    }

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || 
        !shippingAddress.addressLine1 || !shippingAddress.city || 
        !shippingAddress.state || !shippingAddress.pincode) {
      console.log("ERROR: Incomplete shipping address");
      return res.status(400).json({ error: "Complete shipping address is required" });
    }

    let totalAmount = 0;

    // Calculate total amount
    products.forEach((product) => {
      totalAmount += Math.round(product.price * product.quantity * 100);
    });
    console.log("Total amount calculated:", totalAmount, "paise");

    // Apply coupon if provided
    let coupon = null;
    let discountAmount = 0;
    if (couponCode) {
      coupon = await Coupon.findOne({ 
        code: couponCode, 
        userId: req.user._id, 
        isActive: true 
      });
      if (coupon) {
        discountAmount = Math.round((totalAmount * coupon.discountPercentage) / 100);
        totalAmount -= discountAmount;
        console.log("Coupon applied. Discount:", discountAmount, "paise");
      }
    }

    // Create Razorpay order
    const options = {
      amount: totalAmount,
      currency: "INR",
      receipt: `order_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
        discountAmount: discountAmount.toString(),
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          }))
        ),
        shippingAddress: JSON.stringify(shippingAddress),
      },
    };

    console.log("Creating Razorpay order...");
    const order = await razorpay.orders.create(options);
    console.log("Razorpay order created:", order.id);
    console.log("=== CREATE CHECKOUT SESSION END ===");

    res.status(200).json({
      orderId: order.id,
      amount: totalAmount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("ERROR in createCheckoutSession:", error);
    res.status(500).json({ 
      message: "Error creating order", 
      error: error.message 
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    console.log("=== VERIFY PAYMENT START ===");
    console.log("Payment verification request received");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = req.body;

    // Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.log("ERROR: Missing payment details");
      return res.status(400).json({ 
        success: false, 
        message: "Missing payment details" 
      });
    }

    console.log("Verifying signature...");
    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      console.log("ERROR: Invalid signature");
      console.log("Expected:", expectedSign);
      console.log("Received:", razorpay_signature);
      return res.status(400).json({ 
        success: false, 
        message: "Invalid payment signature" 
      });
    }
    console.log("Signature verified successfully");

    // Fetch order details from Razorpay
    console.log("Fetching order from Razorpay:", razorpay_order_id);
    const order = await razorpay.orders.fetch(razorpay_order_id);

    if (!order) {
      console.log("ERROR: Order not found in Razorpay");
      return res.status(404).json({ 
        success: false, 
        message: "Order not found" 
      });
    }
    console.log("Order fetched successfully");

    // Parse order data
    const products = JSON.parse(order.notes.products);
    const shippingAddress = JSON.parse(order.notes.shippingAddress);
    const userId = order.notes.userId;
    console.log("Order data parsed. User ID:", userId);

    // Fetch user details
    console.log("Fetching user from database...");
    const user = await User.findById(userId);
    if (!user) {
      console.log("ERROR: User not found");
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    console.log("User found:", user.email);

    // Fetch product details for email
    console.log("Fetching product details...");
    const productDetails = await Product.find({
      _id: { $in: products.map(p => p.id) }
    });

    const productsWithDetails = products.map((p) => {
      const productInfo = productDetails.find(
        (prod) => prod._id.toString() === p.id
      );
      return {
        product: {
          _id: p.id,
          name: productInfo?.name || "Product",
          image: productInfo?.image || "",
        },
        quantity: p.quantity,
        price: p.price,
      };
    });

    // Create order in database
    console.log("Creating order in database...");
    const newOrder = new Order({
      user: userId,
      products: products.map((product) => ({
        product: product.id,
        quantity: product.quantity,
        price: product.price,
      })),
      totalAmount: order.amount / 100,
      shippingAddress: shippingAddress,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      paymentStatus: "completed",
      orderStatus: "processing",
    });

    await newOrder.save();
    console.log("Order saved to database:", newOrder._id);

    // Clear user's cart
    console.log("Clearing user cart...");
    user.cartItems = [];
    await user.save();
    console.log("Cart cleared");

    // Deactivate coupon if used
    if (order.notes.couponCode) {
      console.log("Deactivating coupon:", order.notes.couponCode);
      await Coupon.findOneAndUpdate(
        {
          code: order.notes.couponCode,
          userId: userId,
        },
        {
          isActive: false,
        }
      );
    }

    // Create new coupon if order amount >= 20000 paise (200 INR)
    if (order.amount >= 20000) {
      console.log("Creating new coupon for user...");
      await createNewCoupon(userId);
    }

    // Send emails
    console.log("Sending emails...");
    try {
      console.log("Sending confirmation email to:", user.email);
      await sendOrderConfirmationEmail(user.email, {
        orderId: newOrder._id,
        products: productsWithDetails,
        totalAmount: newOrder.totalAmount,
        shippingAddress: shippingAddress,
      });
      console.log("Confirmation email sent successfully");

      console.log("Sending admin notification to:", process.env.ADMIN_EMAIL);
      await sendAdminOrderNotification({
        orderId: newOrder._id,
        userEmail: user.email,
        userName: user.name,
        products: productsWithDetails,
        totalAmount: newOrder.totalAmount,
        shippingAddress: shippingAddress,
      });
      console.log("Admin notification sent successfully");
    } catch (emailError) {
      console.error("ERROR sending emails:", emailError);
      console.error("Email error details:", emailError.message);
      // Don't fail the order if email fails
    }

    console.log("=== VERIFY PAYMENT END (SUCCESS) ===");
    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("ERROR in verifyPayment:", error);
    console.error("Error stack:", error.stack);
    console.log("=== VERIFY PAYMENT END (ERROR) ===");
    res.status(500).json({ 
      success: false,
      message: "Error verifying payment", 
      error: error.message 
    });
  }
};

async function createNewCoupon(userId) {
  try {
    console.log("Creating coupon for user:", userId);
    await Coupon.findOneAndDelete({ userId });

    const newCoupon = new Coupon({
      code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      discountPercentage: 10,
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      userId: userId,
    });

    await newCoupon.save();
    console.log("Coupon created:", newCoupon.code);
    return newCoupon;
  } catch (error) {
    console.error("ERROR creating coupon:", error);
    throw error;
  }
}
