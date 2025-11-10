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

// ⭐ FIXED: Enhanced CORS Configuration
const allowedOrigins = process.env.NODE_ENV === "production" 
  ? [
      "https://www.computerbuilder.in",
      "https://computerbuilder.in",
      process.env.CLIENT_URL,
    ].filter(Boolean) // Remove undefined values
  : ["http://localhost:5173", "http://localhost:5174"];

console.log("Allowed CORS origins:", allowedOrigins);

const corsOptions = {
  origin: function(origin, callback) {
    // ⭐ Allow requests with no origin (mobile apps, Postman, server-to-server)
    if (!origin) {
      console.log("Request with no origin - allowing");
      return callback(null, true);
    }
    
    // Check if origin matches any allowed origin
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });
    
    if (!isAllowed) {
      console.log("❌ CORS blocked:", origin);
      const msg = `CORS policy does not allow access from origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    
    console.log("✅ CORS allowed:", origin);
    return callback(null, true);
  },
  credentials: true, // ⭐ CRITICAL: Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'], // ⭐ Expose Set-Cookie header
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400 // Cache preflight requests for 24 hours
};

// ⭐ Apply CORS before other middleware
app.use(cors(corsOptions));

// ⭐ Handle preflight requests explicitly
app.options('*', cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// ⭐ FIXED: Request logging middleware (corrected template literal)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log("Origin:", req.headers.origin);
  console.log("Cookies:", req.cookies);
  next();
});

// ⭐ Add security headers
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    
    // ⭐ CRITICAL for iOS Safari cookie handling
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
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
    timestamp: new Date().toISOString(),
    cookies: !!req.cookies.accessToken
  });
});

// ⭐ Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Global error handler:", err.message);
  console.error("Stack:", err.stack);
  
  // Handle CORS errors specifically
  if (err.message.includes("CORS")) {
    return res.status(403).json({ 
      error: "CORS error", 
      message: "Access from this origin is not allowed" 
    });
  }
  
  res.status(500).json({ 
    error: "Internal server error", 
    message: process.env.NODE_ENV === "production" ? "Something went wrong" : err.message 
  });
});

app.listen(PORT, () => {
  console.log("✅ Server is running on http://localhost:" + PORT);
  connectDB();
});
