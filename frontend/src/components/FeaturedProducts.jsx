import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";

const FeaturedProducts = ({ featuredProducts }) => {
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

    // Touch handlers for mobile swipe
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
            Math.min(prevIndex + itemsPerPage, featuredProducts.length - itemsPerPage)
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
            toast.success("Added to cart!");
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
    const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

    return (
        <div className='py-8 sm:py-12 lg:py-16'>
            <div className='container mx-auto px-4'>
                {/* Section Header */}
                <div className='text-center mb-8 sm:mb-10 lg:mb-12'>
                    <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4'>
                        Featured Products
                    </h2>
                    <p className='text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-4'>
                        Hand-picked selections just for you
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
                            {featuredProducts?.map((product) => (
                                <div 
                                    key={product._id} 
                                    className='w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2 sm:px-3'
                                >
                                    {/* Updated Product Card with same dimensions and features */}
                                    <div 
                                        className='w-full max-w-sm mx-auto flex flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg cursor-pointer hover:border-emerald-500 transition-all duration-300 bg-gray-800/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-emerald-500/20 group'
                                        onClick={() => handleCardClick(product._id)}
                                    >
                                        {/* Image Container - Shows complete image */}
                                        <div className='relative w-full aspect-[3/4] overflow-hidden bg-gray-900/50 p-3'>
                                            <img 
                                                className='w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105' 
                                                src={product.image} 
                                                alt={product.name}
                                                loading="lazy"
                                            />
                                            <div className='absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                                        </div>

                                        {/* Product Info */}
                                        <div className='flex flex-col flex-grow p-4 sm:p-5'>
                                            <h5 className='text-lg sm:text-xl font-bold tracking-tight text-white mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-emerald-400 transition-colors duration-300'>
                                                {product.name}
                                            </h5>
                                            
                                            <div className='mt-auto space-y-4'>
                                                <div className='flex items-baseline gap-2'>
                                                    <span className='text-3xl sm:text-4xl font-bold text-emerald-400'>
                                                        ${product.price}
                                                    </span>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className='flex gap-3'>
                                                    {/* Add to Cart Button */}
                                                    <button
                                                        className='flex-1 flex items-center justify-center rounded-lg bg-emerald-600 text-white px-4 py-3 text-sm font-semibold
                                                        hover:bg-emerald-500 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-emerald-500/50'
                                                        onClick={(e) => handleAddToCart(e, product)}
                                                    >
                                                        <ShoppingCart className='w-5 h-5 mr-2' />
                                                        <span>Add to Cart</span>
                                                    </button>

                                                    {/* WhatsApp Button */}
                                                    <button
                                                        className='flex items-center justify-center rounded-lg bg-green-600 text-white px-4 py-3 text-sm font-semibold
                                                        hover:bg-green-500 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-green-500/50'
                                                        onClick={(e) => handleWhatsApp(e, product)}
                                                        title="Chat on WhatsApp"
                                                    >
                                                        <MessageCircle className='w-5 h-5' />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons - Hidden on mobile, visible on tablet+ */}
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
                        {Array.from({ length: Math.ceil(featuredProducts.length / itemsPerPage) }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index * itemsPerPage)}
                                className={`transition-all duration-300 rounded-full ${
                                    Math.floor(currentIndex / itemsPerPage) === index
                                        ? 'w-8 h-2 bg-white'
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

export default FeaturedProducts;