import toast from "react-hot-toast";
import { ShoppingCart, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const ProductCard = ({ product }) => {
	const { user } = useUserStore();
	const { addToCart } = useCartStore();
	const navigate = useNavigate();

	const handleAddToCart = (e) => {
		e.stopPropagation();
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			setTimeout(() => {
				navigate("/signup");
			}, 1000);
			return;
		} else {
			addToCart(product);
		}
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
			className='w-full max-w-sm mx-auto flex flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg cursor-pointer hover:border-emerald-500 transition-all duration-300 bg-gray-800/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-emerald-500/20 group'
			onClick={handleCardClick}
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
							onClick={handleAddToCart}
						>
							<ShoppingCart className='w-5 h-5 mr-2' />
							<span>Add to Cart</span>
						</button>

						{/* WhatsApp Button */}
						<button
							className='flex items-center justify-center rounded-lg bg-green-600 text-white px-4 py-3 text-sm font-semibold
							hover:bg-green-500 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-green-500/50'
							onClick={handleWhatsApp}
							title="Chat on WhatsApp"
						>
							<MessageCircle className='w-5 h-5' />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;