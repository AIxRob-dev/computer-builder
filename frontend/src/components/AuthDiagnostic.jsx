import { useState } from "react";
import { Shield, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";

const AuthDiagnostic = () => {
  const [results, setResults] = useState(null);
  const [testing, setTesting] = useState(false);

  const runDiagnostics = async () => {
    setTesting(true);
    const diagnostics = {};

    // Test 1: Cookie Support
    try {
      document.cookie = "test=1; path=/; SameSite=Lax";
      diagnostics.cookiesEnabled = document.cookie.indexOf("test=") !== -1;
      document.cookie = "test=1; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
    } catch (e) {
      diagnostics.cookiesEnabled = false;
    }

    // Test 2: LocalStorage Support
    try {
      localStorage.setItem("test", "1");
      diagnostics.localStorageEnabled = localStorage.getItem("test") === "1";
      localStorage.removeItem("test");
    } catch (e) {
      diagnostics.localStorageEnabled = false;
    }

    // Test 3: Current Cookies
    diagnostics.currentCookies = document.cookie || "None";
    diagnostics.hasAccessToken = document.cookie.includes("accessToken");
    diagnostics.hasRefreshToken = document.cookie.includes("refreshToken");

    // Test 4: Browser Info
    diagnostics.userAgent = navigator.userAgent;
    diagnostics.platform = navigator.platform;
    diagnostics.cookiesEnabledByBrowser = navigator.cookieEnabled;
    diagnostics.isPrivateMode = false;

    // Test 5: API Connection
    try {
      const baseURL = import.meta.env.MODE === "development"
        ? "http://localhost:5000/api"
        : "https://computerbuilders-in.onrender.com/api";
      
      const response = await fetch(`${baseURL}/health`, {
        credentials: 'include'
      });
      
      diagnostics.apiReachable = response.ok;
      diagnostics.apiStatus = response.status;
    } catch (e) {
      diagnostics.apiReachable = false;
      diagnostics.apiError = e.message;
    }

    // Test 6: Private Browsing Detection
    try {
      const testKey = "__test_storage__";
      window.sessionStorage.setItem(testKey, "1");
      window.sessionStorage.removeItem(testKey);
      diagnostics.isPrivateMode = false;
    } catch (e) {
      diagnostics.isPrivateMode = true;
    }

    setResults(diagnostics);
    setTesting(false);
  };

  const StatusIcon = ({ status }) => {
    if (status) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (status === false) return <XCircle className="h-5 w-5 text-red-500" />;
    return <AlertCircle className="h-5 w-5 text-yellow-500" />;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={runDiagnostics}
        disabled={testing}
        className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg border border-zinc-700 hover:bg-zinc-800 transition-colors shadow-lg"
      >
        {testing ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-sm font-medium">Testing...</span>
          </>
        ) : (
          <>
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Run Auth Test</span>
          </>
        )}
      </button>

      {results && (
        <div className="absolute bottom-full right-0 mb-2 w-96 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl p-4 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Auth Diagnostics
            </h3>
            <button
              onClick={() => setResults(null)}
              className="text-zinc-400 hover:text-white"
            >
              ×
            </button>
          </div>

          <div className="space-y-2 text-sm">
            {/* Cookie Tests */}
            <div className="flex items-center gap-2 py-2 border-b border-zinc-800">
              <StatusIcon status={results.cookiesEnabled} />
              <span className="text-zinc-300">Third-party Cookies</span>
            </div>

            <div className="flex items-center gap-2 py-2 border-b border-zinc-800">
              <StatusIcon status={results.hasAccessToken} />
              <span className="text-zinc-300">Access Token Cookie</span>
            </div>

            <div className="flex items-center gap-2 py-2 border-b border-zinc-800">
              <StatusIcon status={results.hasRefreshToken} />
              <span className="text-zinc-300">Refresh Token Cookie</span>
            </div>

            {/* Storage Tests */}
            <div className="flex items-center gap-2 py-2 border-b border-zinc-800">
              <StatusIcon status={results.localStorageEnabled} />
              <span className="text-zinc-300">LocalStorage Available</span>
            </div>

            {/* API Test */}
            <div className="flex items-center gap-2 py-2 border-b border-zinc-800">
              <StatusIcon status={results.apiReachable} />
              <span className="text-zinc-300">API Connection</span>
              {results.apiStatus && (
                <span className="text-xs text-zinc-500">({results.apiStatus})</span>
              )}
            </div>

            {/* Warnings */}
            {results.isPrivateMode && (
              <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-500 text-xs">
                ⚠️ Private browsing detected - cookies may be limited
              </div>
            )}

            {!results.cookiesEnabled && (
              <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs">
                ❌ Cookies blocked - using localStorage fallback
              </div>
            )}

            {!results.apiReachable && (
              <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs">
                ❌ Cannot reach API server
                {results.apiError && <div className="mt-1">{results.apiError}</div>}
              </div>
            )}

            {/* Device Info */}
            <div className="mt-3 pt-3 border-t border-zinc-800">
              <p className="text-xs text-zinc-500 break-all">
                <strong>Device:</strong> {results.platform}
              </p>
              <p className="text-xs text-zinc-500 break-all mt-1">
                <strong>Browser Cookies:</strong> {results.cookiesEnabledByBrowser ? "Enabled" : "Disabled"}
              </p>
            </div>

            {/* Recommendations */}
            <div className="mt-3 pt-3 border-t border-zinc-800">
              <p className="text-xs font-semibold text-white mb-2">Recommendations:</p>
              {!results.cookiesEnabled && (
                <p className="text-xs text-zinc-400">• Enable third-party cookies in browser settings</p>
              )}
              {results.isPrivateMode && (
                <p className="text-xs text-zinc-400">• Try using normal browsing mode</p>
              )}
              {!results.apiReachable && (
                <p className="text-xs text-zinc-400">• Check your internet connection</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthDiagnostic;
