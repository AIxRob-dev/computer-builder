import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find({});
		res.json({ products });
	} catch (error) {
		console.log("Error in getAllProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Add this function to your product.controller.js
export const getProductById = async (req, res) => {
	try {
		const { id } = req.params;
		const product = await Product.findById(id);
		
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}
		
		res.json(product);
	} catch (error) {
		console.log("Error in getProductById controller:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getFeaturedProducts = async (req, res) => {
	try {
		let featuredProducts = await redis.get("featured_products");
		if (featuredProducts) {
			return res.json(JSON.parse(featuredProducts));
		}

		featuredProducts = await Product.find({ isFeatured: true }).lean();

		if (!featuredProducts) {
			return res.status(404).json({ message: "No featured products found" });
		}

		await redis.set("featured_products", JSON.stringify(featuredProducts));

		res.json(featuredProducts);
	} catch (error) {
		console.log("Error in getFeaturedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// NEW CONTROLLER: Get Best Seller Products
export const getBestSellerProducts = async (req, res) => {
	try {
		let bestSellerProducts = await redis.get("best_seller_products");
		if (bestSellerProducts) {
			return res.json(JSON.parse(bestSellerProducts));
		}

		bestSellerProducts = await Product.find({ isBestSeller: true }).lean();

		if (!bestSellerProducts) {
			return res.status(404).json({ message: "No best seller products found" });
		}

		await redis.set("best_seller_products", JSON.stringify(bestSellerProducts));

		res.json(bestSellerProducts);
	} catch (error) {
		console.log("Error in getBestSellerProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const createProduct = async (req, res) => {
	try {
		const { name, description, price, image, additionalImages, category, isFeatured, isBestSeller } = req.body;

		let cloudinaryResponse = null;
		let additionalImagesUrls = [];

		// Upload main image
		if (image) {
			cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
		}

		// Upload additional images (max 3)
		if (additionalImages && Array.isArray(additionalImages)) {
			const imagesToUpload = additionalImages.slice(0, 3);
			
			for (const img of imagesToUpload) {
				try {
					const uploadResult = await cloudinary.uploader.upload(img, { folder: "products" });
					additionalImagesUrls.push(uploadResult.secure_url);
				} catch (error) {
					console.log("Error uploading additional image:", error.message);
				}
			}
		}

		const product = await Product.create({
			name,
			description,
			price,
			image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
			additionalImages: additionalImagesUrls,
			category,
			isFeatured: isFeatured || false,
			isBestSeller: isBestSeller || false,
		});

		// Update caches if product is featured or best seller
		if (product.isFeatured) {
			await updateFeaturedProductsCache();
		}
		if (product.isBestSeller) {
			await updateBestSellerProductsCache();
		}

		res.status(201).json(product);
	} catch (error) {
		console.log("Error in createProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		// Delete main image from cloudinary
		if (product.image) {
			const publicId = product.image.split("/").pop().split(".")[0];
			try {
				await cloudinary.uploader.destroy(`products/${publicId}`);
				console.log("Deleted main image from cloudinary");
			} catch (error) {
				console.log("Error deleting main image from cloudinary", error);
			}
		}

		// Delete additional images from cloudinary
		if (product.additionalImages && product.additionalImages.length > 0) {
			for (const imgUrl of product.additionalImages) {
				const publicId = imgUrl.split("/").pop().split(".")[0];
				try {
					await cloudinary.uploader.destroy(`products/${publicId}`);
					console.log("Deleted additional image from cloudinary");
				} catch (error) {
					console.log("Error deleting additional image from cloudinary", error);
				}
			}
		}

		await Product.findByIdAndDelete(req.params.id);

		// Clear caches if product was featured or best seller
		if (product.isFeatured) {
			await redis.del("featured_products");
		}
		if (product.isBestSeller) {
			await redis.del("best_seller_products");
		}

		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		console.log("Error in deleteProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getRecommendedProducts = async (req, res) => {
	try {
		const products = await Product.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					name: 1,
					description: 1,
					image: 1,
					additionalImages: 1,
					price: 1,
				},
			},
		]);

		res.json(products);
	} catch (error) {
		console.log("Error in getRecommendedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getProductsByCategory = async (req, res) => {
	const { category } = req.params;
	try {
		const products = await Product.find({ category });
		res.json({ products });
	} catch (error) {
		console.log("Error in getProductsByCategory controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const toggleFeaturedProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			product.isFeatured = !product.isFeatured;
			const updatedProduct = await product.save();
			await updateFeaturedProductsCache();
			res.json(updatedProduct);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in toggleFeaturedProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// NEW CONTROLLER: Toggle Best Seller Product
export const toggleBestSellerProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			product.isBestSeller = !product.isBestSeller;
			const updatedProduct = await product.save();
			await updateBestSellerProductsCache();
			res.json(updatedProduct);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in toggleBestSellerProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateProduct = async (req, res) => {
	try {
		const { name, description, price, image, additionalImages, category, isFeatured, isBestSeller } = req.body;
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		const wasFeatured = product.isFeatured;
		const wasBestSeller = product.isBestSeller;

		// Update basic fields
		if (name) product.name = name;
		if (description) product.description = description;
		if (price) product.price = price;
		if (category) product.category = category;
		if (typeof isFeatured !== 'undefined') product.isFeatured = isFeatured;
		if (typeof isBestSeller !== 'undefined') product.isBestSeller = isBestSeller;

		// Update main image if provided
		if (image) {
			if (product.image) {
				const publicId = product.image.split("/").pop().split(".")[0];
				try {
					await cloudinary.uploader.destroy(`products/${publicId}`);
				} catch (error) {
					console.log("Error deleting old image", error);
				}
			}
			const cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
			product.image = cloudinaryResponse.secure_url;
		}

		// Update additional images if provided
		if (additionalImages && Array.isArray(additionalImages)) {
			if (product.additionalImages && product.additionalImages.length > 0) {
				for (const imgUrl of product.additionalImages) {
					const publicId = imgUrl.split("/").pop().split(".")[0];
					try {
						await cloudinary.uploader.destroy(`products/${publicId}`);
					} catch (error) {
						console.log("Error deleting old additional image", error);
					}
				}
			}

			const additionalImagesUrls = [];
			const imagesToUpload = additionalImages.slice(0, 3);
			
			for (const img of imagesToUpload) {
				try {
					const uploadResult = await cloudinary.uploader.upload(img, { folder: "products" });
					additionalImagesUrls.push(uploadResult.secure_url);
				} catch (error) {
					console.log("Error uploading additional image:", error.message);
				}
			}
			product.additionalImages = additionalImagesUrls;
		}

		const updatedProduct = await product.save();

		// Update caches if featured or best seller status changed
		if (wasFeatured !== updatedProduct.isFeatured) {
			await updateFeaturedProductsCache();
		}
		if (wasBestSeller !== updatedProduct.isBestSeller) {
			await updateBestSellerProductsCache();
		}

		res.json(updatedProduct);
	} catch (error) {
		console.log("Error in updateProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

async function updateFeaturedProductsCache() {
	try {
		const featuredProducts = await Product.find({ isFeatured: true }).lean();
		await redis.set("featured_products", JSON.stringify(featuredProducts));
	} catch (error) {
		console.log("error in update featured cache function");
	}
}

async function updateBestSellerProductsCache() {
	try {
		const bestSellerProducts = await Product.find({ isBestSeller: true }).lean();
		await redis.set("best_seller_products", JSON.stringify(bestSellerProducts));
	} catch (error) {
		console.log("error in update best seller cache function");
	}
}