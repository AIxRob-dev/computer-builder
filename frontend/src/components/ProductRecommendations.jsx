import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { ShoppingCart, MessageCircle, Check, PackageX, TrendingUp, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import axios from "../lib/axios";
import LoadingSpinner from "./LoadingSpinner";

// Memoized Recommendation Card - Enhanced design
const RecommendationCard = memo(({ 
    product, 
    isInCart, 
    user,
    onAddToCart, 
    onWhatsApp, 
    onCardClick 
}) => {
    const isOutOfStock = product.inStock === false;

    return (
        <div 
            className={`group bg-white border-2 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 h-full flex flex-col
            ${isOutOfStock 
                ? 'border-gray-200 opacity-70' 
                : 'border-gray-200 hover:border-blue-500 hover:shadow-2xl hover:-translate-y-1'
            }`}
            onClick={() => onCardClick(product._id)}
        >
            {/* Image Section with Badge */}
            <div className='relative w-full bg-gradient-to-br from-gray-50 to-white'>
                {/* Status Badge */}
                {isOutOfStock ? (
                    <div className='absolute top-3 left-3 z-10'>
                        <div className='bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg'>
                            Out of Stock
                        </div>
                    </div>
                ) : (
                    <div className='absolute top-3 left-3 z-10'>
                        <div className='bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1'>
                            <Sparkles className='w-3 h-3' />
                            <span>Recommended</span>
                        </div>
                    </div>
                )}

                <div className='relative w-full aspect-square overflow-hidden p-6'>
                    <img 
                        className={`w-full h-full object-contain transition-all duration-500
                        ${isOutOfStock 
                            ? 'grayscale opacity-40' 
                            : 'group-hover:scale-110'
                        }`}
                        src={product.image} 
                        alt={product.name}
                        loading="lazy"
                    />
                    
                    {isOutOfStock && (
                        <div className='absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm'>
                            <div className='text-center'>
                                <PackageX className='w-16 h-16 text-gray-400 mx-auto mb-2' strokeWidth={1.5} />
                                <p className='text-gray-600 text-sm font-semibold'>
                                    Currently Unavailable
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Hover gradient overlay */}
                    {!isOutOfStock && (
                        <div className='absolute inset-0 bg-gradient-to-t from-blue-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                    )}
                </div>
            </div>

            {/* Product Info Section */}
            <div className='flex flex-col flex-grow p-5 bg-white'>
                {/* Product Name */}
                <h3 className={`text-base lg:text-lg font-semibold mb-3 line-clamp-2 leading-snug min-h-[3rem]
                    ${isOutOfStock ? 'text-gray-400' : 'text-gray-900 group-hover:text-blue-700'}
                    transition-colors duration-200`}
                >
                    {product.name}
                </h3>
                
                {/* Price Section */}
                <div className='mb-4'>
                    <div className='flex items-baseline gap-2 mb-2'>
                        <span className='text-xs align-super text-gray-900'>₹</span>
                        <span className={`text-3xl lg:text-4xl font-bold
                            ${isOutOfStock ? 'text-gray-400' : 'text-gray-900'}
                        `}>
                            {product.price.toLocaleString()}
                        </span>
                    </div>
                    <div className='flex items-center gap-2 flex-wrap mb-2'>
                        <span className='text-sm text-gray-600'>M.R.P:</span>
                        <span className='text-sm text-gray-600 line-through'>
                            ₹{Math.round(product.price * 1.3).toLocaleString()}
                        </span>
                        <span className='text-sm text-red-700 font-bold'>(23% off)</span>
                    </div>
                    {!isOutOfStock && (
                        <div className='inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-3 py-1.5 rounded-lg'>
                            <TrendingUp className='w-4 h-4' strokeWidth={2} />
                            <span>Save ₹{Math.round(product.price * 0.3).toLocaleString()}</span>
                        </div>
                    )}
                </div>

                {/* Stock Status */}
                {!isOutOfStock && (
                    <div className='mb-4 pb-4 border-b border-gray-100'>
                        <div className='flex items-center gap-2 text-sm font-medium text-green-700 mb-1'>
                            <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse' />
                            <span>In Stock - Ready to Ship</span>
                        </div>
                        <div className='text-xs text-gray-600 ml-4'>
                            Free shipping • 1 Year Warranty
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className='mt-auto flex flex-col gap-2'>
                    <button
                        className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-bold uppercase tracking-wide transition-all duration-300 transform active:scale-95
                        ${isOutOfStock
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : isInCart && user
                                ? 'bg-green-50 text-green-700 border-2 border-green-300'
                                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
                        }`}
                        onClick={(e) => onAddToCart(e, product)}
                        disabled={(isInCart && user) || isOutOfStock}
                    >
                        {isOutOfStock ? (
                            <>
                                <PackageX className='w-5 h-5' strokeWidth={2} />
                                <span>Unavailable</span>
                            </>
                        ) : !isInCart || !user ? (
                            <>
                                <ShoppingCart className='w-5 h-5' strokeWidth={2} />
                                <span>Add to Cart</span>
                            </>
                        ) : (
                            <>
                                <Check className='w-5 h-5' strokeWidth={2} />
                                <span>In Cart</span>
                            </>
                        )}
                    </button>

                    <button
                        className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-bold uppercase tracking-wide transition-all duration-300 transform active:scale-95
                        ${isOutOfStock
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                            : 'bg-white text-green-600 border-2 border-green-600 hover:bg-green-600 hover:text-white'
                        }`}
                        onClick={(e) => onWhatsApp(e, product)}
                        title="Chat on WhatsApp"
                        disabled={isOutOfStock}
                    >
                        <MessageCircle className='w-5 h-5' strokeWidth={2} />
                        <span>WhatsApp</span>
                    </button>
                </div>
            </div>

            {/* Bottom accent line */}
            <div className={`h-1 w-0 transition-all duration-300 
                ${isOutOfStock 
                    ? 'bg-gray-300' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-400 group-hover:w-full'
                }`} 
            />
        </div>
    );
});

RecommendationCard.displayName = 'RecommendationCard';

const ProductRecommendations = ({ currentProductId }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addToCart, cart } = useCartStore();
    const { user } = useUserStore();
    const navigate = useNavigate();

    // Memoize cart IDs for faster lookups
    const cartIds = useMemo(() => new Set(cart.map(item => item._id)), [cart]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get("/products/recommendations");
                // Filter out current product from recommendations
                const filtered = res.data.filter(product => product._id !== currentProductId);
                setRecommendations(filtered);
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to load recommendations");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecommendations();
    }, [currentProductId]);

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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [navigate]);

    if (isLoading) {
        return (
            <div className='py-12'>
                <LoadingSpinner />
            </div>
        );
    }

    // Don't render if no recommendations
    if (!recommendations?.length) {
        return null;
    }

    return (
        <section className='py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-white to-gray-50'>
            <div className='container mx-auto px-3 sm:px-4 lg:px-6'>
                {/* Section Header */}
                <div className='mb-8 sm:mb-10 lg:mb-12 text-center'>
                    <div className='flex items-center justify-center gap-3 mb-3'>
                        <div className='h-[3px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-blue-600 to-transparent rounded-full' />
                        <Sparkles className='w-6 h-6 text-blue-600' strokeWidth={2} />
                        <div className='h-[3px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-blue-600 to-transparent rounded-full' />
                    </div>
                    <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3'>
                        You May Also Like
                    </h2>
                    <p className='text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto'>
                        Handpicked recommendations based on your interests
                    </p>
                </div>

                {/* Products Grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6'>
                    {recommendations.map((product) => (
                        <RecommendationCard
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

                {/* View All Button */}
                <div className='mt-10 sm:mt-12 text-center'>
                    <button
                        onClick={() => navigate('/category/Exclusives')}
                        className='inline-flex items-center gap-2 bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg text-base font-bold uppercase tracking-wide hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-xl active:scale-95'
                    >
                        <span>View All Products</span>
                        <TrendingUp className='w-5 h-5' strokeWidth={2} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ProductRecommendations;