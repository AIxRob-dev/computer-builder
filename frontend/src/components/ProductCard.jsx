import { memo } from "react";
import toast from "react-hot-toast";
import { ShoppingCart, MessageCircle, Check, PackageX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const ProductCard = memo(({ product }) => {
	const { user } = useUserStore();
	const { addToCart, cart } = useCartStore();
	const navigate = useNavigate();

	// Check if product is already in cart
	const isInCart = cart.some(item => item._id === product._id);
	const isOutOfStock = product.inStock === false;

	const handleAddToCart = (e) => {
		e.stopPropagation();
		
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
	};

	const handleWhatsApp = (e) => {
		e.stopPropagation();
		const message = encodeURIComponent(
			`Hi! I'm interested in this product:\n${product.name}\nPrice: ₹${product.price}\nLink: ${window.location.origin}/product/${product._id}`
		);
		const phoneNumber = "1234567890";
		window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
	};

	const handleCardClick = () => {
		navigate(`/product/${product._id}`);
	};

	return (
		<div 
			className={`group bg-white border border-gray-200 hover:border-gray-300 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 h-full flex flex-col
			${isOutOfStock ? 'opacity-60' : 'hover:shadow-lg'}
			`}
			onClick={handleCardClick}
		>
			{/* Image Section */}
			<div className='relative w-full bg-white'>
				{/* Out of Stock Badge */}
				{isOutOfStock && (
					<div className='absolute top-2 left-2 z-10'>
						<div className='bg-red-500 text-white px-2 py-1 rounded text-xs font-bold'>
							Out of stock
						</div>
					</div>
				)}

				<div className='relative w-full aspect-square overflow-hidden bg-white p-4'>
					<img 
						className={`w-full h-full object-contain transition-transform duration-300
						${isOutOfStock ? 'grayscale opacity-50' : 'group-hover:scale-105'}
						`}
						src={product.image} 
						alt={product.name}
						loading="lazy"
						decoding="async"
					/>
					
					{/* Out of Stock Overlay */}
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

			{/* Product Info Section */}
			<div className='flex flex-col flex-grow p-4'>
				{/* Product Name */}
				<h3 className={`text-sm md:text-base font-normal mb-3 line-clamp-2 leading-snug
					${isOutOfStock ? 'text-gray-400' : 'text-gray-900 group-hover:text-blue-700'}
					transition-colors duration-200`}
				>
					{product.name}
				</h3>
				
				{/* Price Section */}
				<div className='mb-3'>
					<div className='flex items-baseline gap-2 mb-1'>
						<span className='text-xs align-super text-gray-900'>₹</span>
						<span className={`text-2xl md:text-3xl font-normal
							${isOutOfStock ? 'text-gray-400' : 'text-gray-900'}
						`}>
							{product.price.toLocaleString()}
						</span>
					</div>
					<div className='flex items-center gap-2 flex-wrap'>
						<span className='text-xs text-gray-600'>M.R.P:</span>
						<span className='text-xs text-gray-600 line-through'>₹{Math.round(product.price * 1.3).toLocaleString()}</span>
						<span className='text-xs text-red-700 font-medium'>(23% off)</span>
					</div>
					{!isOutOfStock && (
						<div className='mt-2'>
							<span className='inline-block bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded'>
								Limited Time Offer
							</span>
						</div>
					)}
				</div>

				{/* Stock Status */}
				{!isOutOfStock && (
					<div className='mb-4'>
						<div className='text-sm text-green-700 font-medium'>
							✓ In Stock - Ready to Ship
						</div>
						<div className='text-xs text-gray-600 mt-1'>
							Free shipping on this product
						</div>
					</div>
				)}

				{/* Action Buttons */}
				<div className='mt-auto flex gap-2'>
					<button
						className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200
						${isOutOfStock
							? 'bg-gray-200 text-gray-500 cursor-not-allowed'
							: isInCart && user
								? 'bg-gray-100 text-gray-700 border border-gray-300'
								: 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
						}`}
						onClick={handleAddToCart}
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
						className={`flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200
						${isOutOfStock
							? 'bg-gray-100 text-gray-400 cursor-not-allowed'
							: 'bg-green-600 hover:bg-green-700 text-white active:scale-95'
						}`}
						onClick={handleWhatsApp}
						title="Chat on WhatsApp"
						disabled={isOutOfStock}
					>
						<MessageCircle className='w-4 h-4' strokeWidth={2} />
						<span className="hidden sm:inline">WhatsApp</span>
					</button>
				</div>
			</div>
		</div>
	);
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;