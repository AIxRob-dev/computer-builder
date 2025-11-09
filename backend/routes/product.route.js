import express from "express";
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getProductById,
	getFeaturedProducts,
	getBestSellerProducts,
	getProductsByCategory,
	getProductsByMultipleCategories,
	getRecommendedProducts,
	toggleFeaturedProduct,
	toggleBestSellerProduct,
	toggleStockStatus,
	updateProduct,
	clearCache,
} from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// ==========================================
// PUBLIC ROUTES (no auth required)
// ==========================================

// Get featured products
router.get("/featured", getFeaturedProducts);

// Get best seller products
router.get("/bestseller", getBestSellerProducts);

// Get products by multiple categories
router.get("/categories/filter", getProductsByMultipleCategories);

// Get recommended products
router.get("/recommendations", getRecommendedProducts);

// Get products by single category
router.get("/category/:category", getProductsByCategory);

// ==========================================
// ADMIN ROUTES (auth + admin required)
// ==========================================

// Get all products (admin only)
router.get("/", protectRoute, adminRoute, getAllProducts);

// Create product (admin only)
router.post("/", protectRoute, adminRoute, createProduct);

// ⭐ CRITICAL: Specific PATCH routes MUST come BEFORE "/:id" wildcard
// Toggle best seller status (admin only)
router.patch("/bestseller/:id", protectRoute, adminRoute, toggleBestSellerProduct);

// Toggle stock status (admin only)
router.patch("/stock/:id", protectRoute, adminRoute, toggleStockStatus);

// Toggle featured status (admin only) - MOVED AFTER specific routes
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);

// Update product (admin only)
router.put("/:id", protectRoute, adminRoute, updateProduct);

// Delete product (admin only)
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

// ==========================================
// Must be last: Dynamic ID routes
// ==========================================

// Get single product by ID (public route) - MUST BE LAST
router.get("/:id", getProductById);

export default router;
