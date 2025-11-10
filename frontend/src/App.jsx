import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import CheckoutPage from "./pages/CheckoutPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import CartPage from "./pages/CartPage";
import { useCartStore } from "./stores/useCartStore";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";
import ProductDetailPage from "./pages/ProductDetailPage";

function App() {
    const { user, checkAuth, checkingAuth } = useUserStore();
    const { getCartItems } = useCartStore();
    
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (!user) return;

        getCartItems();
    }, [getCartItems, user]);

    // Cleanup: Ensure scroll is never locked
    useEffect(() => {
        return () => {
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';
        };
    }, []);

    if (checkingAuth) return <LoadingSpinner />;

    return (
        <div className='min-h-screen bg-black text-white relative flex flex-col'>
            {/* Premium Black Background with Subtle Gradient */}
            <div className='fixed inset-0 overflow-hidden pointer-events-none -z-10'>
                <div className='absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900' />
                
                {/* Subtle noise texture overlay for depth */}
                <div 
                    className='absolute inset-0 opacity-[0.015]' 
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    }}
                />
                
                {/* Minimal accent glow - top */}
                <div className='absolute top-0 left-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl' />
                
                {/* Minimal accent glow - bottom right */}
                <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-zinc-400/[0.01] rounded-full blur-3xl' />
            </div>

            {/* Navbar */}
            <Navbar />
            
            {/* Main Content */}
            <main className='relative z-10 pt-12 sm:pt-14 md:pt-16 flex-grow'>
                <ScrollToTop />
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to='/' />} />
                    <Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/' />} />
                    <Route
                        path='/secret-dashboard'
                        element={user?.role === "admin" ? <AdminPage /> : <Navigate to='/login' />}
                    />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path='/category/:category' element={<CategoryPage />} />
                    <Route path='/cart' element={user ? <CartPage /> : <Navigate to='/login' />} />
                    <Route path='/checkout' element={user ? <CheckoutPage /> : <Navigate to='/login' />} />
                    <Route
                        path='/purchase-success'
                        element={user ? <PurchaseSuccessPage /> : <Navigate to='/login' />}
                    />
                    <Route path='/purchase-cancel' element={user ? <PurchaseCancelPage /> : <Navigate to='/login' />} />
                </Routes>
            </main>
            
            {/* Footer */}
            <Footer />
            
            {/* Enhanced Toast Notifications - Premium Dark Theme */}
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
                    // Default options
                    className: '',
                    duration: 2500, // Shorter, less annoying
                    style: {
                        background: 'rgba(24, 24, 27, 0.95)', // zinc-900 with transparency
                        color: '#ffffff',
                        border: '1px solid rgba(39, 39, 42, 0.8)', // zinc-800 with transparency
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
                    // Success toast styling
                    success: {
                        duration: 2000, // Quick success feedback
                        iconTheme: {
                            primary: '#10b981', // green-500
                            secondary: '#18181b',
                        },
                        style: {
                            border: '1px solid rgba(16, 185, 129, 0.3)', // green border
                            background: 'rgba(24, 24, 27, 0.98)',
                        },
                    },
                    // Error toast styling
                    error: {
                        duration: 3500, // Slightly longer for errors
                        iconTheme: {
                            primary: '#ef4444', // red-500
                            secondary: '#18181b',
                        },
                        style: {
                            border: '1px solid rgba(239, 68, 68, 0.3)', // red border
                            background: 'rgba(24, 24, 27, 0.98)',
                        },
                    },
                    // Loading toast styling
                    loading: {
                        duration: Infinity, // Loading stays until dismissed
                        iconTheme: {
                            primary: '#3b82f6', // blue-500
                            secondary: '#18181b',
                        },
                        style: {
                            border: '1px solid rgba(59, 130, 246, 0.3)', // blue border
                        },
                    },
                }}
            />
        </div>
    );
}

export default App;
