import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import CheckoutPage from "./pages/CheckoutPage";
import CartPage from "./pages/CartPage";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";
import ProductDetailPage from "./pages/ProductDetailPage";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import LoadingSpinner from "./components/LoadingSpinner";

import { useUserStore } from "./stores/useUserStore";
import { useCartStore } from "./stores/useCartStore";

// ⭐ CRITICAL: Utility to force unlock scroll
const forceUnlockScroll = () => {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.documentElement.style.overflow = '';
    
    document.body.classList.remove('overflow-hidden', 'no-scroll', 'modal-open');
    document.documentElement.classList.remove('overflow-hidden', 'no-scroll');
    
    console.log("🔓 Scroll forcefully unlocked");
};

if (typeof window !== 'undefined') {
    window.forceUnlockScroll = forceUnlockScroll;
}

function App() {
    const { user, checkAuth, checkingAuth } = useUserStore();
    const { getCartItems } = useCartStore();
    const location = useLocation();
    
    useEffect(() => {
        console.log("🔄 Route changed:", location.pathname);
        forceUnlockScroll();
    }, [location.pathname]);

    useEffect(() => {
        console.log("🚀 App mounted - unlocking scroll");
        forceUnlockScroll();
        
        return () => {
            console.log("👋 App unmounting - unlocking scroll");
            forceUnlockScroll();
        };
    }, []);

    useEffect(() => {
        if (!checkingAuth) {
            console.log("✅ Auth check complete - ensuring scroll is unlocked");
            setTimeout(forceUnlockScroll, 100);
        }
    }, [checkingAuth]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const hasModal = document.querySelector('[role="dialog"], .modal, [data-modal="true"]');
            const isHidden = window.getComputedStyle(document.body).overflow === 'hidden';
            
            if (isHidden && !hasModal) {
                console.warn("⚠️ Detected stuck scroll lock - fixing");
                forceUnlockScroll();
            }
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    // Check authentication on mount - SILENTLY in background
    useEffect(() => {
        console.log("🚀 App mounted - initiating auth check");
        checkAuth();
    }, [checkAuth]);

    // Load cart items when user is authenticated
    useEffect(() => {
        if (!user) {
            console.log("👤 No user - skipping cart load");
            return;
        }

        console.log("🛒 User authenticated - loading cart");
        getCartItems();
    }, [getCartItems, user]);

    useEffect(() => {
        console.log("🔍 Auth State Changed:", {
            checkingAuth,
            hasUser: !!user,
            userId: user?._id,
            userRole: user?.role,
            timestamp: new Date().toISOString()
        });
    }, [checkingAuth, user]);

    // ⭐ IMPROVED: Don't block the entire UI while checking auth
    // Only show loading spinner for protected routes that require auth
    const isProtectedRoute = ['/cart', '/checkout', '/purchase-success', '/purchase-cancel', '/secret-dashboard'].includes(location.pathname);
    
    // Only show full-page loading for protected routes while checking auth
    if (checkingAuth && isProtectedRoute) {
        console.log("⏳ Checking authentication for protected route...");
        return <LoadingSpinner />;
    }

    console.log("✅ Rendering app - checkingAuth:", checkingAuth, "user:", !!user);

    return (
        <div className='min-h-screen bg-black text-white relative flex flex-col'>
            {/* Premium Black Background with Subtle Gradient */}
            <div className='fixed inset-0 overflow-hidden pointer-events-none -z-10'>
                <div className='absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900' />
                
                <div 
                    className='absolute inset-0 opacity-[0.015]' 
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    }}
                />
                
                <div className='absolute top-0 left-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl' />
                <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-zinc-400/[0.01] rounded-full blur-3xl' />
            </div>

            {/* Navbar */}
            <Navbar />
            
            {/* Main Content */}
            <main className='relative z-10 pt-12 sm:pt-14 md:pt-16 flex-grow'>
                <ScrollToTop />
                <Routes>
                    {/* Public Routes - Always accessible */}
                    <Route path='/' element={<HomePage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path='/category/:category' element={<CategoryPage />} />
                    
                    {/* Auth Routes - Redirect to home if already logged in */}
                    <Route 
                        path='/signup' 
                        element={!user ? <SignUpPage /> : <Navigate to='/' replace />} 
                    />
                    <Route 
                        path='/login' 
                        element={!user ? <LoginPage /> : <Navigate to='/' replace />} 
                    />
                    
                    {/* Protected Routes - Require authentication */}
                    <Route 
                        path='/cart' 
                        element={user ? <CartPage /> : <Navigate to='/login' replace />} 
                    />
                    <Route 
                        path='/checkout' 
                        element={user ? <CheckoutPage /> : <Navigate to='/login' replace />} 
                    />
                    <Route
                        path='/purchase-success'
                        element={user ? <PurchaseSuccessPage /> : <Navigate to='/login' replace />}
                    />
                    <Route 
                        path='/purchase-cancel' 
                        element={user ? <PurchaseCancelPage /> : <Navigate to='/login' replace />} 
                    />
                    
                    {/* Admin Routes - Require admin role */}
                    <Route
                        path='/secret-dashboard'
                        element={user?.role === "admin" ? <AdminPage /> : <Navigate to='/login' replace />}
                    />
                    
                    {/* Catch all - redirect to home */}
                    <Route path='*' element={<Navigate to='/' replace />} />
                </Routes>
            </main>
            
            {/* Footer */}
            <Footer />
            
            <Toaster 
                position="bottom-right"
                reverseOrder={false}
                gutter={12}
                containerStyle={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                }}
                toastOptions={{
                    className: '',
                    duration: 2500,
                    style: {
                        background: 'rgba(24, 24, 27, 0.95)',
                        color: '#ffffff',
                        border: '1px solid rgba(39, 39, 42, 0.8)',
                        padding: '12px 16px',
                        fontSize: '14px',
                        fontWeight: '400',
                        letterSpacing: '0.015em',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '8px',
                        maxWidth: '400px',
                        minWidth: '250px',
                    },
                    success: {
                        duration: 2000,
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#18181b',
                        },
                        style: {
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            background: 'rgba(24, 24, 27, 0.98)',
                        },
                    },
                    error: {
                        duration: 3500,
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#18181b',
                        },
                        style: {
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            background: 'rgba(24, 24, 27, 0.98)',
                        },
                    },
                    loading: {
                        duration: Infinity,
                        iconTheme: {
                            primary: '#3b82f6',
                            secondary: '#18181b',
                        },
                        style: {
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                        },
                    },
                }}
            />
        </div>
    );
}

export default App;
