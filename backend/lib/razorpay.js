import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

// Add console log to verify keys are loaded
console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID ? "Found" : "Missing");
console.log("Razorpay Key Secret:", process.env.RAZORPAY_KEY_SECRET ? "Found" : "Missing");

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});