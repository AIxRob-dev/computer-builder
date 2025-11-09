import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
	products: [],
	loading: false,

	setProducts: (products) => set({ products }),
	
	fetchProductById: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.get(`/products/${productId}`);
			set({ loading: false });
			return response.data;
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.error || "Failed to fetch product");
			return null;
		}
	},
	
	createProduct: async (productData) => {
		set({ loading: true });
		try {
			const res = await axios.post("/products", productData);
			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
			}));
			toast.success("Product created successfully!");
		} catch (error) {
			toast.error(error.response?.data?.error || "Failed to create product");
			set({ loading: false });
		}
	},
	
	fetchAllProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products");
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response?.data?.error || "Failed to fetch products");
		}
	},
	
	fetchProductsByCategory: async (category) => {
		set({ loading: true });
		try {
			const response = await axios.get(`/products/category/${category}`);
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response?.data?.error || "Failed to fetch products");
		}
	},
	
	// NEW: Fetch products by multiple categories
	fetchProductsByMultipleCategories: async (categories) => {
		set({ loading: true });
		try {
			// categories should be an array: ['gaming', 'laptop', 'desktop']
			const categoriesString = Array.isArray(categories) 
				? categories.join(',') 
				: categories;
			
			const response = await axios.get(`/products/categories/filter?categories=${categoriesString}`);
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response?.data?.error || "Failed to fetch products");
		}
	},
	
	deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			await axios.delete(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId),
				loading: false,
			}));
			toast.success("Product deleted successfully!");
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.error || "Failed to delete product");
		}
	},
	
	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
				),
				loading: false,
			}));
			toast.success("Featured status updated!");
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.error || "Failed to update product");
		}
	},
	
	toggleBestSellerProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/products/bestseller/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, isBestSeller: response.data.isBestSeller } : product
				),
				loading: false,
			}));
			toast.success("Best seller status updated!");
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.error || "Failed to update product");
		}
	},
	
	toggleStockStatus: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/products/stock/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, inStock: response.data.inStock } : product
				),
				loading: false,
			}));
			toast.success("Stock status updated!");
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.error || "Failed to update stock status");
		}
	},
	
	fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products/featured");
			set({ products: response.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			console.log("Error fetching featured products:", error);
		}
	},
	
	fetchBestSellerProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products/bestseller");
			set({ products: response.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch best seller products", loading: false });
			console.log("Error fetching best seller products:", error);
		}
	},
}));