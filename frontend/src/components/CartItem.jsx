import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { motion } from "framer-motion";

const CartItem = ({ item }) => {
	const { removeFromCart, updateQuantity } = useCartStore();

	return (
		<motion.div
			className='bg-white border-2 border-blue-100 rounded-xl shadow-lg p-3 sm:p-6'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
		>
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
						<p className='text-base font-bold text-gray-900'>₹{item.price}</p>
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
				<div className='hidden sm:block shrink-0 text-right'>
					<p className='text-lg font-bold text-gray-900'>₹{item.price}</p>
				</div>
			</div>
		</motion.div>
	);
};

export default CartItem;