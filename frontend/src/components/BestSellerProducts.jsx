import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight, MessageCircle, TrendingUp, Check, PackageX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";

const BestSellerProducts = ({ bestSellerProducts }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const autoPlayTimeoutRef = useRef(null);

    const { addToCart, cart } = useCartStore();
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

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying || bestSellerProducts.length <= itemsPerPage) return;
        
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const maxIndex = bestSellerProducts.length - itemsPerPage;
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

    const isStartDisabled = currentIndex === 0;
    const isEndDisabled = currentIndex >= bestSellerProducts.length - itemsPerPage;

    const handleTouchEnd = useCallback(() => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe && !isEndDisabled) {
            setCurrentIndex((prevIndex) => 
                Math.min(prevIndex + itemsPerPage, bestSellerProducts.length - itemsPerPage)
            );
        }
        if (isRightSwipe && !isStartDisabled) {
            setCurrentIndex((prevIndex) => Math.max(prevIndex - itemsPerPage, 0));
        }

        setTouchStart(0);
        setTouchEnd(0);
        resumeAutoPlay();
    }, [touchStart, touchEnd, isEndDisabled, isStartDisabled, itemsPerPage, bestSellerProducts.length, resumeAutoPlay]);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => 
            Math.min(prevIndex + itemsPerPage, bestSellerProducts.length - itemsPerPage)
        );
        setIsAutoPlaying(false);
        resumeAutoPlay();
    }, [itemsPerPage, bestSellerProducts.length, resumeAutoPlay]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - itemsPerPage, 0));
        setIsAutoPlaying(false);
        resumeAutoPlay();
    }, [itemsPerPage, resumeAutoPlay]);

    const handleAddToCart = useCallback((e, product) => {
        e.stopPropagation();
        
        const isOutOfStock = product.inStock === false;
        const isInCart = cart.some(item => item._id === product._id);
        
        if (isOutOfStock) {
            toast.error("This product is currently out of stock", { id: "out-of-stock" });
            return;
        }
        
        if (!user) {
            toast.error("Please login to add products to cart", { id: "login" });
            setTimeout(() => {
                navigate("/signup");
            }, 1000);
            return;
        }
        
        if (isInCart) {
            toast.success("Product already in cart!", { id: "already-in-cart" });
            return;
        }
        
        addToCart(product);
        toast.success("Added to cart!");
    }, [cart, user, navigate, addToCart]);

    const handleWhatsApp = useCallback((e, product) => {
        e.stopPropagation();
        const message = encodeURIComponent(
            `Hi! I'm interested in this product:\n${product.name}\nPrice: $${product.price}\nLink: ${window.location.origin}/product/${product._id}`
        );
        const phoneNumber = "1234567890";
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    }, []);

    const handleCardClick = useCallback((productId) => {
        navigate(`/product/${productId}`);
    }, [navigate]);

    const goToSlide = useCallback((index) => {
        setCurrentIndex(index * itemsPerPage);
        setIsAutoPlaying(false);
        resumeAutoPlay();
    }, [itemsPerPage, resumeAutoPlay]);

    const handleMouseEnter = useCallback(() => setIsAutoPlaying(false), []);
    const handleMouseLeave = useCallback(() => setIsAutoPlaying(true), []);

    const totalPages = useMemo(() => 
        Math.ceil(bestSellerProducts.length / itemsPerPage), 
        [bestSellerProducts.length, itemsPerPage]
    );

    return (
        <section className='py-8 sm:py-12 lg:py-16 relative'>
            {/* Subtle background accent */}
            <div className='absolute inset-0 bg-gradient-to-b from-zinc-900/30 via-transparent to-zinc-900/30 pointer-events-none' />
            
            <div className='container mx-auto px-3 sm:px-4 lg:px-6 relative z-10'>
                {/* Section Header - More Compact */}
                <div className='text-center mb-6 sm:mb-8 lg:mb-10'>
                    <div className='flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3'>
                        {/* Minimalist trending icon */}
                        <div className='p-1.5 sm:p-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10'>
                            <TrendingUp className='w-4 h-4 sm:w-5 sm:h-5 text-white' strokeWidth={1.5} />
                        </div>
                        <h2 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-white tracking-tight'>
                            Best Sellers
                        </h2>
                    </div>
                    <p className='text-xs sm:text-sm lg:text-base text-zinc-400 max-w-xl mx-auto font-light'>
                        Our most popular products loved by customers
                    </p>
                </div>

                <div className='relative'>
                    {/* Auto-play indicator for mobile */}
                    <div className='sm:hidden text-center mb-3'>
                        <div className='flex items-center justify-center gap-2 text-zinc-500 text-[9px] uppercase tracking-widest'>
                            <div className='w-4 h-[1px] bg-zinc-700' />
                            <span>{isAutoPlaying ? 'Auto Playing' : 'Swipe'}</span>
                            <div className='w-4 h-[1px] bg-zinc-700' />
                        </div>
                    </div>

                    <div 
                        className='overflow-hidden'
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div
                            className='flex transition-transform duration-700 ease-out will-change-transform'
                            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
                        >
                            {bestSellerProducts?.map((product) => {
                                const isOutOfStock = product.inStock === false;
                                const isInCart = cart.some(item => item._id === product._id);
                                
                                return (
                                    <div 
                                        key={product._id} 
                                        className='w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-1.5 sm:px-2.5'
                                    >
                                        {/* Compact Premium Best Seller Card */}
                                        <div 
                                            className={`group w-full flex flex-col overflow-hidden cursor-pointer 
                                            bg-zinc-950 border will-change-transform
                                            ${isOutOfStock 
                                                ? 'border-zinc-900/50 opacity-60 hover:opacity-70 transition-opacity duration-300' 
                                                : 'border-zinc-800/50 hover:border-zinc-700 hover:shadow-2xl hover:shadow-zinc-900/50 transition-[border-color,box-shadow] duration-500'
                                            }`}
                                            onClick={() => handleCardClick(product._id)}
                                        >
                                            {/* Out of Stock Badge / Best Seller Badge */}
                                            {isOutOfStock ? (
                                                <div className='absolute top-0 left-0 right-0 z-20 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 py-1.5 px-3'>
                                                    <div className='flex items-center justify-center gap-1.5'>
                                                        <PackageX className='w-3 h-3 text-zinc-500' strokeWidth={1.5} />
                                                        <span className='text-[10px] font-light uppercase tracking-wider text-zinc-500'>
                                                            Out of Stock
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className='absolute top-2 sm:top-3 right-2 sm:right-3 z-10 bg-white/10 backdrop-blur-md text-white px-2 sm:px-3 py-1 sm:py-1.5 border border-white/20 text-[9px] sm:text-[10px] font-medium uppercase tracking-wider flex items-center gap-1'>
                                                    <TrendingUp className='w-2.5 h-2.5 sm:w-3 sm:h-3' strokeWidth={1.5} />
                                                    <span className='hidden sm:inline'>Best Seller</span>
                                                    <span className='sm:hidden'>Best</span>
                                                </div>
                                            )}

                                            {/* Image Container - Adjusted Aspect Ratio */}
                                            <div className={`relative w-full aspect-[4/5] overflow-hidden bg-zinc-900/30 ${isOutOfStock ? 'mt-8' : ''}`}>
                                                <img 
                                                    className={`w-full h-full object-contain p-3 sm:p-4 will-change-transform
                                                    ${isOutOfStock 
                                                        ? 'grayscale opacity-40' 
                                                        : 'group-hover:scale-105 group-hover:p-2 sm:group-hover:p-3 transition-[transform,padding] duration-700 ease-out'
                                                    }`}
                                                    src={product.image} 
                                                    alt={product.name}
                                                    loading="lazy"
                                                    decoding="async"
                                                    fetchpriority="low"
                                                    width="300"
                                                    height="375"
                                                />
                                                
                                                {/* Out of Stock Overlay */}
                                                {isOutOfStock && (
                                                    <div className='absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]'>
                                                        <div className='text-center space-y-1.5'>
                                                            <PackageX className='w-10 h-10 text-zinc-600 mx-auto' strokeWidth={1} />
                                                            <p className='text-zinc-500 text-xs font-light uppercase tracking-widest'>
                                                                Unavailable
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {/* Subtle hover overlay */}
                                                {!isOutOfStock && (
                                                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                                                )}
                                            </div>

                                            {/* Product Info - More Compact */}
                                            <div className='flex flex-col flex-grow p-3 sm:p-4'>
                                                {/* Product Name */}
                                                <h3 className={`text-sm sm:text-base font-light tracking-wide mb-2 sm:mb-2.5 line-clamp-2 min-h-[2.5rem]
                                                    ${isOutOfStock 
                                                        ? 'text-zinc-600' 
                                                        : 'text-white group-hover:text-zinc-300 transition-colors duration-300'
                                                    }`}
                                                >
                                                    {product.name}
                                                </h3>
                                                
                                                <div className='mt-auto space-y-3'>
                                                    {/* Price */}
                                                    <div className='flex items-baseline'>
                                                        <span className={`text-xl sm:text-2xl font-light tracking-tight
                                                            ${isOutOfStock ? 'text-zinc-600' : 'text-white'}
                                                        `}>
                                                            ${product.price}
                                                        </span>
                                                    </div>

                                                    {/* Action Buttons - More Compact */}
                                                    <div className='flex gap-1.5 sm:gap-2'>
                                                        {/* Add to Cart Button */}
                                                        <button
                                                            className={`flex-1 flex items-center justify-center px-3 py-2 sm:py-2.5 text-[10px] sm:text-xs font-medium uppercase tracking-wide
                                                            transform active:scale-95 overflow-hidden relative will-change-transform
                                                            ${isOutOfStock
                                                                ? 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                                                                : isInCart && user
                                                                    ? 'bg-zinc-900 text-white border border-zinc-800 cursor-default transition-none'
                                                                    : 'bg-white text-black hover:bg-zinc-900 hover:text-white border border-white hover:border-zinc-700 group/btn transition-[background-color,color,border-color] duration-300'
                                                            }`}
                                                            onClick={(e) => handleAddToCart(e, product)}
                                                            disabled={(isInCart && user) || isOutOfStock}
                                                        >
                                                            {isOutOfStock ? (
                                                                <>
                                                                    <PackageX className='w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5' strokeWidth={1.5} />
                                                                    <span className='hidden sm:inline'>Out of Stock</span>
                                                                    <span className='sm:hidden'>Out</span>
                                                                </>
                                                            ) : !isInCart || !user ? (
                                                                <>
                                                                    <div className='absolute inset-0 bg-zinc-900 transform translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 will-change-transform' />
                                                                    <ShoppingCart className='w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 relative z-10' strokeWidth={1.5} />
                                                                    <span className='relative z-10'>Add</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Check className='w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5' strokeWidth={1.5} />
                                                                    <span className='hidden sm:inline'>In Cart</span>
                                                                    <span className='sm:hidden'>Added</span>
                                                                </>
                                                            )}
                                                        </button>

                                                        {/* WhatsApp Button */}
                                                        <button
                                                            className={`flex items-center justify-center px-2.5 sm:px-3 py-2 sm:py-2.5 
                                                            border transform active:scale-95 will-change-transform
                                                            ${isOutOfStock
                                                                ? 'bg-zinc-900 border-zinc-800 text-zinc-600'
                                                                : 'bg-zinc-900 border-zinc-800 hover:border-green-600 hover:bg-green-600/10 transition-[border-color,background-color] duration-300'
                                                            }`}
                                                            onClick={(e) => handleWhatsApp(e, product)}
                                                            title="Chat on WhatsApp"
                                                        >
                                                            <MessageCircle className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isOutOfStock ? 'text-zinc-600' : 'text-green-500'}`} strokeWidth={1.5} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bottom accent line */}
                                            <div className={`h-[1px] w-0 will-change-[width]
                                                ${isOutOfStock 
                                                    ? 'bg-zinc-800' 
                                                    : 'bg-white group-hover:w-full transition-[width] duration-500'
                                                }`} 
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Navigation Buttons - Hidden on mobile */}
                    <button
                        onClick={prevSlide}
                        disabled={isStartDisabled}
                        className={`hidden sm:flex absolute top-1/2 -left-3 lg:-left-4 transform -translate-y-1/2 
                        w-9 h-9 lg:w-10 lg:h-10 items-center justify-center z-10 will-change-transform
                        ${
                            isStartDisabled 
                                ? "opacity-30 cursor-not-allowed" 
                                : "bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-[background-color,border-color] duration-300"
                        }`}
                    >
                        <ChevronLeft className='w-5 h-5 text-white' strokeWidth={1.5} />
                    </button>

                    <button
                        onClick={nextSlide}
                        disabled={isEndDisabled}
                        className={`hidden sm:flex absolute top-1/2 -right-3 lg:-right-4 transform -translate-y-1/2 
                        w-9 h-9 lg:w-10 lg:h-10 items-center justify-center z-10 will-change-transform
                        ${
                            isEndDisabled 
                                ? "opacity-30 cursor-not-allowed" 
                                : "bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-[background-color,border-color] duration-300"
                        }`}
                    >
                        <ChevronRight className='w-5 h-5 text-white' strokeWidth={1.5} />
                    </button>

                    {/* Minimalist Progress Indicators */}
                    <div className='flex justify-center mt-5 sm:mt-6 gap-1.5'>
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`transition-[width,background-color] duration-300 will-change-[width] ${
                                    Math.floor(currentIndex / itemsPerPage) === index
                                        ? 'w-7 sm:w-9 h-0.5 bg-white'
                                        : 'w-5 sm:w-7 h-0.5 bg-white/30 hover:bg-white/50'
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
