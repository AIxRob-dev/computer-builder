import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import { razorpay } from "../lib/razorpay.js";
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from "../lib/email.js";
import crypto from "crypto";

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode, shippingAddress } = req.body;

    // Validate products
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid or empty products array" });
    }

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || 
        !shippingAddress.addressLine1 || !shippingAddress.city || 
        !shippingAddress.state || !shippingAddress.pincode) {
      return res.status(400).json({ error: "Complete shipping address is required" });
    }

    let totalAmount = 0;

    // Calculate total amount
    products.forEach((product) => {
      totalAmount += Math.round(product.price * product.quantity * 100); // Convert to paise
    });

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
      }
    }

    // Create Razorpay order
    const options = {
      amount: totalAmount, // amount in paise
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
        // Store shipping address in notes
        shippingAddress: JSON.stringify(shippingAddress),
      },
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      orderId: order.id,
      amount: totalAmount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ 
      message: "Error creating order", 
      error: error.message 
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = req.body;

    // Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing payment details" 
      });
    }

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid payment signature" 
      });
    }

    // Fetch order details from Razorpay
    const order = await razorpay.orders.fetch(razorpay_order_id);

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found" 
      });
    }

    // Parse order data
    const products = JSON.parse(order.notes.products);
    const shippingAddress = JSON.parse(order.notes.shippingAddress);
    const userId = order.notes.userId;

    // Fetch user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Fetch product details for email
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
    const newOrder = new Order({
      user: userId,
      products: products.map((product) => ({
        product: product.id,
        quantity: product.quantity,
        price: product.price,
      })),
      totalAmount: order.amount / 100, // Convert from paise to rupees
      shippingAddress: shippingAddress,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      paymentStatus: "completed",
      orderStatus: "processing",
    });

    await newOrder.save();

    // Clear user's cart
    user.cartItems = [];
    await user.save();

    // Deactivate coupon if used
    if (order.notes.couponCode) {
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
      await createNewCoupon(userId);
    }

    // Send emails (don't wait for them to complete)
    try {
      // Send confirmation email to user
      await sendOrderConfirmationEmail(user.email, {
        orderId: newOrder._id,
        products: productsWithDetails,
        totalAmount: newOrder.totalAmount,
        shippingAddress: shippingAddress,
      });

      // Send notification email to admin
      await sendAdminOrderNotification({
        orderId: newOrder._id,
        userEmail: user.email,
        userName: user.name,
        products: productsWithDetails,
        totalAmount: newOrder.totalAmount,
        shippingAddress: shippingAddress,
      });
    } catch (emailError) {
      console.error("Error sending emails:", emailError);
      // Don't fail the order if email fails
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ 
      success: false,
      message: "Error verifying payment", 
      error: error.message 
    });
  }
};

async function createNewCoupon(userId) {
  try {
    await Coupon.findOneAndDelete({ userId });

    const newCoupon = new Coupon({
      code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      discountPercentage: 10,
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      userId: userId,
    });

    await newCoupon.save();
    return newCoupon;
  } catch (error) {
    console.error("Error creating coupon:", error);
    throw error;
  }
}