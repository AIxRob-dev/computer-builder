import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";

// ⚡ CRITICAL: Lazy load all pages for code splitting
const HomePage = lazy(() => import("./pages/HomePage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const PurchaseSuccessPage = lazy(() => import("./pages/PurchaseSuccessPage"));
const PurchaseCancelPage = lazy(() => import("./pages/PurchaseCancelPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));

// ⚡ Lazy load heavy components
const Navbar = lazy(() => import("./components/Navbar"));
const Footer = lazy(() => import("./components/Footer"));

import ScrollToTop from "./components/ScrollToTop";
import LoadingSpinner from "./components/LoadingSpinner";

import { useUserStore } from "./stores/useUserStore";
import { useCartStore } from "./stores/useCartStore";

// ⚡ OPTIMIZED: Single utility function (no repeated calls)
const ensureScrollUnlocked = () => {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.documentElement.style.overflow = '';
    document.body.classList.remove('overflow-hidden', 'no-scroll', 'modal-open');
    document.documentElement.classList.remove('overflow-hidden', 'no-scroll');
};

// ⚡ Minimal loading fallback
const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingSpinner />
    </div>
);

function App() {
    const { user, checkAuth, checkingAuth } = useUserStore();
    const { getCartItems } = useCartStore();
    const location = useLocation();
    
    // ⚡ OPTIMIZED: Single useEffect for route changes
    useEffect(() => {
        ensureScrollUnlocked();
    }, [location.pathname]);

    // ⚡ OPTIMIZED: Combined initialization logic
    useEffect(() => {
        const initApp = async () => {
            console.log("🚀 Initializing app...");
            
            // Check auth first
            await checkAuth();
            
            // Load cart only if user exists
            const currentUser = useUserStore.getState().user;
            if (currentUser) {
                console.log("🛒 Loading cart for authenticated user");
                getCartItems();
            }
            
            // Ensure scroll is unlocked after everything
            setTimeout(ensureScrollUnlocked, 100);
        };

        initApp();
        
        return () => {
            console.log("👋 App cleanup");
            ensureScrollUnlocked();
        };
    }, []); // Empty deps - only run once on mount

    // ⚡ REMOVED: Excessive monitoring interval (was causing performance issues)
    
    // ⚡ OPTIMIZED: Show loading only for protected routes
    const isProtectedRoute = [
        '/cart', 
        '/checkout', 
        '/purchase-success', 
        '/purchase-cancel', 
        '/secret-dashboard'
    ].includes(location.pathname);
    
    if (checkingAuth && isProtectedRoute) {
        return <PageLoader />;
    }

    return (
        <div className='min-h-screen bg-black text-white relative flex flex-col'>
            {/* ⚡ OPTIMIZED: Simplified background (removed heavy inline SVG) */}
            <div className='fixed inset-0 overflow-hidden pointer-events-none -z-10'>
                <div className='absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900' />
                {/* Subtle gradient overlays only */}
                <div className='absolute top-0 left-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl' />
                <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-zinc-400/[0.01] rounded-full blur-3xl' />
            </div>

            {/* ⚡ Suspense wrapper for lazy-loaded components */}
            <Suspense fallback={<div className="h-16" />}>
                <Navbar />
            </Suspense>
            
            {/* Main Content */}
            <main className='relative z-10 pt-12 sm:pt-14 md:pt-16 flex-grow'>
                <ScrollToTop />
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        {/* Public Routes */}
                        <Route path='/' element={<HomePage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                        <Route path='/category/:category' element={<CategoryPage />} />
                        
                        {/* Auth Routes */}
                        <Route 
                            path='/signup' 
                            element={!user ? <SignUpPage /> : <Navigate to='/' replace />} 
                        />
                        <Route 
                            path='/login' 
                            element={!user ? <LoginPage /> : <Navigate to='/' replace />} 
                        />
                        
                        {/* Protected Routes */}
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
                        
                        {/* Admin Routes */}
                        <Route
                            path='/secret-dashboard'
                            element={user?.role === "admin" ? <AdminPage /> : <Navigate to='/login' replace />}
                        />
                        
                        {/* Catch all */}
                        <Route path='*' element={<Navigate to='/' replace />} />
                    </Routes>
                </Suspense>
            </main>
            
            {/* Footer */}
            <Suspense fallback={<div className="h-32" />}>
                <Footer />
            </Suspense>
            
            {/* ⚡ OPTIMIZED: Simplified toast config */}
            <Toaster 
                position="bottom-right"
                reverseOrder={false}
                gutter={12}
                toastOptions={{
                    duration: 2500,
                    style: {
                        background: 'rgba(24, 24, 27, 0.95)',
                        color: '#ffffff',
                        border: '1px solid rgba(39, 39, 42, 0.8)',
                        padding: '12px 16px',
                        fontSize: '14px',
                        borderRadius: '8px',
                    },
                    success: {
                        duration: 2000,
                        iconTheme: { primary: '#10b981', secondary: '#18181b' },
                    },
                    error: {
                        duration: 3500,
                        iconTheme: { primary: '#ef4444', secondary: '#18181b' },
                    },
                }}
            />
        </div>
    );
}

export default App;
