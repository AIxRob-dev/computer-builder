import { Minus, Plus, Trash2, Tag } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { motion } from "framer-motion";

const CartItem = ({ item }) => {
	const { removeFromCart, updateQuantity } = useCartStore();
	
	// Calculate discount details
	const originalPrice = Math.round(item.price * 1.3);
	const discountAmount = originalPrice - item.price;
	const discountPercentage = 23;

	return (
		<motion.div
			className='bg-white border-2 border-blue-100 rounded-xl shadow-lg p-3 sm:p-6 relative overflow-hidden'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
		>
			{/* Discount Badge - Top Right */}
			<div className='absolute top-3 right-3 sm:top-4 sm:right-4 z-10'>
				<div className='bg-blue-600 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg flex items-center gap-1 sm:gap-1.5 shadow-md'>
					<Tag className='w-3 h-3 sm:w-3.5 sm:h-3.5 text-white' strokeWidth={2} />
					<span className='text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider'>
						{discountPercentage}% OFF
					</span>
				</div>
			</div>

			<div className='flex items-start sm:items-center gap-3 sm:gap-6'>
				{/* Product Image */}
				<div className='shrink-0 w-20 sm:w-24 md:w-32'>
					<div className='relative aspect-square bg-gray-100 border-2 border-blue-100 rounded-lg overflow-hidden group'>
						<img 
							className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105' 
							src={item.image}
							alt={item.name}
						/>
						{/* "In Cart" Overlay with Blur */}
						<div className='absolute inset-0 bg-blue-600/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
							<div className='absolute inset-0 flex items-center justify-center'>
								<span className='text-[10px] sm:text-xs uppercase tracking-widest text-white font-bold bg-blue-600 px-2 py-1 rounded'>
									In Cart
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Product Details */}
				<div className='flex-1 min-w-0 space-y-2 sm:space-y-3'>
					<div>
						<h3 className='text-sm sm:text-base md:text-lg font-bold text-gray-900 tracking-tight line-clamp-1'>
							{item.name}
						</h3>
						{item.description && (
							<p className='mt-1 text-[11px] sm:text-xs md:text-sm text-gray-600 font-semibold line-clamp-1 sm:line-clamp-2'>
								{item.description}
							</p>
						)}
					</div>

					{/* Mobile Price - Only visible on small screens */}
					<div className='sm:hidden'>
						<div className='space-y-1'>
							<div className='flex items-center gap-2'>
								<p className='text-base font-bold text-gray-900'>₹{item.price.toLocaleString()}</p>
								<span className='text-xs text-gray-500 line-through font-semibold'>₹{originalPrice.toLocaleString()}</span>
							</div>
							<p className='text-[10px] text-green-600 font-bold'>
								You save ₹{discountAmount.toLocaleString()}
							</p>
						</div>
					</div>

					{/* Quantity Controls & Remove Button */}
					<div className='flex items-center justify-between sm:justify-start sm:gap-6'>
						{/* Quantity Controls */}
						<div className='flex items-center gap-2 sm:gap-3'>
							<label className='sr-only'>Choose quantity:</label>
							<button
								className='inline-flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center 
								bg-gray-100 border-2 border-gray-200 rounded-md
								hover:bg-blue-50 hover:border-blue-300
								transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
								onClick={() => updateQuantity(item._id, item.quantity - 1)}
								aria-label="Decrease quantity"
							>
								<Minus className='h-3 w-3 text-gray-600' strokeWidth={2} />
							</button>
							
							<span className='text-xs sm:text-sm font-bold text-gray-900 min-w-[2ch] text-center'>
								{item.quantity}
							</span>
							
							<button
								className='inline-flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center 
								bg-gray-100 border-2 border-gray-200 rounded-md
								hover:bg-blue-50 hover:border-blue-300
								transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
								onClick={() => updateQuantity(item._id, item.quantity + 1)}
								aria-label="Increase quantity"
							>
								<Plus className='h-3 w-3 text-gray-600' strokeWidth={2} />
							</button>
						</div>

						{/* Remove Button */}
						<button
							className='inline-flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs uppercase tracking-wider
							text-gray-500 hover:text-red-600 transition-colors duration-200 font-bold'
							onClick={() => removeFromCart(item._id)}
							aria-label="Remove item"
						>
							<Trash2 className='h-3.5 w-3.5 sm:h-4 sm:w-4' strokeWidth={2} />
							<span className='hidden sm:inline'>Remove</span>
						</button>
					</div>
				</div>

				{/* Desktop Price - Only visible on larger screens */}
				<div className='hidden sm:block shrink-0 text-right space-y-1.5'>
					<div className='flex flex-col items-end gap-1'>
						<p className='text-lg md:text-xl font-bold text-gray-900'>₹{item.price.toLocaleString()}</p>
						<div className='flex items-center gap-2'>
							<span className='text-xs text-gray-500 line-through font-semibold'>₹{originalPrice.toLocaleString()}</span>
							<span className='text-xs text-blue-600 font-bold'>-{discountPercentage}%</span>
						</div>
					</div>
					<p className='text-xs text-green-600 font-bold'>
						Save ₹{discountAmount.toLocaleString()}
					</p>
				</div>
			</div>

			{/* Savings Highlight Bar - Bottom */}
			<div className='mt-3 sm:mt-4 pt-3 sm:pt-4 border-t-2 border-blue-100'>
				<div className='flex items-center justify-between text-[10px] sm:text-xs'>
					<div className='flex items-center gap-1.5 text-gray-600 font-semibold'>
						<span>Item Total:</span>
						<span className='text-gray-400 line-through'>₹{(originalPrice * item.quantity).toLocaleString()}</span>
					</div>
					<div className='flex items-center gap-2'>
						<span className='text-green-600 font-bold'>
							Total Savings: ₹{(discountAmount * item.quantity).toLocaleString()}
						</span>
						<div className='w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse' />
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default CartItem
