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
			className='bg-white border-2 border-blue-100 rounded-xl shadow-lg p-6 sm:p-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
		>
			{/* Header */}
			<div className="flex items-center mb-6">
				<Tag className="h-4 w-4 text-blue-600 mr-2" strokeWidth={2} />
				<h2 className="text-lg uppercase tracking-widest text-blue-600 font-bold">
					Promo Code
				</h2>
			</div>

			{/* Input Section */}
			<div className='space-y-4'>
				<div>
					<label htmlFor='voucher' className='block text-xs uppercase tracking-widest text-gray-600 font-semibold mb-2'>
						Have a coupon?
					</label>
					<input
						type='text'
						id='voucher'
						className='block w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg
						text-gray-900 placeholder-gray-400 uppercase font-medium
						focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20
						transition-all duration-300 text-sm tracking-wide
						disabled:opacity-50 disabled:cursor-not-allowed'
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
						bg-blue-600 text-white text-sm font-bold uppercase tracking-wide rounded-lg
						hover:bg-blue-700 shadow-lg hover:shadow-xl
						transition-all duration-300
						disabled:opacity-50 disabled:cursor-not-allowed'
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={handleApplyCoupon}
						disabled={!userInputCode}
					>
						<span className='relative z-10'>Apply Code</span>
					</motion.button>
				)}
			</div>

			{/* Applied Coupon Section */}
			{isCouponApplied && coupon && (
				<motion.div
					className='mt-6 pt-6 border-t-2 border-blue-100'
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
				>
					<div className="flex items-start justify-between mb-4">
						<div className="flex items-start">
							<CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2" strokeWidth={2} />
							<div>
								<h3 className='text-sm uppercase tracking-wide text-gray-900 font-bold'>
									Coupon Applied
								</h3>
								<p className='mt-1 text-xs text-gray-600 font-semibold'>
									<span className="text-blue-600 uppercase tracking-wider font-bold">{coupon.code}</span>
									<span className="mx-2">•</span>
									<span className="text-green-600 font-bold">{coupon.discountPercentage}% off</span>
								</p>
							</div>
						</div>
					</div>

					{/* Remove Button */}
					<motion.button
						type='button'
						className='group relative w-full flex justify-center items-center py-2.5 px-4 
						bg-white text-gray-700 text-xs font-bold uppercase tracking-wide rounded-lg
						hover:bg-gray-50 border-2 border-gray-200 hover:border-red-300 hover:text-red-600
						transition-all duration-300'
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={handleRemoveCoupon}
					>
						<X className="mr-2 h-3 w-3" strokeWidth={2} />
						<span>Remove Coupon</span>
					</motion.button>
				</motion.div>
			)}

			{/* Available Coupon Section */}
			{coupon && !isCouponApplied && (
				<motion.div
					className='mt-6 pt-6 border-t-2 border-blue-100'
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
				>
					<h3 className='text-xs uppercase tracking-widest text-gray-600 font-bold mb-3'>
						Available for you
					</h3>
					<div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className='text-sm text-blue-600 font-bold uppercase tracking-wider'>
									{coupon.code}
								</p>
								<p className='mt-1 text-xs text-gray-600 font-semibold'>
									{coupon.discountPercentage}% discount
								</p>
							</div>
							<Tag className="h-4 w-4 text-blue-600" strokeWidth={2} />
						</div>
					</div>
				</motion.div>
			)}
		</motion.div>
	);
};

export default GiftCouponCard;