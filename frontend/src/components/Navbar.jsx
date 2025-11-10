import { ShoppingCart, LogOut, Lock, Home, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const Navbar = () => {
    const { user, logout } = useUserStore();
    const isAdmin = user?.role === "admin";
    const { cart } = useCartStore();

    return (
        <header className='fixed top-0 left-0 w-full bg-white backdrop-blur-xl shadow-lg z-40 border-b border-blue-100'>
            <div className='max-w-7xl mx-auto px-2 sm:px-4 lg:px-6'>
                <div className='flex justify-between items-center h-14 sm:h-16'>
                    {/* Logo - Optimized for mobile */}
                    <a 
                        href='/' 
                        className='flex-shrink-0 flex items-center gap-1.5 sm:gap-2.5 transition-all duration-300 hover:scale-105 group min-w-0'
                    >
                        <div className='relative flex-shrink-0'>
                            {/* Animated glow effect */}
                            <div className='absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-400/30 transition-all duration-300'></div>
                            
                            {/* Logo Image */}
                            <img 
                                src="/font.png" 
                                alt="Computer Builder" 
                                className='h-8 sm:h-10 md:h-12 w-auto relative z-10'
                            />
                        </div>
                        
                        <div className='flex flex-col min-w-0'>
                            <span className='text-sm sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent tracking-tight truncate'>
                                Computer Builder
                            </span>
                            <span className='text-[8px] sm:text-[10px] md:text-xs text-slate-600 font-medium tracking-wider hidden xs:block'>
                                WE BUILD YOUR PC
                            </span>
                        </div>
                    </a>

                    {/* Navigation - Optimized spacing */}
                    <nav className='flex items-center gap-1 sm:gap-1.5 md:gap-2 flex-shrink-0'>
                        {/* Home Icon */}
                        <Link
                            to={"/"}
                            className='p-1.5 sm:p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200'
                            title="Home"
                        >
                            <Home size={18} strokeWidth={2} className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                        </Link>

                        {/* Cart */}
                        {user && (
                            <Link
                                to={"/cart"}
                                className='relative p-1.5 sm:p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200'
                                title="Cart"
                            >
                                <ShoppingCart size={18} strokeWidth={2} className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                                {cart.length > 0 && (
                                    <span className='absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-blue-600 text-white text-[9px] sm:text-[10px] font-bold rounded-full min-w-[16px] sm:min-w-[18px] h-[16px] sm:h-[18px] flex items-center justify-center px-0.5 sm:px-1'>
                                        {cart.length}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* Admin Dashboard */}
                        {isAdmin && (
                            <Link
                                to={"/secret-dashboard"}
                                className='hidden md:flex items-center gap-1.5 px-2 py-1.5 sm:px-2.5 sm:py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] sm:text-xs font-medium rounded-md transition-all duration-200 border border-blue-700'
                                title="Dashboard"
                            >
                                <Lock size={14} strokeWidth={2} />
                                <span>Admin</span>
                            </Link>
                        )}

                        {/* Auth Buttons */}
                        {user ? (
                            <button
                                onClick={logout}
                                className='flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-2.5 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] sm:text-xs md:text-sm font-medium rounded-md transition-all duration-200 border border-gray-300 whitespace-nowrap'
                                title="Log Out"
                            >
                                <LogOut size={14} strokeWidth={2} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span className='hidden sm:inline'>Logout</span>
                            </button>
                        ) : (
                            <>
                                <Link
                                    to={"/login"}
                                    className='flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-2.5 sm:py-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200 text-[11px] sm:text-xs md:text-sm font-medium whitespace-nowrap'
                                    title="Log In"
                                >
                                    <User size={14} strokeWidth={2} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    <span className='hidden sm:inline'>Login</span>
                                </Link>
                                <Link
                                    to={"/signup"}
                                    className='px-2 py-1.5 sm:px-2.5 sm:py-2 md:px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all duration-200 font-semibold text-[11px] sm:text-xs md:text-sm whitespace-nowrap'
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

export default Navbar;
