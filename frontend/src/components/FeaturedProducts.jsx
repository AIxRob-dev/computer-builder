import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { ShoppingCart, MessageCircle, Check, PackageX, Star, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";

// Memoized ProductCard component - Amazon-inspired layout
const ProductCard = memo(({ 
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
            className={`group bg-white border border-gray-200 hover:border-gray-300 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 h-full flex flex-col md:flex-row
            ${isOutOfStock ? 'opacity-60' : 'hover:shadow-lg'}
            `}
            onClick={() => onCardClick(product._id)}
        >
            {/* Image Section - Left side on desktop, top on mobile */}
            <div className='relative w-full md:w-64 lg:w-72 flex-shrink-0 bg-white'>
                {/* Status Badge - Only show if out of stock */}
                {isOutOfStock && (
                    <div className='absolute top-2 left-2 z-10'>
                        <div className='bg-red-500 text-white px-2 py-1 rounded text-xs font-bold'>
                            Out of stock
                        </div>
                    </div>
                )}

                <div className='relative w-full aspect-square md:aspect-[4/5] overflow-hidden bg-white p-4'>
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
                                <PackageX className='w-12 h-12 text-gray-400 mx-auto mb-2' strokeWidth={1.5} />
                                <p className='text-gray-600 text-sm font-semibold'>
                                    Currently Unavailable
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Product Info Section - Right side on desktop, bottom on mobile */}
            <div className='flex flex-col flex-grow p-4 md:p-5'>
                {/* Product Name */}
                <h3 className={`text-sm md:text-base lg:text-lg font-normal mb-3 md:mb-4 line-clamp-2 leading-snug
                    ${isOutOfStock ? 'text-gray-400' : 'text-gray-900 group-hover:text-blue-700'}
                    transition-colors duration-200`}
                >
                    {product.name}
                </h3>
                
                {/* Price Section */}
                <div className='mb-3 md:mb-4'>
                    <div className='flex items-baseline gap-2 mb-1'>
                        <span className='text-xs align-super text-gray-900'>₹</span>
                        <span className={`text-2xl md:text-3xl lg:text-4xl font-normal
                            ${isOutOfStock ? 'text-gray-400' : 'text-gray-900'}
                        `}>
                            {product.price.toLocaleString()}
                        </span>
                    </div>
                    <div className='flex items-center gap-2 flex-wrap'>
                        <span className='text-xs md:text-sm text-gray-600'>M.R.P:</span>
                        <span className='text-xs md:text-sm text-gray-600 line-through'>₹{Math.round(product.price * 1.3).toLocaleString()}</span>
                        <span className='text-xs md:text-sm text-red-700 font-medium'>(23% off)</span>
                    </div>
                    {!isOutOfStock && (
                        <div className='mt-2'>
                            <span className='inline-block bg-red-100 text-red-700 text-xs md:text-sm font-semibold px-2 py-1 rounded'>
                                Limited Time Offer
                            </span>
                        </div>
                    )}
                </div>

                {/* Stock Status */}
                {!isOutOfStock && (
                    <div className='mb-4'>
                        <div className='text-sm md:text-base text-green-700 font-medium'>
                            ✓ In Stock - Ready to Ship
                        </div>
                        <div className='text-xs md:text-sm text-gray-600 mt-1'>
                            Free shipping on this product
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className='mt-auto flex gap-2'>
                    <button
                        className={`flex-1 md:flex-initial md:min-w-[200px] lg:min-w-[240px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200
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
                                <PackageX className='w-4 h-4' strokeWidth={2} />
                                <span>Out of stock</span>
                            </>
                        ) : !isInCart || !user ? (
                            <span>Add to cart</span>
                        ) : (
                            <>
                                <Check className='w-4 h-4' strokeWidth={2} />
                                <span>In Cart</span>
                            </>
                        )}
                    </button>

                    <button
                        className={`flex-shrink-0 md:min-w-[140px] lg:min-w-[160px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200
                        ${isOutOfStock
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 text-white active:scale-95'
                        }`}
                        onClick={(e) => onWhatsApp(e, product)}
                        title="Chat on WhatsApp"
                        disabled={isOutOfStock}
                    >
                        <MessageCircle className='w-4 h-4' strokeWidth={2} />
                        <span>WhatsApp</span>
                    </button>
                </div>
            </div>
        </div>
    );
});

ProductCard.displayName = 'ProductCard';

const FeaturedProducts = ({ featuredProducts }) => {
    const { addToCart, cart } = useCartStore();
    const { user } = useUserStore();
    const navigate = useNavigate();

    // Memoize cart IDs for faster lookups
    const cartIds = useMemo(() => new Set(cart.map(item => item._id)), [cart]);

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

    // Early return if no products
    if (!featuredProducts?.length) {
        return null;
    }

    return (
        <section className='py-6 md:py-10 bg-white'>
            <div className='container mx-auto px-3 md:px-6'>
                {/* Section Header */}
                <div className='mb-6 md:mb-8'>
                    <h2 className='text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2'>
                        Featured Products
                    </h2>
                    <p className='text-sm md:text-base text-gray-600'>
                        Premium builds handpicked for exceptional performance
                    </p>
                </div>

                {/* Products List */}
                <div className='space-y-4'>
                    {featuredProducts.map((product) => (
                        <ProductCard
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
        </section>
    );
};

export default FeaturedProducts;