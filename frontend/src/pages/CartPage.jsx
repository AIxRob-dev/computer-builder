import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowRight } from "lucide-react";
import CartItem from "../components/CartItem";
import PeopleAlsoBought from "../components/PeopleAlsoBought";
import OrderSummary from "../components/OrderSummary";
import GiftCouponCard from "../components/GiftCouponCard";

const CartPage = () => {
	const { cart } = useCartStore();

	return (
		<div className='min-h-screen py-8 sm:py-12 md:py-16 lg:py-20'>
			<div className='mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8'>
				{/* Page Header */}
				<motion.div
					className='mb-8 sm:mb-12'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<h1 className='text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight'>
						Shopping Cart
					</h1>
					{cart.length > 0 && (
						<p className='mt-2 text-sm sm:text-base text-zinc-400 font-light'>
							{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
						</p>
					)}
				</motion.div>

				<div className='lg:flex lg:items-start lg:gap-8 xl:gap-12'>
					{/* Cart Items Section */}
					<motion.div
						className='w-full flex-none lg:max-w-2xl xl:max-w-3xl'
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						{cart.length === 0 ? (
							<EmptyCartUI />
						) : (
							<div className='space-y-4 sm:space-y-6'>
								{cart.map((item, index) => (
									<motion.div
										key={item._id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.4, delay: index * 0.1 }}
									>
										<CartItem item={item} />
									</motion.div>
								))}
							</div>
						)}
						{cart.length > 0 && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.6 }}
							>
								<PeopleAlsoBought />
							</motion.div>
						)}
					</motion.div>

					{/* Order Summary Section */}
					{cart.length > 0 && (
						<motion.div
							className='mx-auto mt-8 sm:mt-10 lg:mt-0 w-full max-w-md lg:max-w-none flex-1 space-y-4 sm:space-y-6 lg:sticky lg:top-24'
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5, delay: 0.4 }}
						>
							<OrderSummary />
							<GiftCouponCard />
						</motion.div>
					)}
				</div>
			</div>
		</div>
	);
};

export default CartPage;

const EmptyCartUI = () => (
	<motion.div
		className='flex flex-col items-center justify-center space-y-6 py-16 sm:py-20 lg:py-24'
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.6 }}
	>
		{/* Icon Container with subtle glow */}
		<div className='relative'>
			<div className='absolute inset-0 bg-white/5 blur-2xl rounded-full' />
			<div className='relative bg-zinc-900/50 border border-zinc-800 p-8 sm:p-10 rounded-full'>
				<ShoppingCart className='h-16 w-16 sm:h-20 sm:w-20 text-zinc-500' strokeWidth={1.5} />
			</div>
		</div>

		{/* Text Content */}
		<div className='text-center space-y-3 px-4'>
			<h3 className='text-2xl sm:text-3xl font-light text-white tracking-tight'>
				Your Cart is Empty
			</h3>
			<p className='text-sm sm:text-base text-zinc-400 font-light max-w-md'>
				Looks like you haven't added anything to your cart yet. Start exploring our collection.
			</p>
		</div>

		{/* CTA Button */}
		<Link
			to='/'
			className='group relative inline-flex items-center justify-center px-8 py-3 sm:px-10 sm:py-4 
			bg-white text-black text-sm font-medium uppercase tracking-wide
			hover:bg-zinc-900 hover:text-white border border-white hover:border-zinc-700
			transition-all duration-300 overflow-hidden mt-4'
		>
			<div className='absolute inset-0 bg-zinc-900 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300' />
			<span className='relative z-10'>Start Shopping</span>
			<ArrowRight className='ml-2 h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform' strokeWidth={1.5} />
		</Link>

		{/* Decorative element */}
		<div className='mt-8 pt-8 border-t border-zinc-800/50 w-full max-w-md'>
			<p className='text-center text-xs text-zinc-600 font-light uppercase tracking-widest'>
				Free Shipping on Orders Over $50
			</p>
		</div>
	</motion.div>
);
