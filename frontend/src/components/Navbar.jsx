import { ShoppingCart, LogOut, Lock, Home, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const Navbar = () => {
    const { user, logout } = useUserStore();
    const isAdmin = user?.role === "admin";
    const { cart } = useCartStore();

    return (
        <header className='fixed top-0 left-0 w-full bg-black/95 backdrop-blur-xl shadow-sm z-40 border-b border-zinc-800/50'>
            <div className='max-w-7xl mx-auto px-3 sm:px-6'>
                <div className='flex justify-between items-center h-12 sm:h-14 md:h-16'>
                    {/* Logo */}
                    <Link 
                        to='/' 
                        className='flex-shrink-0 transition-opacity duration-200 hover:opacity-80'
                    >
                        <img 
                            src="/fontbol.png" 
                            alt="SLATEBOOKS" 
                            className='h-6 sm:h-6 md:h-7 w-auto max-w-[180px] sm:max-w-none'
                        />
                    </Link>

                    {/* Navigation */}
                    <nav className='flex items-center gap-1.5 sm:gap-2'>
                        {/* Home Icon */}
                        <Link
                            to={"/"}
                            className='p-2 text-zinc-400 hover:text-white hover:bg-zinc-900/60 rounded-md transition-all duration-200'
                            title="Home"
                        >
                            <Home size={18} strokeWidth={2} />
                        </Link>

                        {/* Cart */}
                        {user && (
                            <Link
                                to={"/cart"}
                                className='relative p-2 text-zinc-400 hover:text-white hover:bg-zinc-900/60 rounded-md transition-all duration-200'
                                title="Cart"
                            >
                                <ShoppingCart size={18} strokeWidth={2} />
                                {cart.length > 0 && (
                                    <span className='absolute -top-1 -right-1 bg-white text-black text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1'>
                                        {cart.length}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* Admin Dashboard */}
                        {isAdmin && (
                            <Link
                                to={"/secret-dashboard"}
                                className='hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-md transition-all duration-200 border border-zinc-800'
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
                                className='flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs sm:text-sm font-medium rounded-md transition-all duration-200 border border-zinc-800'
                                title="Log Out"
                            >
                                <LogOut size={16} strokeWidth={2} />
                                <span className='hidden xs:inline'>Logout</span>
                            </button>
                        ) : (
                            <>
                                <Link
                                    to={"/login"}
                                    className='flex items-center gap-1.5 px-2.5 py-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900/60 rounded-md transition-all duration-200 text-xs sm:text-sm font-medium'
                                    title="Log In"
                                >
                                    <User size={16} strokeWidth={2} />
                                    <span className='hidden sm:inline'>Login</span>
                                </Link>
                                <Link
                                    to={"/signup"}
                                    className='px-2.5 py-1.5 sm:px-3 sm:py-2 bg-white hover:bg-zinc-100 text-black rounded-md transition-all duration-200 font-semibold text-xs sm:text-sm whitespace-nowrap'
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
