import express from "express";
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getProductById,
	getFeaturedProducts,
	getBestSellerProducts,
	getProductsByCategory,
	getRecommendedProducts,
	toggleFeaturedProduct,
	toggleBestSellerProduct,
	toggleStockStatus, // ADD THIS IMPORT
	updateProduct,
} from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get all products (admin only)
router.get("/", protectRoute, adminRoute, getAllProducts);

// Get featured products (public route)
router.get("/featured", getFeaturedProducts);

// Get best seller products (public route)
router.get("/bestseller", getBestSellerProducts);

// Get products by category
router.get("/category/:category", getProductsByCategory);

// Get recommended products
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

// Toggle stock status (admin only) - ADD THIS LINE
router.patch("/stock/:id", protectRoute, adminRoute, toggleStockStatus);

// Delete product (admin only)
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;
