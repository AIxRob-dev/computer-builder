import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log("=== SERVER STARTUP ===");
console.log("Environment:", process.env.NODE_ENV);
console.log("Client URL:", process.env.CLIENT_URL);
console.log("Port:", PORT);

// CORS Configuration
const allowedOrigins = process.env.NODE_ENV === "production" 
  ? [
      "https://www.computerbuilder.in",        // ⭐ Main domain with www
      "https://computerbuilder.in",            // ⭐ Main domain without www
      process.env.CLIENT_URL,                  // From environment variable
      /\.vercel\.app$/                         // Allow Vercel preview deployments
    ]
  : ["http://localhost:5173", "http://localhost:5174"];

console.log("Allowed CORS origins:", allowedOrigins);

// ⭐ Updated CORS configuration
const corsOptions = {
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin matches any allowed origin
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });
    
    if (!isAllowed) {
      const msg = `The CORS policy for this site does not allow access from origin ${origin}`;
      console.log("CORS blocked:", origin);
      return callback(new Error(msg), false);
    }
    console.log("CORS allowed:", origin);
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// ⭐ Handle preflight requests explicitly
app.options('*', cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ 
    error: "Internal server error", 
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
  connectDB();
});
