import { useEffect, useState } from "react";
import { Loader, AlertCircle, RefreshCw } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

const LoadingSpinner = () => {
  const { checkAuth } = useUserStore();
  const [showWarning, setShowWarning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    // Show warning if loading takes more than 5 seconds
    const warningTimer = setTimeout(() => {
      console.warn("⚠️ Auth check taking longer than expected");
      setShowWarning(true);
    }, 5000);

    // Auto-skip if loading takes more than 10 seconds
    const autoSkipTimer = setTimeout(() => {
      console.error("❌ Auth check timeout - forcing skip");
      handleForceSkip();
    }, 10000);

    // Track time elapsed
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => {
      clearTimeout(warningTimer);
      clearTimeout(autoSkipTimer);
      clearInterval(interval);
    };
  }, []);

  const handleRetry = () => {
    console.log("🔄 Manual retry triggered");
    setShowWarning(false);
    setTimeElapsed(0);
    checkAuth();
  };

  const handleForceSkip = () => {
    console.log("⏭️ Forcing skip - setting checkingAuth to false");
    // Force authentication check to complete
    useUserStore.setState({ checkingAuth: false, user: null });
  };

  const handleGoToLogin = () => {
    console.log("➡️ Redirecting to login");
    handleForceSkip();
    // Small delay to ensure state updates
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 flex items-center justify-center px-4 relative">
      {/* Subtle background effects */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div 
          className='absolute inset-0 opacity-[0.015]' 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl' />
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Main Loading Card */}
        <div className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Loader className="h-16 w-16 text-white animate-spin" strokeWidth={1.5} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 bg-white/10 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-light text-white mb-2 tracking-tight">
            Initializing Session
          </h2>
          
          <p className="text-zinc-400 text-sm mb-4 font-light">
            Please wait while we verify your account
          </p>

          {/* Time Indicator */}
          {timeElapsed > 0 && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-800/50 rounded-full mb-4">
              <div className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-pulse"></div>
              <p className="text-xs text-zinc-400 font-light">
                {timeElapsed}s
              </p>
            </div>
          )}

          {/* Warning Message */}
          {showWarning && (
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div className="text-left flex-1">
                  <p className="text-sm font-medium text-yellow-500 mb-2">
                    Taking Longer Than Expected
                  </p>
                  <p className="text-xs text-yellow-500/80 mb-3 font-light leading-relaxed">
                    This might be due to network issues or cookie restrictions. Try refreshing or proceed to login.
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleRetry}
                      className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-medium rounded-lg hover:bg-zinc-100 transition-all duration-200 shadow-lg shadow-white/10"
                    >
                      <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
                      Retry
                    </button>
                    
                    <button
                      onClick={handleGoToLogin}
                      className="px-4 py-2 bg-zinc-800 text-white text-xs font-medium rounded-lg hover:bg-zinc-700 transition-all duration-200 border border-zinc-700"
                    >
                      Go to Login
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Debug Toggle - Development Only */}
          {import.meta.env.MODE === "development" && (
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="mt-4 text-xs text-zinc-500 hover:text-zinc-400 transition-colors"
            >
              {showDebug ? "Hide" : "Show"} Debug Info
            </button>
          )}

          {/* Debug Info - Development Only */}
          {import.meta.env.MODE === "development" && showDebug && (
            <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg text-left border border-zinc-700">
              <p className="text-xs font-mono text-zinc-400 space-y-1">
                <span className="text-zinc-500">Time:</span> {timeElapsed}s<br />
                <span className="text-zinc-500">Cookies:</span> {document.cookie ? "Present" : "None"}<br />
                <span className="text-zinc-500">Has Access Token:</span> {document.cookie.includes("accessToken") ? "✅" : "❌"}<br />
                <span className="text-zinc-500">Has Refresh Token:</span> {document.cookie.includes("refreshToken") ? "✅" : "❌"}<br />
                <span className="text-zinc-500">Browser:</span> {navigator.userAgent.includes("Mobile") ? "Mobile" : "Desktop"}<br />
                <span className="text-zinc-500">Cookies Enabled:</span> {navigator.cookieEnabled ? "✅" : "❌"}
              </p>
            </div>
          )}
        </div>

        {/* Help Text */}
        <p className="mt-4 text-center text-xs text-zinc-500 font-light">
          Having trouble? Try clearing your browser cache or using a different browser
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
