import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";

const PeopleAlsoBought = () => {
	const [recommendations, setRecommendations] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchRecommendations = async () => {
			try {
				const res = await axios.get("/products/recommendations");
				setRecommendations(res.data);
			} catch (error) {
				toast.error(error.response.data.message || "An error occurred while fetching recommendations");
			} finally {
				setIsLoading(false);
			}
		};

		fetchRecommendations();
	}, []);

	if (isLoading) return <LoadingSpinner />;

	if (!recommendations || recommendations.length === 0) return null;

	return (
		<div className='mt-12 sm:mt-16 lg:mt-20 px-3 sm:px-4 lg:px-8'>
			{/* Section Header */}
			<div className='mb-6 sm:mb-8'>
				<div className='flex items-center gap-3 mb-2'>
					<div className='h-[1px] w-8 sm:w-12 bg-zinc-700' />
					<h3 className='text-xs sm:text-sm uppercase tracking-[0.3em] text-zinc-500 font-light'>
						You May Also Like
					</h3>
				</div>
			</div>

			{/* Products Grid - Compact & Responsive */}
			<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5'>
				{recommendations.map((product) => (
					<div key={product._id} className='w-full'>
						<CompactProductCard product={product} />
					</div>
				))}
			</div>
		</div>
	);
};

// Compact Product Card Component for "People Also Bought"
const CompactProductCard = ({ product }) => {
	const { user } = useUserStore();
	const { addToCart, cart } = useCartStore();
	const navigate = useNavigate();

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

	const handleCardClick = () => {
		navigate(`/product/${product._id}`);
	};

	return (
		<div 
			className={`group w-full flex flex-col overflow-hidden cursor-pointer 
			bg-zinc-950 border transition-all duration-300 relative
			${isOutOfStock 
				? 'border-zinc-900/50 opacity-70' 
				: 'border-zinc-800/50 hover:border-zinc-700 hover:shadow-xl hover:shadow-zinc-900/30'
			}`}
			onClick={handleCardClick}
		>
			{/* Out of Stock Badge - Compact */}
			{isOutOfStock && (
				<div className='absolute top-0 left-0 right-0 z-20 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 py-1 px-2'>
					<div className='flex items-center justify-center gap-1'>
						<PackageX className='w-3 h-3 text-zinc-600' strokeWidth={1.5} />
						<span className='text-[9px] sm:text-[10px] font-light uppercase tracking-wider text-zinc-600'>
							Out of Stock
						</span>
					</div>
				</div>
			)}

			{/* Compact Image Container */}
			<div className={`relative w-full aspect-[3/4] overflow-hidden bg-zinc-900/30 ${isOutOfStock ? 'mt-6' : ''}`}>
				<img 
					className={`w-full h-full object-contain p-2 sm:p-3 transition-all duration-500 ease-out 
					${isOutOfStock 
						? 'grayscale opacity-40' 
						: 'group-hover:scale-105 group-hover:p-1'
					}`}
					src={product.image} 
					alt={product.name}
					loading="lazy"
				/>
				
				{/* Out of Stock Overlay - Compact */}
				{isOutOfStock && (
					<div className='absolute inset-0 flex items-center justify-center bg-black/30'>
						<PackageX className='w-8 h-8 text-zinc-600' strokeWidth={1} />
					</div>
				)}
				
				{/* Hover overlay for in-stock products */}
				{!isOutOfStock && (
					<div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
				)}
			</div>

			{/* Compact Product Info */}
			<div className='flex flex-col flex-grow p-2 sm:p-3'>
				{/* Product Name - Compact */}
				<h3 className={`text-xs sm:text-sm font-light tracking-wide mb-2 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] transition-colors duration-300
					${isOutOfStock 
						? 'text-zinc-600' 
						: 'text-white group-hover:text-zinc-300'
					}`}
				>
					{product.name}
				</h3>
				
				<div className='mt-auto space-y-2'>
					{/* Price - Compact */}
					<div className='flex items-baseline'>
						<span className={`text-base sm:text-lg font-light tracking-tight
							${isOutOfStock ? 'text-zinc-600' : 'text-white'}
						`}>
							${product.price}
						</span>
					</div>

					{/* Compact Action Button */}
					<button
						className={`w-full flex items-center justify-center px-2 py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium uppercase tracking-wide
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
								<PackageX className='w-3 h-3 mr-1' strokeWidth={1.5} />
								<span className='hidden sm:inline'>Unavailable</span>
								<span className='sm:hidden'>N/A</span>
							</>
						) : !isInCart || !user ? (
							<>
								<div className='absolute inset-0 bg-zinc-900 transform translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300' />
								<ShoppingCart className='w-3 h-3 mr-1 relative z-10' strokeWidth={1.5} />
								<span className='relative z-10'>Add</span>
							</>
						) : (
							<>
								<Check className='w-3 h-3 mr-1' strokeWidth={1.5} />
								<span>In Cart</span>
							</>
						)}
					</button>
				</div>
			</div>

			{/* Bottom accent line - Compact */}
			<div className={`h-[1px] w-0 transition-all duration-300
				${isOutOfStock 
					? 'bg-zinc-800' 
					: 'bg-white group-hover:w-full'
				}`} 
			/>
		</div>
	);
};

// Import required hooks and components
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { ShoppingCart, Check, PackageX } from "lucide-react";

export default PeopleAlsoBought;
