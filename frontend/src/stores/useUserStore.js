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

// ⭐ CRITICAL: Helper to detect if cookies are working
const areCookiesWorking = () => {
	try {
		document.cookie = "test=1; path=/; SameSite=Lax";
		const result = document.cookie.indexOf("test=") !== -1;
		document.cookie = "test=1; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
		return result;
	} catch (e) {
		return false;
	}
};

// ⭐ Helper to save user to localStorage as fallback
const saveUserToLocalStorage = (user) => {
	try {
		localStorage.setItem('user_session', JSON.stringify(user));
		console.log("💾 User saved to localStorage");
	} catch (e) {
		console.error("❌ Failed to save to localStorage:", e);
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

// ⭐ Helper to clear localStorage
const clearLocalStorage = () => {
	try {
		localStorage.removeItem('user_session');
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
	useFallbackAuth: !areCookiesWorking(),

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
			
			// ⭐ Save to localStorage as fallback
			saveUserToLocalStorage(res.data);
			
			toast.dismiss(loadingToast);
			toast.success(`Welcome aboard, ${res.data.name || 'there'}! 🎉`, {
				...toastStyles,
				...toastStyles.success,
			});

			// ⭐ Check cookies after signup
			setTimeout(() => {
				const cookiesWork = areCookiesWorking();
				console.log("🍪 Cookies working:", cookiesWork);
				if (!cookiesWork) {
					console.warn("⚠️ Cookies not working - using localStorage fallback");
					set({ useFallbackAuth: true });
					toast("📌 Session will persist in this browser only", {
						...toastStyles,
						duration: 3000,
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
			set({ user: res.data, loading: false, error: null });
			
			// ⭐ CRITICAL: Save to localStorage as fallback
			saveUserToLocalStorage(res.data);
			
			toast.dismiss(loadingToast);
			toast.success(`Welcome back, ${res.data.name || 'there'}! ✨`, {
				...toastStyles,
				...toastStyles.success,
			});

			// ⭐ Check cookies after login
			setTimeout(() => {
				const cookiesWork = areCookiesWorking();
				console.log("🍪 Cookies after login:", document.cookie);
				console.log("🍪 Cookies working:", cookiesWork);
				
				if (!cookiesWork) {
					console.warn("⚠️ Cookies not working - using localStorage fallback");
					set({ useFallbackAuth: true });
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
		} catch (error) {
			console.error("❌ Logout error:", error);
		} finally {
			// ⭐ Always clear both cookie and localStorage
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
			console.log("🍪 Current cookies:", document.cookie);
			
			// ⭐ CRITICAL: Try cookies first
			const response = await axios.get("/auth/profile");
			
			console.log("✅ Auth check successful (cookies):", response.data);
			set({ user: response.data, checkingAuth: false, error: null });
			
			// ⭐ Sync to localStorage
			saveUserToLocalStorage(response.data);
			
		} catch (error) {
			console.error("❌ Auth check via cookies failed:", error.response?.status);
			
			// ⭐ CRITICAL: Try localStorage fallback
			const localUser = getUserFromLocalStorage();
			
			if (localUser) {
				console.log("✅ Auth restored from localStorage:", localUser);
				set({ user: localUser, checkingAuth: false, useFallbackAuth: true });
				
				// Show info toast
				toast("📌 Session restored from local storage", {
					...toastStyles,
					duration: 2000,
				});
			} else {
				console.log("ℹ️ No authentication found");
				set({ checkingAuth: false, user: null });
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
			
			// ⭐ If refresh fails, try localStorage
			const localUser = getUserFromLocalStorage();
			if (localUser) {
				console.log("⚠️ Using localStorage fallback after refresh failure");
				set({ user: localUser, checkingAuth: false, useFallbackAuth: true });
			} else {
				set({ user: null, checkingAuth: false });
				clearLocalStorage();
			}
			
			throw error;
		}
	},

	clearError: () => set({ error: null }),
}));
