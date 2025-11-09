import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { ShoppingCart, Check, PackageX } from "lucide-react";

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
					<div className='h-[2px] w-8 sm:w-12 bg-blue-600' />
					<h3 className='text-xs sm:text-sm uppercase tracking-[0.3em] text-blue-600 font-bold'>
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
			bg-white rounded-lg shadow-md transition-all duration-300 relative
			${isOutOfStock 
				? 'border-2 border-gray-200 opacity-70' 
				: 'border-2 border-blue-100 hover:border-blue-600 hover:shadow-xl'
			}`}
			onClick={handleCardClick}
		>
			{/* Out of Stock Badge - Compact */}
			{isOutOfStock && (
				<div className='absolute top-0 left-0 right-0 z-20 bg-gray-100 backdrop-blur-sm border-b-2 border-gray-200 rounded-t-lg py-1 px-2'>
					<div className='flex items-center justify-center gap-1'>
						<PackageX className='w-3 h-3 text-gray-500' strokeWidth={2} />
						<span className='text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-gray-500'>
							Out of Stock
						</span>
					</div>
				</div>
			)}

			{/* Compact Image Container */}
			<div className={`relative w-full aspect-[3/4] overflow-hidden bg-gray-50 ${isOutOfStock ? 'mt-6' : ''}`}>
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
					<div className='absolute inset-0 flex items-center justify-center bg-gray-200/30'>
						<PackageX className='w-8 h-8 text-gray-400' strokeWidth={1.5} />
					</div>
				)}
				
				{/* Hover overlay for in-stock products */}
				{!isOutOfStock && (
					<div className='absolute inset-0 bg-gradient-to-t from-blue-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
				)}
			</div>

			{/* Compact Product Info */}
			<div className='flex flex-col flex-grow p-2 sm:p-3'>
				{/* Product Name - Compact */}
				<h3 className={`text-xs sm:text-sm font-semibold tracking-wide mb-2 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] transition-colors duration-300
					${isOutOfStock 
						? 'text-gray-400' 
						: 'text-gray-900 group-hover:text-blue-600'
					}`}
				>
					{product.name}
				</h3>
				
				<div className='mt-auto space-y-2'>
					{/* Price - Compact */}
					<div className='flex items-baseline'>
						<span className={`text-base sm:text-lg font-bold tracking-tight
							${isOutOfStock ? 'text-gray-400' : 'text-gray-900'}
						`}>
							₹{product.price}
						</span>
					</div>

					{/* Compact Action Button */}
					<button
						className={`w-full flex items-center justify-center px-2 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wide rounded-lg
						transition-all duration-300 transform active:scale-95 overflow-hidden relative
						${isOutOfStock
							? 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed'
							: isInCart && user
								? 'bg-green-50 text-green-600 border-2 border-green-200 cursor-default'
								: 'bg-blue-600 text-white hover:bg-blue-700 border-2 border-blue-600 hover:border-blue-700 shadow-md hover:shadow-lg group/btn'
						}`}
						onClick={handleAddToCart}
						disabled={(isInCart && user) || isOutOfStock}
					>
						{isOutOfStock ? (
							<>
								<PackageX className='w-3 h-3 mr-1' strokeWidth={2} />
								<span className='hidden sm:inline'>Unavailable</span>
								<span className='sm:hidden'>N/A</span>
							</>
						) : !isInCart || !user ? (
							<>
								<ShoppingCart className='w-3 h-3 mr-1 relative z-10' strokeWidth={2} />
								<span className='relative z-10'>Add to Cart</span>
							</>
						) : (
							<>
								<Check className='w-3 h-3 mr-1' strokeWidth={2} />
								<span>In Cart</span>
							</>
						)}
					</button>
				</div>
			</div>

			{/* Bottom accent line - Compact */}
			<div className={`h-[2px] w-0 transition-all duration-300 rounded-b-lg
				${isOutOfStock 
					? 'bg-gray-300' 
					: 'bg-blue-600 group-hover:w-full'
				}`} 
			/>
		</div>
	);
};

export default PeopleAlsoBought;