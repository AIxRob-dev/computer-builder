import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

// Custom toast styles matching your theme
const toastStyles = {
	style: {
		background: '#18181b', // zinc-900
		color: '#fff',
		border: '1px solid #27272a', // zinc-800
		padding: '16px',
		fontSize: '14px',
		fontWeight: '300', // font-light
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
			primary: '#71717a', // zinc-500
			secondary: '#18181b',
		},
	},
};

export const useUserStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,

	signup: async ({ name, email, password, confirmPassword }) => {
		set({ loading: true });

		if (password !== confirmPassword) {
			set({ loading: false });
			return toast.error("Passwords do not match", {
				...toastStyles,
				...toastStyles.error,
			});
		}

		// Show loading toast
		const loadingToast = toast.loading("Creating your account...", {
			...toastStyles,
			...toastStyles.loading,
		});

		try {
			const res = await axios.post("/auth/signup", { name, email, password });
			set({ user: res.data, loading: false });
			
			// Dismiss loading and show success
			toast.dismiss(loadingToast);
			toast.success(`Welcome aboard, ${res.data.name || 'there'}! 🎉`, {
				...toastStyles,
				...toastStyles.success,
			});
		} catch (error) {
			set({ loading: false });
			toast.dismiss(loadingToast);
			
			const errorMessage = error.response?.data?.message || "Account creation failed. Please try again.";
			toast.error(errorMessage, {
				...toastStyles,
				...toastStyles.error,
			});
		}
	},

	login: async (email, password) => {
		set({ loading: true });

		// Show loading toast
		const loadingToast = toast.loading("Signing you in...", {
			...toastStyles,
			...toastStyles.loading,
		});

		try {
			const res = await axios.post("/auth/login", { email, password });
			set({ user: res.data, loading: false });
			
			// Dismiss loading and show success
			toast.dismiss(loadingToast);
			toast.success(`Welcome back, ${res.data.name || 'there'}! ✨`, {
				...toastStyles,
				...toastStyles.success,
			});
		} catch (error) {
			set({ loading: false });
			toast.dismiss(loadingToast);
			
			const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials.";
			toast.error(errorMessage, {
				...toastStyles,
				...toastStyles.error,
			});
		}
	},

	logout: async () => {
		// Show loading toast
		const loadingToast = toast.loading("Signing you out...", {
			...toastStyles,
			...toastStyles.loading,
		});

		try {
			await axios.post("/auth/logout");
			set({ user: null });
			
			// Dismiss loading and show success
			toast.dismiss(loadingToast);
			toast.success("You've been signed out successfully. See you soon! 👋", {
				...toastStyles,
				...toastStyles.success,
			});
		} catch (error) {
			toast.dismiss(loadingToast);
			
			const errorMessage = error.response?.data?.message || "Logout failed. Please try again.";
			toast.error(errorMessage, {
				...toastStyles,
				...toastStyles.error,
			});
		}
	},

	checkAuth: async () => {
		set({ checkingAuth: true });
		try {
			const response = await axios.get("/auth/profile");
			set({ user: response.data, checkingAuth: false });
		} catch (error) {
			console.log(error.message);
			set({ checkingAuth: false, user: null });
		}
	},

	refreshToken: async () => {
		// Prevent multiple simultaneous refresh attempts
		if (get().checkingAuth) return;

		set({ checkingAuth: true });
		try {
			const response = await axios.post("/auth/refresh-token");
			set({ checkingAuth: false });
			return response.data;
		} catch (error) {
			set({ user: null, checkingAuth: false });
			throw error;
		}
	},
}));

// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// If a refresh is already in progress, wait for it to complete
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);
				}

				// Start a new refresh process
				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);
			} catch (refreshError) {
				// If refresh fails, redirect to login or handle as needed
				useUserStore.getState().logout();
				
				// Show session expired toast
				toast.error("Your session has expired. Please sign in again.", {
					style: {
						background: '#18181b',
						color: '#fff',
						border: '1px solid #27272a',
						padding: '16px',
						fontSize: '14px',
						fontWeight: '300',
						letterSpacing: '0.025em',
					},
					iconTheme: {
						primary: '#fff',
						secondary: '#18181b',
					},
					duration: 4000,
				});
				
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);
