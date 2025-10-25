import toast from "react-hot-toast";
import { ShoppingCart, MessageCircle, Check, PackageX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const ProductCard = ({ product }) => {
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
			`Hi! I'm interested in this product:\n${product.name}\nPrice: $${product.price}\nLink: ${window.location.origin}/product/${product._id}`
		);
		const phoneNumber = "1234567890"; // Update with your actual number
		window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
	};

	const handleCardClick = () => {
		navigate(`/product/${product._id}`);
	};

	return (
		<div 
			className={`group w-full max-w-sm mx-auto flex flex-col overflow-hidden cursor-pointer 
			bg-zinc-950 border transition-all duration-500 relative
			${isOutOfStock 
				? 'border-zinc-900/50 opacity-60 hover:opacity-70' 
				: 'border-zinc-800/50 hover:border-zinc-700 hover:shadow-2xl hover:shadow-zinc-900/50'
			}`}
			onClick={handleCardClick}
		>
			{/* Out of Stock Badge */}
			{isOutOfStock && (
				<div className='absolute top-0 left-0 right-0 z-20 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 py-2 px-4'>
					<div className='flex items-center justify-center gap-2'>
						<PackageX className='w-4 h-4 text-zinc-500' strokeWidth={1.5} />
						<span className='text-xs font-light uppercase tracking-wider text-zinc-500'>
							Out of Stock
						</span>
					</div>
				</div>
			)}

			{/* Image Container */}
			<div className={`relative w-full aspect-[3/4] overflow-hidden bg-zinc-900/30 ${isOutOfStock ? 'mt-10' : ''}`}>
				<img 
					className={`w-full h-full object-contain p-4 transition-all duration-700 ease-out 
					${isOutOfStock 
						? 'grayscale opacity-40' 
						: 'group-hover:scale-105 group-hover:p-2'
					}`}
					src={product.image} 
					alt={product.name}
					loading="lazy"
				/>
				
				{/* Out of Stock Overlay */}
				{isOutOfStock && (
					<div className='absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]'>
						<div className='text-center space-y-2'>
							<PackageX className='w-12 h-12 text-zinc-600 mx-auto' strokeWidth={1} />
							<p className='text-zinc-500 text-sm font-light uppercase tracking-widest'>
								Unavailable
							</p>
						</div>
					</div>
				)}
				
				{/* Subtle hover overlay for in-stock products */}
				{!isOutOfStock && (
					<div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
				)}
			</div>

			{/* Product Info */}
			<div className='flex flex-col flex-grow p-4 sm:p-5 lg:p-6'>
				{/* Product Name */}
				<h3 className={`text-base sm:text-lg font-light tracking-wide mb-3 line-clamp-2 min-h-[3rem] transition-colors duration-300
					${isOutOfStock 
						? 'text-zinc-600' 
						: 'text-white group-hover:text-zinc-300'
					}`}
				>
					{product.name}
				</h3>
				
				<div className='mt-auto space-y-4'>
					{/* Price */}
					<div className='flex items-baseline'>
						<span className={`text-2xl sm:text-3xl font-light tracking-tight
							${isOutOfStock ? 'text-zinc-600' : 'text-white'}
						`}>
							${product.price}
						</span>
					</div>

					{/* Action Buttons */}
					<div className='flex gap-2 sm:gap-3'>
						{/* Add to Cart Button */}
						<button
							className={`flex-1 flex items-center justify-center px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium uppercase tracking-wide
							transition-all duration-300 transform active:scale-95 overflow-hidden relative
							${isOutOfStock
								? 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
								: isInCart && user
									? 'bg-zinc-900 text-white border border-zinc-800 cursor-default'
									: 'bg-white text-black hover:bg-zinc-900 hover:text-white border border-white hover:border-zinc-700 group/btn'
							}`}
							onClick={handleAddToCart}
							disabled={(isInCart && user) || isOutOfStock}
						>
							{isOutOfStock ? (
								<>
									<PackageX className='w-4 h-4 mr-2' strokeWidth={1.5} />
									<span>Out of Stock</span>
								</>
							) : !isInCart || !user ? (
								<>
									<div className='absolute inset-0 bg-zinc-900 transform translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300' />
									<ShoppingCart className='w-4 h-4 mr-2 relative z-10' strokeWidth={1.5} />
									<span className='relative z-10'>Add</span>
								</>
							) : (
								<>
									<Check className='w-4 h-4 mr-2' strokeWidth={1.5} />
									<span>In Cart</span>
								</>
							)}
						</button>

						{/* WhatsApp Button */}
						<button
							className={`flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 
							border transition-all duration-300 transform active:scale-95
							${isOutOfStock
								? 'bg-zinc-900 border-zinc-800 text-zinc-600'
								: 'bg-zinc-900 border-zinc-800 hover:border-green-600 hover:bg-green-600/10'
							}`}
							onClick={handleWhatsApp}
							title="Chat on WhatsApp"
						>
							<MessageCircle className={`w-4 h-4 ${isOutOfStock ? 'text-zinc-600' : 'text-green-500'}`} strokeWidth={1.5} />
						</button>
					</div>
				</div>
			</div>

			{/* Bottom accent line */}
			<div className={`h-[1px] w-0 transition-all duration-500
				${isOutOfStock 
					? 'bg-zinc-800' 
					: 'bg-white group-hover:w-full'
				}`} 
			/>
		</div>
	);
};

export default ProductCard;
