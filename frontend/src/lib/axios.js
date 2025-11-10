import axios from "axios";

// ⭐ Determine the base URL based on environment
const baseURL = import.meta.env.MODE === "development" 
  ? "http://localhost:5000/api" 
  : "https://computerbuilders-in.onrender.com/api";

console.log("=== 🔧 AXIOS CONFIGURATION ===");
console.log("Environment:", import.meta.env.MODE);
console.log("Base URL:", baseURL);
console.log("With Credentials:", true);
console.log("Timestamp:", new Date().toISOString());
console.log("================================");

// ⭐ Create axios instance with proper configuration
const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // ⭐ CRITICAL: Send cookies with every request
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// ⭐ Request Interceptor - Log all outgoing requests
axiosInstance.interceptors.request.use(
  (config) => {
    const method = config.method?.toUpperCase() || "UNKNOWN";
    const url = config.url || "unknown";
    
    console.log(`📤 ${method} ${url}`, {
      withCredentials: config.withCredentials,
      hasData: !!config.data,
      timestamp: new Date().toISOString()
    });

    return config;
  },
  (error) => {
    console.error("❌ Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

// ⭐ Response Interceptor - Handle responses and token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toUpperCase() || "UNKNOWN";
    const url = response.config.url || "unknown";
    
    console.log(`✅ ${method} ${url}`, {
      status: response.status,
      statusText: response.statusText,
      timestamp: new Date().toISOString()
    });

    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const method = error.config?.method?.toUpperCase() || "UNKNOWN";
    const url = error.config?.url || "unknown";

    // ⭐ Log the error with details
    console.error(`❌ ${method} ${url}`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.response?.data?.message || error.message,
      data: error.response?.data,
      timestamp: new Date().toISOString()
    });

    // ⭐ Handle 401 Unauthorized - Attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry login/signup/refresh-token endpoints
      if (
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/signup') ||
        originalRequest.url?.includes('/auth/refresh-token')
      ) {
        console.log("⏭️ Skipping refresh for auth endpoint");
        return Promise.reject(error);
      }

      // ⭐ If already refreshing, queue this request
      if (isRefreshing) {
        console.log("⏳ Token refresh in progress - queuing request");
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            console.log("🔄 Retrying queued request");
            return axiosInstance(originalRequest);
          })
          .catch(err => {
            console.error("❌ Queued request failed");
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("🔄 Attempting token refresh...");
        
        // ⭐ Use raw axios to avoid circular calls
        const response = await axios.post(
          `${baseURL}/auth/refresh-token`,
          {},
          { 
            withCredentials: true,
            timeout: 10000 
          }
        );

        if (response.status === 200) {
          console.log("✅ Token refreshed successfully");
          
          // Check if cookies were set
          setTimeout(() => {
            console.log("🍪 Cookies after refresh:", document.cookie);
          }, 100);

          isRefreshing = false;
          processQueue(null, response.data);
          
          // Retry the original request
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", {
          status: refreshError.response?.status,
          message: refreshError.response?.data?.message || refreshError.message
        });

        isRefreshing = false;
        processQueue(refreshError, null);
        
        // Clear any stored user data
        console.log("🧹 Clearing user session");
        localStorage.removeItem('user');
        
        // Redirect to login only if not already there
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/signup')) {
          console.log("➡️ Redirecting to login page");
          setTimeout(() => {
            window.location.href = '/login';
          }, 500);
        }
        
        return Promise.reject(refreshError);
      }
    }

    // ⭐ Handle network errors (no response received)
    if (!error.response) {
      console.error("🌐 Network Error - No response received:", {
        message: error.message,
        code: error.code,
        isNetworkError: true
      });
      
      return Promise.reject({
        message: "Network error. Please check your internet connection.",
        isNetworkError: true,
        originalError: error
      });
    }

    // ⭐ Handle CORS errors
    if (error.message?.includes("CORS") || error.message?.includes("cors")) {
      console.error("🚫 CORS Error detected:", error.message);
      
      return Promise.reject({
        message: "Connection blocked by CORS policy. Please check server configuration.",
        isCorsError: true,
        originalError: error
      });
    }

    // ⭐ Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      console.error("⏱️ Request Timeout:", error.message);
      
      return Promise.reject({
        message: "Request timed out. Please try again.",
        isTimeoutError: true,
        originalError: error
      });
    }

    // ⭐ Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error("🚫 Access Forbidden");
      return Promise.reject({
        message: "Access denied. You don't have permission to perform this action.",
        isForbiddenError: true,
        originalError: error
      });
    }

    // ⭐ Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error("❓ Resource Not Found");
      return Promise.reject({
        message: "The requested resource was not found.",
        isNotFoundError: true,
        originalError: error
      });
    }

    // ⭐ Handle 500 Server Error
    if (error.response?.status >= 500) {
      console.error("💥 Server Error:", error.response?.status);
      return Promise.reject({
        message: "Server error. Please try again later.",
        isServerError: true,
        originalError: error
      });
    }

    return Promise.reject(error);
  }
);

// ⭐ Export the configured instance
export default axiosInstance;

// ⭐ Export helper function to check connection
export const checkApiConnection = async () => {
  try {
    console.log("🔌 Testing API connection...");
    const response = await axiosInstance.get('/health');
    console.log("✅ API connection successful:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("❌ API connection failed:", error);
    return { 
      success: false, 
      error: error.message,
      isNetworkError: error.isNetworkError,
      isCorsError: error.isCorsError
    };
  }
};

// ⭐ Export helper to manually clear auth state
export const clearAuthState = () => {
  console.log("🧹 Manually clearing auth state");
  localStorage.removeItem('user');
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
};

// ⭐ Make debug functions available in development
if (import.meta.env.MODE === "development") {
  window.axios = axiosInstance;
  window.checkApiConnection = checkApiConnection;
  window.clearAuthState = clearAuthState;
  
  console.log("💡 Debug utilities available:");
  console.log("  - window.axios (axios instance)");
  console.log("  - window.checkApiConnection() (test API)");
  console.log("  - window.clearAuthState() (clear auth)");
}
