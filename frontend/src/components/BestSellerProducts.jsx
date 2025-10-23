import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight, MessageCircle, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";

const BestSellerProducts = ({ bestSellerProducts }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const { addToCart } = useCartStore();
    const { user } = useUserStore();
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setItemsPerPage(1);
            else if (window.innerWidth < 1024) setItemsPerPage(2);
            else if (window.innerWidth < 1280) setItemsPerPage(3);
            else setItemsPerPage(4);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe && !isEndDisabled) {
            nextSlide();
        }
        if (isRightSwipe && !isStartDisabled) {
            prevSlide();
        }

        setTouchStart(0);
        setTouchEnd(0);
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => 
            Math.min(prevIndex + itemsPerPage, bestSellerProducts.length - itemsPerPage)
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - itemsPerPage, 0));
    };

    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        if (!user) {
            toast.error("Please login to add products to cart", { id: "login" });
            setTimeout(() => {
                navigate("/signup");
            }, 1000);
            return;
        } else {
            addToCart(product);
        }
    };

    const handleWhatsApp = (e, product) => {
        e.stopPropagation();
        const message = encodeURIComponent(
            `Hi! I'm interested in this product:\n${product.name}\nPrice: $${product.price}\nLink: ${window.location.origin}/product/${product._id}`
        );
        const phoneNumber = "1234567890"; // Update with your WhatsApp number
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    };

    const handleCardClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const isStartDisabled = currentIndex === 0;
    const isEndDisabled = currentIndex >= bestSellerProducts.length - itemsPerPage;

    return (
        <div className='py-8 sm:py-12 lg:py-16 bg-gray-900/50'>
            <div className='container mx-auto px-4'>
                {/* Section Header */}
                <div className='text-center mb-8 sm:mb-10 lg:mb-12'>
                    <div className='flex items-center justify-center gap-3 mb-3 sm:mb-4'>
                        <TrendingUp className='w-8 h-8 sm:w-10 sm:h-10 text-blue-400' />
                        <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-white'>
                            Best Sellers
                        </h2>
                    </div>
                    <p className='text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-4'>
                        Our most popular products loved by customers
                    </p>
                </div>

                <div className='relative'>
                    {/* Swipe instruction for mobile */}
                    <div className='md:hidden text-center mb-4'>
                        <p className='text-sm text-gray-500'>← Swipe to browse →</p>
                    </div>

                    <div 
                        className='overflow-hidden'
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div
                            className='flex transition-transform duration-500 ease-in-out'
                            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
                        >
                            {bestSellerProducts?.map((product) => (
                                <div 
                                    key={product._id} 
                                    className='w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2 sm:px-3'
                                >
                                    <div 
                                        className='bg-gray-800 rounded-lg shadow-xl overflow-hidden h-full transition-all duration-300 hover:shadow-2xl border border-blue-500/30 hover:border-blue-400/50 group cursor-pointer relative'
                                        onClick={() => handleCardClick(product._id)}
                                    >
                                        {/* Best Seller Badge */}
                                        <div className='absolute top-3 right-3 z-10 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1'>
                                            <TrendingUp className='w-3 h-3' />
                                            <span>Best Seller</span>
                                        </div>

                                        {/* Image Container */}
                                        <div className='relative overflow-hidden bg-gray-900'>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className='w-full h-48 sm:h-56 lg:h-64 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110'
                                            />
                                            <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300' />
                                        </div>

                                        {/* Product Info */}
                                        <div className='p-3 sm:p-4 lg:p-5 flex flex-col'>
                                            <h3 className='text-base sm:text-lg font-semibold mb-2 text-white line-clamp-2 min-h-[3rem]'>
                                                {product.name}
                                            </h3>
                                            <p className='text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4'>
                                                ${product.price.toFixed(2)}
                                            </p>
                                            
                                            {/* Action Buttons */}
                                            <div className='flex gap-2 sm:gap-3 mt-auto'>
                                                <button
                                                    onClick={(e) => handleAddToCart(e, product)}
                                                    className='flex-1 bg-blue-500 text-white font-semibold py-2 sm:py-2.5 lg:py-3 px-3 sm:px-4 rounded-none
                                                    transition-all duration-300 flex items-center justify-center
                                                    hover:bg-blue-600 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-xs sm:text-sm'
                                                >
                                                    <ShoppingCart className='w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2' />
                                                    <span className='hidden sm:inline'>Add to Cart</span>
                                                    <span className='sm:hidden'>Cart</span>
                                                </button>

                                                <button
                                                    onClick={(e) => handleWhatsApp(e, product)}
                                                    className='flex items-center justify-center rounded-none bg-green-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm font-semibold
                                                    hover:bg-green-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
                                                    title="Chat on WhatsApp"
                                                >
                                                    <MessageCircle className='w-4 h-4 sm:w-5 sm:h-5' />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        disabled={isStartDisabled}
                        className={`hidden md:block absolute top-1/2 -left-4 lg:-left-5 transform -translate-y-1/2 p-2 lg:p-3 rounded-full transition-all duration-300 z-10 ${
                            isStartDisabled 
                                ? "bg-gray-700 cursor-not-allowed opacity-50" 
                                : "bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 hover:border-white/40"
                        }`}
                    >
                        <ChevronLeft className='w-5 h-5 lg:w-6 lg:h-6 text-white' />
                    </button>

                    <button
                        onClick={nextSlide}
                        disabled={isEndDisabled}
                        className={`hidden md:block absolute top-1/2 -right-4 lg:-right-5 transform -translate-y-1/2 p-2 lg:p-3 rounded-full transition-all duration-300 z-10 ${
                            isEndDisabled 
                                ? "bg-gray-700 cursor-not-allowed opacity-50" 
                                : "bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 hover:border-white/40"
                        }`}
                    >
                        <ChevronRight className='w-5 h-5 lg:w-6 lg:h-6 text-white' />
                    </button>

                    {/* Dot Indicators for mobile */}
                    <div className='flex justify-center mt-6 space-x-2 md:hidden'>
                        {Array.from({ length: Math.ceil(bestSellerProducts.length / itemsPerPage) }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index * itemsPerPage)}
                                className={`transition-all duration-300 rounded-full ${
                                    Math.floor(currentIndex / itemsPerPage) === index
                                        ? 'w-8 h-2 bg-blue-400'
                                        : 'w-2 h-2 bg-white/40'
                                }`}
                                aria-label={`Go to page ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BestSellerProducts;