import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import { razorpay } from "../lib/razorpay.js";
import crypto from "crypto";

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid or empty products array" });
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

    // Deactivate coupon if used
    if (order.notes.couponCode) {
      await Coupon.findOneAndUpdate(
        {
          code: order.notes.couponCode,
          userId: order.notes.userId,
        },
        {
          isActive: false,
        }
      );
    }

    // Create order in database
    const products = JSON.parse(order.notes.products);
    const newOrder = new Order({
      user: order.notes.userId,
      products: products.map((product) => ({
        product: product.id,
        quantity: product.quantity,
        price: product.price,
      })),
      totalAmount: order.amount / 100, // Convert from paise to rupees
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      paymentStatus: "completed",
    });

    await newOrder.save();

    // Create new coupon if order amount >= 20000 paise (200 INR)
    if (order.amount >= 20000) {
      await createNewCoupon(order.notes.userId);
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