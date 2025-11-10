import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

// Custom toast styles
const toastStyles = {
	style: {
		background: '#18181b',
		color: '#fff',
		border: '1px solid #27272a',
		padding: '16px',
		fontSize: '14px',
		fontWeight: '300',
		letterSpacing: '0.025em',
	},
	success: {
		iconTheme: { primary: '#fff', secondary: '#18181b' },
		duration: 3000,
	},
	error: {
		iconTheme: { primary: '#fff', secondary: '#18181b' },
		duration: 4000,
	},
	loading: {
		iconTheme: { primary: '#71717a', secondary: '#18181b' },
	},
};

// ⭐ Helper to save user to localStorage
const saveUserToLocalStorage = (user) => {
	try {
		localStorage.setItem('user_session', JSON.stringify(user));
		console.log("💾 User saved to localStorage");
	} catch (e) {
		console.error("❌ Failed to save to localStorage:", e);
	}
};

// ⭐ Helper to save tokens to localStorage
const saveTokensToLocalStorage = (tokens) => {
	try {
		localStorage.setItem('auth_tokens', JSON.stringify(tokens));
		console.log("🔐 Tokens saved to localStorage");
	} catch (e) {
		console.error("❌ Failed to save tokens:", e);
	}
};

// ⭐ Helper to get user from localStorage
const getUserFromLocalStorage = () => {
	try {
		const user = localStorage.getItem('user_session');
		if (user) {
			console.log("📦 User loaded from localStorage");
			return JSON.parse(user);
		}
	} catch (e) {
		console.error("❌ Failed to load from localStorage:", e);
	}
	return null;
};

// ⭐ Helper to get tokens from localStorage
const getTokensFromLocalStorage = () => {
	try {
		const tokens = localStorage.getItem('auth_tokens');
		if (tokens) {
			console.log("🔐 Tokens loaded from localStorage");
			return JSON.parse(tokens);
		}
	} catch (e) {
		console.error("❌ Failed to load tokens:", e);
	}
	return null;
};

// ⭐ Helper to clear localStorage
const clearLocalStorage = () => {
	try {
		localStorage.removeItem('user_session');
		localStorage.removeItem('auth_tokens');
		console.log("🧹 LocalStorage cleared");
	} catch (e) {
		console.error("❌ Failed to clear localStorage:", e);
	}
};

