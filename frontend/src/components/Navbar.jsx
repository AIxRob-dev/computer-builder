import { memo } from "react";
import { ShoppingCart, LogOut, Lock, Home, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

// ⚡ OPTIMIZED: Memoized navbar to prevent unnecessary re-renders
const Navbar = () => {
    const { user, logout } = useUserStore();
    const isAdmin = user?.role === "admin";
    const { cart } = useCartStore();

    return (
        <header className='fixed top-0 left-0 w-full bg-white backdrop-blur-xl shadow-lg z-40 border-b border-blue-100'>
            <div className='max-w-7xl mx-auto px-3 sm:px-6'>
                <div className='flex justify-between items-center h-12 sm:h-14 md:h-16'>
                    {/* Logo */}
                    <a 
                        href='/' 
                        className='flex-shrink-0 flex items-center gap-2 sm:gap-3 transition-transform duration-300 hover:scale-105'
                    >
                        <div className='relative'>
                            {/* ⚡ OPTIMIZED: Simplified glow effect */}
                            <div className='absolute inset-0 bg-blue-500/20 blur-xl rounded-full'></div>
                            
                            {/* ⚡ CRITICAL: Add loading="eager" and decoding="async" */}
                            <img 
                                src="/font.png" 
                                alt="Computer Builder" 
                                className='h-14 sm:h-12 md:h-14 w-auto'
                                loading="eager"
                                decoding="async"
                                width="140"
                                height="56"
                            />
                        </div>
                        
                        <div className='flex flex-col'>
                            <span className='text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent tracking-tight'>
                                Computer Builder
                            </span>
                            <span className='text-[10px] sm:text-xs text-slate-600 font-medium tracking-wider'>
                                WE BUILD YOUR P
                            </span>
                        </div>
                    </a>
                    
                    {/* Navigation */}
                    <nav className='flex items-center gap-1.5 sm:gap-2 flex-shrink-0'>
                        {/* Home Icon */}
                        <Link
                            to="/"
                            className='p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200'
                            title="Home"
                            aria-label="Home"
                        >
                            <Home size={18} strokeWidth={2} />
                        </Link>

                        {/* Cart */}
                        {user && (
                            <Link
                                to="/cart"
                                className='relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200'
                                title="Cart"
                                aria-label="Shopping Cart"
                            >
                                <ShoppingCart size={18} strokeWidth={2} />
                                {cart.length > 0 && (
                                    <span className='absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1'>
                                        {cart.length}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* Admin Dashboard */}
                        {isAdmin && (
                            <Link
                                to="/secret-dashboard"
                                className='hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors duration-200 border border-blue-700 whitespace-nowrap'
                                title="Dashboard"
                                aria-label="Admin Dashboard"
                            >
                                <Lock size={14} strokeWidth={2} />
                                <span>Admin</span>
                            </Link>
                        )}

                        {/* Auth Buttons */}
                        {user ? (
                            <button
                                onClick={logout}
                                className='flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm font-medium rounded-md transition-colors duration-200 border border-gray-300 whitespace-nowrap'
                                title="Log Out"
                                aria-label="Log Out"
                            >
                                <LogOut size={16} strokeWidth={2} />
                                <span className='hidden xs:inline'>Logout</span>
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className='flex items-center gap-1.5 px-2.5 py-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200 text-xs sm:text-sm font-medium whitespace-nowrap'
                                    title="Log In"
                                    aria-label="Log In"
                                >
                                    <User size={16} strokeWidth={2} />
                                    <span className='hidden sm:inline'>Login</span>
                                </Link>
                                <Link
                                    to="/signup"
                                    className='px-2.5 py-1.5 sm:px-3 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 font-semibold text-xs sm:text-sm whitespace-nowrap'
                                    aria-label="Sign Up"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

// ⚡ CRITICAL: Memoize to prevent re-renders when cart/user hasn't changed
export default memo(Navbar);
