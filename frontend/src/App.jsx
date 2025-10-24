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

    if (checkingAuth) return <LoadingSpinner />;

    return (
        <div className='min-h-screen bg-black text-white relative overflow-hidden flex flex-col'>
            {/* Premium Black Background with Subtle Gradient */}
            <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                <div className='absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900' />
                
                {/* Subtle noise texture overlay for depth */}
                <div className='absolute inset-0 opacity-[0.015]' 
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
            <div className='relative z-10 pt-12 sm:pt-14 md:pt-16 flex-grow'>
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
            </div>
            
            {/* Footer */}
            <Footer />
            
            {/* Enhanced Toast Notifications - Premium Dark Theme */}
            <Toaster 
                position="top-center"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                    // Default options
                    className: '',
                    duration: 3000,
                    style: {
                        background: '#18181b', // zinc-900
                        color: '#ffffff',
                        border: '1px solid #27272a', // zinc-800
                        padding: '16px 20px',
                        fontSize: '14px',
                        fontWeight: '300', // font-light
                        letterSpacing: '0.025em',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(10px)',
                        maxWidth: '500px',
                    },
                    // Success toast styling
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#ffffff',
                            secondary: '#18181b',
                        },
                        style: {
                            border: '1px solid #3f3f46', // zinc-700
                        },
                    },
                    // Error toast styling
                    error: {
                        duration: 4000,
                        iconTheme: {
                            primary: '#ffffff',
                            secondary: '#18181b',
                        },
                        style: {
                            border: '1px solid #3f3f46', // zinc-700
                        },
                    },
                    // Loading toast styling
                    loading: {
                        iconTheme: {
                            primary: '#71717a', // zinc-500
                            secondary: '#18181b',
                        },
                    },
                }}
            />
        </div>
    );
}

export default App;