export const useUserStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,
	error: null,

	signup: async ({ name, email, password, confirmPassword }) => {
		set({ loading: true, error: null });

		if (password !== confirmPassword) {
			set({ loading: false, error: "Passwords do not match" });
			return toast.error("Passwords do not match", {
				...toastStyles,
				...toastStyles.error,
			});
		}

		const loadingToast = toast.loading("Creating your account...", {
			...toastStyles,
			...toastStyles.loading,
		});

		try {
			console.log("📝 Attempting signup...");
			const res = await axios.post("/auth/signup", { name, email, password });
			
			console.log("✅ Signup successful:", res.data);
			
			// ⭐ CRITICAL: Extract user and tokens separately
			const { tokens, ...userData } = res.data;
			
			set({ user: userData, loading: false, error: null });
			
			// ⭐ Save both user data and tokens
			saveUserToLocalStorage(userData);
			if (tokens) {
				saveTokensToLocalStorage(tokens);
				console.log("🔐 Tokens received and stored");
			}
			
			toast.dismiss(loadingToast);
			toast.success(`Welcome aboard, ${userData.name || 'there'}! 🎉`, {
				...toastStyles,
				...toastStyles.success,
			});

		} catch (error) {
			console.error("❌ Signup error:", error.response?.data || error.message);
			const errorMessage = error.response?.data?.message || "Account creation failed. Please try again.";
			
			set({ loading: false, error: errorMessage });
			toast.dismiss(loadingToast);
			toast.error(errorMessage, {
				...toastStyles,
				...toastStyles.error,
			});
		}
	},

	login: async (email, password) => {
		set({ loading: true, error: null });

		const loadingToast = toast.loading("Signing you in...", {
			...toastStyles,
			...toastStyles.loading,
		});

		try {
			console.log("🔐 Attempting login for:", email);
			const res = await axios.post("/auth/login", { email, password });
			
			console.log("✅ Login successful:", res.data);
			
			// ⭐ CRITICAL: Extract user and tokens separately
			const { tokens, ...userData } = res.data;
			
			set({ user: userData, loading: false, error: null });
			
			// ⭐ Save both user data and tokens
			saveUserToLocalStorage(userData);
			if (tokens) {
				saveTokensToLocalStorage(tokens);
				console.log("🔐 Tokens received and stored");
			}
			
			toast.dismiss(loadingToast);
			toast.success(`Welcome back, ${userData.name || 'there'}! ✨`, {
				...toastStyles,
				...toastStyles.success,
			});

		} catch (error) {
			console.error("❌ Login error:", error.response?.data || error.message);
			const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials.";
			
			set({ loading: false, error: errorMessage });
			toast.dismiss(loadingToast);
			toast.error(errorMessage, {
				...toastStyles,
				...toastStyles.error,
			});
		}
	},

	logout: async () => {
		const loadingToast = toast.loading("Signing you out...", {
			...toastStyles,
			...toastStyles.loading,
		});

		try {
			// ⭐ Send refresh token in request body as well
			const tokens = getTokensFromLocalStorage();
			await axios.post("/auth/logout", { 
				refreshToken: tokens?.refreshToken 
			});
		} catch (error) {
			console.error("❌ Logout error:", error);
		} finally {
			// ⭐ Always clear everything
			set({ user: null, error: null });
			clearLocalStorage();
			
			toast.dismiss(loadingToast);
			toast.success("You've been signed out successfully. See you soon! 👋", {
				...toastStyles,
				...toastStyles.success,
			});
		}
	},

	checkAuth: async () => {
		set({ checkingAuth: true });
		
		try {
			console.log("🔍 Checking authentication...");
			
			// ⭐ Check if we have tokens in localStorage
			const tokens = getTokensFromLocalStorage();
			if (tokens) {
				console.log("🔐 Found tokens in localStorage");
			}
			
			// ⭐ Try to get profile (will use cookies OR Authorization header)
			const response = await axios.get("/auth/profile");
			
			console.log("✅ Auth check successful:", response.data);
			set({ user: response.data, checkingAuth: false, error: null });
			
			// ⭐ Sync to localStorage
			saveUserToLocalStorage(response.data);
			
		} catch (error) {
			console.error("❌ Auth check failed:", error.response?.status, error.response?.data?.code);
			
			// ⭐ Clear everything if auth fails
			set({ checkingAuth: false, user: null });
			clearLocalStorage();
		}
	},

	refreshToken: async () => {
		if (get().checkingAuth) return;

		set({ checkingAuth: true });
		
		try {
			console.log("🔄 Refreshing token...");
			
			// ⭐ Get refresh token from localStorage
			const tokens = getTokensFromLocalStorage();
			
			const response = await axios.post("/auth/refresh-token", {
				refreshToken: tokens?.refreshToken
			});
			
			console.log("✅ Token refreshed successfully");
			
			// ⭐ Update access token in localStorage
			if (response.data.accessToken && tokens) {
				const updatedTokens = {
					...tokens,
					accessToken: response.data.accessToken
				};
				saveTokensToLocalStorage(updatedTokens);
			}
			
			set({ checkingAuth: false });
			return response.data;
			
		} catch (error) {
			console.error("❌ Token refresh failed:", error);
			
			// ⭐ Clear everything if refresh fails
			set({ user: null, checkingAuth: false });
			clearLocalStorage();
			
			throw error;
		}
	},

	clearError: () => set({ error: null }),
}));
