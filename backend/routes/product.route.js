import express from "express";
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getProductById,
	getFeaturedProducts,
	getBestSellerProducts,
	getProductsByCategory,
	getProductsByMultipleCategories, // NEW IMPORT
	getRecommendedProducts,
	toggleFeaturedProduct,
	toggleBestSellerProduct,
	toggleStockStatus,
	updateProduct,
	clearCache, // Optional: for cache management
} from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get all products (admin only)
router.get("/", protectRoute, adminRoute, getAllProducts);

// Get featured products (public route)
router.get("/featured", getFeaturedProducts);

// Get best seller products (public route)
router.get("/bestseller", getBestSellerProducts);

// NEW: Get products by multiple categories (public route)
// Usage: /api/products/categories/filter?categories=gaming,laptop,desktop
router.get("/categories/filter", getProductsByMultipleCategories);

// Get products by single category (public route)
router.get("/category/:category", getProductsByCategory);

// Get recommended products (public route)
router.get("/recommendations", getRecommendedProducts);

// Get single product by ID (public route)
router.get("/:id", getProductById);

// Create product (admin only)
router.post("/", protectRoute, adminRoute, createProduct);

// Update product (admin only)
router.put("/:id", protectRoute, adminRoute, updateProduct);

// Toggle featured status (admin only)
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);

// Toggle best seller status (admin only)
router.patch("/bestseller/:id", protectRoute, adminRoute, toggleBestSellerProduct);

// Toggle stock status (admin only)
router.patch("/stock/:id", protectRoute, adminRoute, toggleStockStatus);

// Delete product (admin only)
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

// Optional: Clear cache endpoint (admin only)
// router.post("/cache/clear", protectRoute, adminRoute, clearCache);

export default router;