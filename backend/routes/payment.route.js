import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createCheckoutSession, verifyPayment } from "../controllers/payment.controller.js";

const router = express.Router();

// Create Razorpay order
router.post("/create-checkout-session", protectRoute, createCheckoutSession);

// Verify payment after successful payment (replaces checkout-success)
router.post("/verify-payment", protectRoute, verifyPayment);

export default router;