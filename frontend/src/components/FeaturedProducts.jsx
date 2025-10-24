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
        <section className='py-10 sm:py-14 lg:py-20'>
            <div className='container mx-auto px-3 sm:px-4 lg:px-6'>
                {/* Section Header */}
                <div className='text-center mb-8 sm:mb-10 lg:mb-14'>
                    <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white mb-2 sm:mb-3 tracking-tight'>
                        Featured Products
                    </h2>
                    <p className='text-sm sm:text-base lg:text-lg text-zinc-400 max-w-2xl mx-auto font-light'>
                        Hand-picked selections just for you
                    </p>
                </div>

                <div className='relative'>
                    {/* Swipe indicator for mobile */}
                    <div className='sm:hidden text-center mb-4'>
                        <div className='flex items-center justify-center gap-2 text-zinc-500 text-[10px] uppercase tracking-widest'>
                            <div className='w-6 h-[1px] bg-zinc-700' />
                            <span>Swipe</span>
                            <div className='w-6 h-[1px] bg-zinc-700' />
                        </div>
                    </div>

                    <div 
                        className='overflow-hidden'
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div
                            className='flex transition-transform duration-500 ease-out'
                            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
                        >
                            {featuredProducts?.map((product) => (
                                <div 
                                    key={product._id} 
                                    className='w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2 sm:px-3'
                                >
                                    {/* Premium Minimalist Product Card */}
                                    <div 
                                        className='group w-full max-w-sm mx-auto flex flex-col overflow-hidden cursor-pointer 
                                        bg-zinc-950 border border-zinc-800/50 hover:border-zinc-700 
                                        transition-all duration-500 hover:shadow-2xl hover:shadow-zinc-900/50'
                                        onClick={() => handleCardClick(product._id)}
                                    >
                                        {/* Image Container */}
                                        <div className='relative w-full aspect-[3/4] overflow-hidden bg-zinc-900/30'>
                                            <img 
                                                className='w-full h-full object-contain p-4 transition-all duration-700 ease-out group-hover:scale-105 group-hover:p-2' 
                                                src={product.image} 
                                                alt={product.name}
                                                loading="lazy"
                                            />
                                            {/* Subtle hover overlay */}
                                            <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                                        </div>

                                        {/* Product Info */}
                                        <div className='flex flex-col flex-grow p-4 sm:p-5 lg:p-6'>
                                            {/* Product Name */}
                                            <h3 className='text-base sm:text-lg font-light tracking-wide text-white mb-3 line-clamp-2 min-h-[3rem] group-hover:text-zinc-300 transition-colors duration-300'>
                                                {product.name}
                                            </h3>
                                            
                                            <div className='mt-auto space-y-4'>
                                                {/* Price */}
                                                <div className='flex items-baseline'>
                                                    <span className='text-2xl sm:text-3xl font-light text-white tracking-tight'>
                                                        ${product.price}
                                                    </span>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className='flex gap-2 sm:gap-3'>
                                                    {/* Add to Cart Button */}
                                                    <button
                                                        className='flex-1 flex items-center justify-center bg-white text-black px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium uppercase tracking-wide
                                                        hover:bg-zinc-900 hover:text-white border border-white hover:border-zinc-700
                                                        transition-all duration-300 transform active:scale-95 group/btn overflow-hidden relative'
                                                        onClick={(e) => handleAddToCart(e, product)}
                                                    >
                                                        <div className='absolute inset-0 bg-zinc-900 transform translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300' />
                                                        <ShoppingCart className='w-4 h-4 mr-2 relative z-10' strokeWidth={1.5} />
                                                        <span className='relative z-10'>Add</span>
                                                    </button>

                                                    {/* WhatsApp Button */}
                                                    <button
                                                        className='flex items-center justify-center bg-zinc-900 text-white px-3 sm:px-4 py-2.5 sm:py-3 
                                                        border border-zinc-800 hover:border-green-600 hover:bg-green-600/10
                                                        transition-all duration-300 transform active:scale-95'
                                                        onClick={(e) => handleWhatsApp(e, product)}
                                                        title="Chat on WhatsApp"
                                                    >
                                                        <MessageCircle className='w-4 h-4' strokeWidth={1.5} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom accent line */}
                                        <div className='h-[1px] w-0 bg-white group-hover:w-full transition-all duration-500' />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons - Hidden on mobile */}
                    <button
                        onClick={prevSlide}
                        disabled={isStartDisabled}
                        className={`hidden sm:flex absolute top-1/2 -left-3 lg:-left-4 transform -translate-y-1/2 
                        w-10 h-10 lg:w-12 lg:h-12 items-center justify-center z-10
                        transition-all duration-300 ${
                            isStartDisabled 
                                ? "opacity-30 cursor-not-allowed" 
                                : "bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20"
                        }`}
                    >
                        <ChevronLeft className='w-5 h-5 lg:w-6 lg:h-6 text-white' strokeWidth={1.5} />
                    </button>

                    <button
                        onClick={nextSlide}
                        disabled={isEndDisabled}
                        className={`hidden sm:flex absolute top-1/2 -right-3 lg:-right-4 transform -translate-y-1/2 
                        w-10 h-10 lg:w-12 lg:h-12 items-center justify-center z-10
                        transition-all duration-300 ${
                            isEndDisabled 
                                ? "opacity-30 cursor-not-allowed" 
                                : "bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20"
                        }`}
                    >
                        <ChevronRight className='w-5 h-5 lg:w-6 lg:h-6 text-white' strokeWidth={1.5} />
                    </button>

                    {/* Minimalist Dot Indicators for mobile */}
                    <div className='flex justify-center mt-6 sm:mt-8 gap-1.5 sm:hidden'>
                        {Array.from({ length: Math.ceil(featuredProducts.length / itemsPerPage) }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index * itemsPerPage)}
                                className={`transition-all duration-300 ${
                                    Math.floor(currentIndex / itemsPerPage) === index
                                        ? 'w-8 h-0.5 bg-white'
                                        : 'w-6 h-0.5 bg-white/30'
                                }`}
                                aria-label={`Go to page ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
