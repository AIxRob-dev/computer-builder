import { useEffect, useState, useCallback, useMemo, useRef, memo } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight, MessageCircle, TrendingUp, Check, PackageX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";

// Memoized BestSellerCard component - Responsive: Compact mobile, full desktop
const BestSellerCard = memo(({ 
    product, 
    isInCart, 
    user,
    onAddToCart, 
    onWhatsApp, 
    onCardClick 
}) => {
    const isOutOfStock = product.inStock === false;

    return (
        <div className='w-full md:w-1/2 flex-shrink-0 px-2'>
            <div 
                className={`group bg-white border border-gray-200 hover:border-gray-300 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 h-full flex flex-row
                ${isOutOfStock ? 'opacity-60' : 'hover:shadow-lg'}
                `}
                onClick={() => onCardClick(product._id)}
            >
                {/* Image Section - Compact on mobile, full on desktop */}
                <div className='relative w-32 md:w-64 lg:w-72 flex-shrink-0 bg-white'>
                    {/* Status Badge - Only show if out of stock */}
                    {isOutOfStock && (
                        <div className='absolute top-1 left-1 md:top-2 md:left-2 z-10'>
                            <div className='bg-red-500 text-white px-1.5 py-0.5 md:px-2 md:py-1 rounded text-[10px] md:text-xs font-bold'>
                                Out of stock
                            </div>
                        </div>
                    )}

                    <div className='relative w-full aspect-square md:aspect-[4/5] overflow-hidden bg-white p-2 md:p-4'>
                        <img 
                            className={`w-full h-full object-contain transition-transform duration-300
                            ${isOutOfStock ? 'grayscale opacity-50' : 'group-hover:scale-105'}
                            `}
                            src={product.image} 
                            alt={product.name}
                            loading="lazy"
                            decoding="async"
                        />
                        
                        {isOutOfStock && (
                            <div className='absolute inset-0 flex items-center justify-center bg-white/80'>
                                <div className='text-center'>
                                    <PackageX className='w-8 md:w-12 h-8 md:h-12 text-gray-400 mx-auto mb-1 md:mb-2' strokeWidth={1.5} />
                                    <p className='text-gray-600 text-[10px] md:text-sm font-semibold hidden md:block'>
                                        Currently Unavailable
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Info Section - Compact on mobile, full on desktop */}
                <div className='flex flex-col flex-grow p-3 md:p-5'>
                    {/* Product Name */}
                    <h3 className={`text-xs md:text-base lg:text-lg font-normal mb-2 md:mb-4 line-clamp-2 leading-snug
                        ${isOutOfStock ? 'text-gray-400' : 'text-gray-900 group-hover:text-blue-700'}
                        transition-colors duration-200`}
                    >
                        {product.name}
                    </h3>
                    
                    {/* Price Section */}
                    <div className='mb-2 md:mb-4'>
                        <div className='flex items-baseline gap-1 md:gap-2 mb-0.5 md:mb-1'>
                            <span className='text-[10px] md:text-xs align-super text-gray-900'>₹</span>
                            <span className={`text-lg md:text-3xl lg:text-4xl font-normal
                                ${isOutOfStock ? 'text-gray-400' : 'text-gray-900'}
                            `}>
                                {product.price.toLocaleString()}
                            </span>
                        </div>
                        <div className='flex items-center gap-1 md:gap-2 flex-wrap'>
                            <span className='text-[10px] md:text-sm text-gray-600'>M.R.P:</span>
                            <span className='text-[10px] md:text-sm text-gray-600 line-through'>₹{Math.round(product.price * 1.3).toLocaleString()}</span>
                            <span className='text-[10px] md:text-sm text-red-700 font-medium'>(23% off)</span>
                        </div>
                        {!isOutOfStock && (
                            <div className='mt-1 md:mt-2'>
                                <span className='inline-block bg-red-100 text-red-700 text-[9px] md:text-sm font-semibold px-1.5 py-0.5 md:px-2 md:py-1 rounded'>
                                    Limited Offer
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Stock Status - Hidden on mobile, shown on desktop */}
                    {!isOutOfStock && (
                        <div className='mb-3 md:mb-4 hidden md:block'>
                            <div className='text-sm md:text-base text-green-700 font-medium'>
                                ✓ In Stock - Ready to Ship
                            </div>
                            <div className='text-xs md:text-sm text-gray-600 mt-1'>
                                Free shipping on this product
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className='mt-auto flex flex-col md:flex-row gap-1.5 md:gap-2'>
                        <button
                            className={`flex-1 flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2.5 rounded-md text-xs md:text-sm font-medium transition-all duration-200
                            ${isOutOfStock
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : isInCart && user
                                    ? 'bg-gray-100 text-gray-700 border border-gray-300'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
                            }`}
                            onClick={(e) => onAddToCart(e, product)}
                            disabled={(isInCart && user) || isOutOfStock}
                        >
                            {isOutOfStock ? (
                                <>
                                    <PackageX className='w-3 md:w-4 h-3 md:h-4' strokeWidth={2} />
                                    <span>Out of stock</span>
                                </>
                            ) : !isInCart || !user ? (
                                <span>Add to cart</span>
                            ) : (
                                <>
                                    <Check className='w-3 md:w-4 h-3 md:h-4' strokeWidth={2} />
                                    <span>In Cart</span>
                                </>
                            )}
                        </button>

                        <button
                            className={`flex-1 flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2.5 rounded-md text-xs md:text-sm font-medium transition-all duration-200
                            ${isOutOfStock
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 text-white active:scale-95'
                            }`}
                            onClick={(e) => onWhatsApp(e, product)}
                            title="Chat on WhatsApp"
                            disabled={isOutOfStock}
                        >
                            <MessageCircle className='w-3 md:w-4 h-3 md:h-4' strokeWidth={2} />
                            <span>WhatsApp</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

BestSellerCard.displayName = 'BestSellerCard';

const BestSellerProducts = ({ bestSellerProducts }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const autoPlayTimeoutRef = useRef(null);

    const { addToCart, cart } = useCartStore();
    const { user } = useUserStore();
    const navigate = useNavigate();

    // 1 card on mobile, 2 cards on desktop
    const [itemsPerPage, setItemsPerPage] = useState(1);

    // Handle responsive items per page
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setItemsPerPage(1);
            } else {
                setItemsPerPage(2);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Optimized cart lookup with Set
    const cartIds = useMemo(() => new Set(cart.map(item => item._id)), [cart]);

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying || bestSellerProducts.length <= itemsPerPage) return;
        
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const maxIndex = Math.ceil(bestSellerProducts.length / itemsPerPage) - 1;
                return prevIndex >= maxIndex ? 0 : prevIndex + 1;
            });
        }, 3500);

        return () => clearInterval(timer);
    }, [isAutoPlaying, bestSellerProducts.length, itemsPerPage]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (autoPlayTimeoutRef.current) {
                clearTimeout(autoPlayTimeoutRef.current);
            }
        };
    }, []);

    const resumeAutoPlay = useCallback(() => {
        if (autoPlayTimeoutRef.current) {
            clearTimeout(autoPlayTimeoutRef.current);
        }
        autoPlayTimeoutRef.current = setTimeout(() => setIsAutoPlaying(true), 5000);
    }, []);

    const handleTouchStart = useCallback((e) => {
        setTouchStart(e.targetTouches[0].clientX);
        setIsAutoPlaying(false);
    }, []);

    const handleTouchMove = useCallback((e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    }, []);

    const totalPages = useMemo(() => 
        Math.ceil(bestSellerProducts.length / itemsPerPage),
        [bestSellerProducts.length, itemsPerPage]
    );
    const isStartDisabled = currentIndex === 0;
    const isEndDisabled = currentIndex >= totalPages - 1;

    const handleTouchEnd = useCallback(() => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe && !isEndDisabled) {
            setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, totalPages - 1));
        }
        if (isRightSwipe && !isStartDisabled) {
            setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        }

        setTouchStart(0);
        setTouchEnd(0);
        resumeAutoPlay();
    }, [touchStart, touchEnd, isEndDisabled, isStartDisabled, totalPages, resumeAutoPlay]);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, totalPages - 1));
        setIsAutoPlaying(false);
        resumeAutoPlay();
    }, [totalPages, resumeAutoPlay]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        setIsAutoPlaying(false);
        resumeAutoPlay();
    }, [resumeAutoPlay]);

    const handleAddToCart = useCallback((e, product) => {
        e.stopPropagation();
        
        const isOutOfStock = product.inStock === false;
        const isInCart = cartIds.has(product._id);
        
        if (isOutOfStock) {
            toast.error("This product is currently out of stock", { id: "out-of-stock" });
            return;
        }
        
        if (!user) {
            toast.error("Please login to add products to cart", { id: "login" });
            setTimeout(() => navigate("/signup"), 1000);
            return;
        }
        
        if (isInCart) {
            toast.success("Product already in cart!", { id: "already-in-cart" });
            return;
        }
        
        addToCart(product);
        toast.success("Added to cart!");
    }, [cartIds, user, navigate, addToCart]);

    const handleWhatsApp = useCallback((e, product) => {
        e.stopPropagation();
        const message = encodeURIComponent(
            `Hi! I'm interested in this product:\n${product.name}\nPrice: ₹${product.price}\nLink: ${window.location.origin}/product/${product._id}`
        );
        const phoneNumber = "1234567890";
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    }, []);

    const handleCardClick = useCallback((productId) => {
        navigate(`/product/${productId}`);
    }, [navigate]);

    const goToSlide = useCallback((index) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
        resumeAutoPlay();
    }, [resumeAutoPlay]);

    const handleMouseEnter = useCallback(() => setIsAutoPlaying(false), []);
    const handleMouseLeave = useCallback(() => setIsAutoPlaying(true), []);

    // Early return if no products
    if (!bestSellerProducts?.length) {
        return null;
    }

    return (
        <section className='py-6 md:py-10 bg-white relative'>
            <div className='container mx-auto px-3 md:px-6 relative z-10'>
                {/* Section Header */}
                <div className='mb-6 md:mb-8'>
                    <h2 className='text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2'>
                        Best Sellers
                    </h2>
                    <p className='text-sm md:text-base text-gray-600'>
                        Most popular builds loved by our customers
                    </p>
                </div>

                {/* Carousel Container */}
                <div className='relative'>
                    {/* Mobile Auto-play indicator */}
                    <div className='text-center mb-3 md:hidden'>
                        <div className='flex items-center justify-center gap-2 text-gray-500 text-xs uppercase tracking-widest'>
                            <div className='w-4 h-[1px] bg-blue-300' />
                            <span>{isAutoPlaying ? 'Auto Playing' : 'Swipe'}</span>
                            <div className='w-4 h-[1px] bg-blue-300' />
                        </div>
                    </div>

                    {/* Carousel Wrapper */}
                    <div 
                        className='overflow-hidden'
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div
                            className='flex transition-transform duration-700 ease-out'
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {bestSellerProducts.map((product) => (
                                <BestSellerCard
                                    key={product._id}
                                    product={product}
                                    isInCart={cartIds.has(product._id)}
                                    user={user}
                                    onAddToCart={handleAddToCart}
                                    onWhatsApp={handleWhatsApp}
                                    onCardClick={handleCardClick}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Navigation Arrows - Desktop Only */}
                    <button
                        onClick={prevSlide}
                        disabled={isStartDisabled}
                        aria-label="Previous products"
                        className={`hidden md:flex absolute top-1/2 -left-2 lg:-left-3 xl:-left-4 transform -translate-y-1/2 
                        w-10 h-10 lg:w-12 lg:h-12 items-center justify-center z-10 rounded-full border-2 transition-all duration-300
                        ${isStartDisabled 
                            ? 'opacity-30 cursor-not-allowed bg-gray-100 border-gray-200' 
                            : 'bg-white border-blue-300 hover:bg-blue-600 hover:border-blue-600 text-blue-600 hover:text-white shadow-lg hover:shadow-xl'
                        }`}
                    >
                        <ChevronLeft className='w-5 h-5 lg:w-6 lg:h-6' strokeWidth={2.5} />
                    </button>

                    <button
                        onClick={nextSlide}
                        disabled={isEndDisabled}
                        aria-label="Next products"
                        className={`hidden md:flex absolute top-1/2 -right-2 lg:-right-3 xl:-right-4 transform -translate-y-1/2 
                        w-10 h-10 lg:w-12 lg:h-12 items-center justify-center z-10 rounded-full border-2 transition-all duration-300
                        ${isEndDisabled 
                            ? 'opacity-30 cursor-not-allowed bg-gray-100 border-gray-200' 
                            : 'bg-white border-blue-300 hover:bg-blue-600 hover:border-blue-600 text-blue-600 hover:text-white shadow-lg hover:shadow-xl'
                        }`}
                    >
                        <ChevronRight className='w-5 h-5 lg:w-6 lg:h-6' strokeWidth={2.5} />
                    </button>

                    {/* Navigation Dots */}
                    <div className='flex justify-center mt-5 md:mt-6 gap-2'>
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`transition-all duration-300 ${
                                    currentIndex === index
                                        ? 'w-8 h-2 bg-blue-600 rounded-full'
                                        : 'w-6 h-2 bg-blue-200 hover:bg-blue-300 rounded-full'
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

export default BestSellerProducts;