import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const Navbar = () => {
    const { user, logout } = useUserStore();
    const isAdmin = user?.role === "admin";
    const { cart } = useCartStore();

    return (
        <header className='fixed top-0 left-0 w-full bg-black bg-opacity-95 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-gray-800'>
            <div className='container mx-auto px-4 py-4'>
                <div className='flex flex-wrap justify-between items-center'>
                    <Link to='/' className='text-2xl font-bold text-white items-center space-x-2 flex hover:text-gray-300 transition-colors duration-300'>
                        SlateBooks
                    </Link>

                    <nav className='flex flex-wrap items-center gap-4'>
                        <Link
                            to={"/"}
                            className='text-gray-300 hover:text-white transition duration-300 ease-in-out font-medium'
                        >
                            Home
                        </Link>
                        {user && (
                            <Link
                                to={"/cart"}
                                className='relative group text-gray-300 hover:text-white transition duration-300 ease-in-out'
                            >
                                <ShoppingCart className='inline-block mr-1 group-hover:text-white' size={20} />
                                <span className='hidden sm:inline'>Cart</span>
                                {cart.length > 0 && (
                                    <span
                                        className='absolute -top-2 -left-2 bg-white text-black rounded-full px-2 py-0.5 
                                    text-xs group-hover:bg-gray-200 transition duration-300 ease-in-out font-semibold'
                                    >
                                        {cart.length}
                                    </span>
                                )}
                            </Link>
                        )}
                        {isAdmin && (
                            <Link
                                className='bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-sm font-medium
                                 transition duration-300 ease-in-out flex items-center'
                                to={"/secret-dashboard"}
                            >
                                <Lock className='inline-block mr-1' size={18} />
                                <span className='hidden sm:inline'>Dashboard</span>
                            </Link>
                        )}

                        {user ? (
                            <button
                                className='bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 
                        rounded-sm flex items-center transition duration-300 ease-in-out border border-gray-700 hover:border-gray-600'
                                onClick={logout}
                            >
                                <LogOut size={18} />
                                <span className='hidden sm:inline ml-2'>Log Out</span>
                            </button>
                        ) : (
                            <>
                                <Link
                                    to={"/signup"}
                                    className='bg-white hover:bg-gray-200 text-black py-2 px-4 
                                    rounded-sm flex items-center transition duration-300 ease-in-out font-semibold'
                                >
                                    <UserPlus className='mr-2' size={18} />
                                    Sign Up
                                </Link>
                                <Link
                                    to={"/login"}
                                    className='bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 
                                    rounded-sm flex items-center transition duration-300 ease-in-out border border-gray-700 hover:border-gray-600'
                                >
                                    <LogIn className='mr-2' size={18} />
                                    Login
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