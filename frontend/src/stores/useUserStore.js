import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

// Custom toast styles matching your theme
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
		iconTheme: {
			primary: '#fff',
			secondary: '#18181b',
		},
		duration: 3000,
	},
	error: {
		iconTheme: {
			primary: '#fff',
			secondary: '#18181b',
		},
		duration: 4000,
	},
	loading: {
		iconTheme: {
			primary: '#71717a',
			secondary: '#18181b',
		},
	},
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
			set({ user: res.data, loading: false, error: null });
			
			toast.dismiss(loadingToast);
			toast.success(`Welcome aboard, ${res.data.name || 'there'}! 🎉`, {
				...toastStyles,
				...toastStyles.success,
			});

			// ⭐ CRITICAL: Verify cookies were set after signup
			setTimeout(() => {
				console.log("🍪 Cookies after signup:", document.cookie);
				if (!document.cookie.includes("accessToken")) {
					console.error("⚠️ WARNING: No cookies set after signup!");
					toast.error("Session setup incomplete. Please try logging in.", {
						...toastStyles,
						...toastStyles.error,
					});
				}
			}, 500);

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
			console.log("🍪 Response headers:", res.headers);
			
			set({ user: res.data, loading: false, error: null });
			
			toast.dismiss(loadingToast);
			toast.success(`Welcome back, ${res.data.name || 'there'}! ✨`, {
				...toastStyles,
				...toastStyles.success,
			});

			// ⭐ CRITICAL: Verify cookies were set after login
			setTimeout(() => {
				console.log("🍪 Cookies after login:", document.cookie);
				console.log("👤 User state:", get().user);
				
				if (!document.cookie.includes("accessToken")) {
					console.error("⚠️ CRITICAL: No cookies set after login!");
					console.error("Browser info:", {
						userAgent: navigator.userAgent,
						cookiesEnabled: navigator.cookieEnabled,
						platform: navigator.platform
					});
					
					// Show warning but don't block - user is technically logged in
					toast("⚠️ Session may not persist. Clear browser cache if issues persist.", {
						...toastStyles,
						icon: "⚠️",
						duration: 5000,
					});
				}
			}, 500);

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
			await axios.post("/auth/logout");
			set({ user: null, error: null });
			
			toast.dismiss(loadingToast);
			toast.success("You've been signed out successfully. See you soon! 👋", {
				...toastStyles,
				...toastStyles.success,
			});
		} catch (error) {
			console.error("❌ Logout error:", error);
			// Even if logout fails, clear local state
			set({ user: null, error: null });
			
			toast.dismiss(loadingToast);
			toast.success("Signed out successfully", {
				...toastStyles,
				...toastStyles.success,
			});
		}
	},

	checkAuth: async () => {
		set({ checkingAuth: true });
		
		try {
			console.log("🔍 Checking authentication...");
			console.log("🍪 Current cookies:", document.cookie);
			
			const response = await axios.get("/auth/profile");
			
			console.log("✅ Auth check successful:", response.data);
			set({ user: response.data, checkingAuth: false, error: null });
			
		} catch (error) {
			console.error("❌ Auth check failed:", error.response?.status, error.message);
			
			// ⭐ CRITICAL: Always set checkingAuth to false, even on error
			set({ checkingAuth: false, user: null });
			
			// Only show error if it's not a 401 (which is expected for non-authenticated users)
			if (error.response?.status !== 401) {
				console.error("Unexpected auth check error:", error);
			}
		}
	},

	refreshToken: async () => {
		if (get().checkingAuth) return;

		set({ checkingAuth: true });
		
		try {
			console.log("🔄 Refreshing token...");
			const response = await axios.post("/auth/refresh-token");
			
			console.log("✅ Token refreshed successfully");
			set({ checkingAuth: false });
			return response.data;
			
		} catch (error) {
			console.error("❌ Token refresh failed:", error);
			set({ user: null, checkingAuth: false });
			throw error;
		}
	},

	// ⭐ NEW: Clear error
	clearError: () => set({ error: null }),
}));

// ⭐ REMOVED: Duplicate axios interceptor (keeping only the one in lib/axios.js)
