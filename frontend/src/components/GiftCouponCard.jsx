import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCartStore } from "../stores/useCartStore";
import { Tag, X, CheckCircle } from "lucide-react";

const GiftCouponCard = () => {
	const [userInputCode, setUserInputCode] = useState("");
	const { coupon, isCouponApplied, applyCoupon, getMyCoupon, removeCoupon } = useCartStore();

	useEffect(() => {
		getMyCoupon();
	}, [getMyCoupon]);

	useEffect(() => {
		if (coupon) setUserInputCode(coupon.code);
	}, [coupon]);

	const handleApplyCoupon = () => {
		if (!userInputCode) return;
		applyCoupon(userInputCode);
	};

	const handleRemoveCoupon = async () => {
		await removeCoupon();
		setUserInputCode("");
	};

	return (
		<motion.div
			className='bg-zinc-950 border border-zinc-800/50 p-6 sm:p-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
		>
			{/* Header */}
			<div className="flex items-center mb-6">
				<Tag className="h-4 w-4 text-zinc-500 mr-2" strokeWidth={1.5} />
				<h2 className="text-lg uppercase tracking-widest text-zinc-500 font-light">
					Promo Code
				</h2>
			</div>

			{/* Input Section */}
			<div className='space-y-4'>
				<div>
					<label htmlFor='voucher' className='block text-xs uppercase tracking-widest text-zinc-500 font-light mb-2'>
						Have a coupon?
					</label>
					<input
						type='text'
						id='voucher'
						className='block w-full px-4 py-3 bg-black/50 border border-zinc-800 
						text-white placeholder-zinc-600 uppercase
						focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700
						transition-all duration-300 font-light text-sm tracking-wide'
						placeholder='ENTER CODE'
						value={userInputCode}
						onChange={(e) => setUserInputCode(e.target.value.toUpperCase())}
						disabled={isCouponApplied}
					/>
				</div>

				{/* Apply Button */}
				{!isCouponApplied && (
					<motion.button
						type='button'
						className='group relative w-full flex justify-center items-center py-3 px-4 
						bg-white text-black text-sm font-medium uppercase tracking-wide
						hover:bg-zinc-900 hover:text-white border border-white hover:border-zinc-700
						transition-all duration-300 overflow-hidden
						disabled:opacity-50 disabled:cursor-not-allowed'
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={handleApplyCoupon}
						disabled={!userInputCode}
					>
						<div className='absolute inset-0 bg-zinc-900 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300' />
						<span className='relative z-10'>Apply Code</span>
					</motion.button>
				)}
			</div>

			{/* Applied Coupon Section */}
			{isCouponApplied && coupon && (
				<motion.div
					className='mt-6 pt-6 border-t border-zinc-800/50'
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
				>
					<div className="flex items-start justify-between mb-4">
						<div className="flex items-start">
							<CheckCircle className="h-4 w-4 text-white mt-0.5 mr-2" strokeWidth={1.5} />
							<div>
								<h3 className='text-sm uppercase tracking-wide text-white font-light'>
									Coupon Applied
								</h3>
								<p className='mt-1 text-xs text-zinc-400 font-light'>
									<span className="text-white uppercase tracking-wider">{coupon.code}</span>
									<span className="mx-2">•</span>
									<span>{coupon.discountPercentage}% off</span>
								</p>
							</div>
						</div>
					</div>

					{/* Remove Button */}
					<motion.button
						type='button'
						className='group relative w-full flex justify-center items-center py-2.5 px-4 
						bg-transparent text-white text-xs font-medium uppercase tracking-wide
						hover:bg-zinc-900 border border-zinc-700 hover:border-zinc-600
						transition-all duration-300'
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={handleRemoveCoupon}
					>
						<X className="mr-2 h-3 w-3" strokeWidth={1.5} />
						<span>Remove Coupon</span>
					</motion.button>
				</motion.div>
			)}

			{/* Available Coupon Section */}
			{coupon && !isCouponApplied && (
				<motion.div
					className='mt-6 pt-6 border-t border-zinc-800/50'
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
				>
					<h3 className='text-xs uppercase tracking-widest text-zinc-500 font-light mb-3'>
						Available for you
					</h3>
					<div className="bg-black/30 border border-zinc-800 p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className='text-sm text-white font-light uppercase tracking-wider'>
									{coupon.code}
								</p>
								<p className='mt-1 text-xs text-zinc-400 font-light'>
									{coupon.discountPercentage}% discount
								</p>
							</div>
							<Tag className="h-4 w-4 text-zinc-500" strokeWidth={1.5} />
						</div>
					</div>
				</motion.div>
			)}
		</motion.div>
	);
};

export default GiftCouponCard;
