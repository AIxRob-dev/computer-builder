import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ShoppingBag, Truck, Package, Sparkles, TrendingUp } from "lucide-react";

const OrderSummary = () => {
  const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();
  const navigate = useNavigate();

  // Constants
  const FREE_DELIVERY_THRESHOLD = 24599;
  const DELIVERY_FEE = 1800;
  const PACKAGING_FEE_PERCENTAGE = 2;

  // Calculate original total (before any discounts)
  const originalTotal = cart.reduce((sum, item) => {
    const originalPrice = Math.round(item.price * 1.3); // 23% markup
    return sum + (originalPrice * item.quantity);
  }, 0);

  // Calculate product discount (23% off on all items)
  const productDiscount = originalTotal - subtotal;

  // Check if eligible for free delivery
  const isEligibleForFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const amountNeededForFreeDelivery = isEligibleForFreeDelivery ? 0 : FREE_DELIVERY_THRESHOLD - subtotal;
  
  // Calculate delivery fee
  const deliveryFee = isEligibleForFreeDelivery ? 0 : DELIVERY_FEE;

  // Calculate packaging fee (2% of subtotal)
  const packagingFee = (subtotal * PACKAGING_FEE_PERCENTAGE) / 100;

  // Calculate coupon discount if applied
  const couponDiscount = (coupon && isCouponApplied) ? (subtotal * coupon.discountPercentage) / 100 : 0;

  // Calculate final total
  const finalTotal = subtotal + deliveryFee + packagingFee - couponDiscount;

  // Calculate total savings (product discount + free delivery + coupon)
  const totalSavings = productDiscount + (isEligibleForFreeDelivery ? DELIVERY_FEE : 0) + couponDiscount;

  const handleProceedToCheckout = () => {
    navigate("/checkout");
  };

  return (
    <motion.div
      className="bg-white border-2 border-blue-100 rounded-xl shadow-lg p-6 sm:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg uppercase tracking-widest text-blue-600 font-bold">
          Order Summary
        </h2>
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-blue-600" strokeWidth={2} />
          <span className="text-xs text-blue-600 font-bold">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-4 mb-6">
        {/* Original Price (strikethrough) */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-blue-100">
          <span className="text-sm text-gray-600 font-semibold">Original Price</span>
          <span className="text-sm text-gray-500 line-through font-semibold">₹{originalTotal.toFixed(2)}</span>
        </div>

        {/* Product Discount (23% off) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-green-600" strokeWidth={2} />
            <span className="text-sm text-gray-700 font-semibold">Product Discount</span>
            <span className="text-[10px] text-white font-bold bg-green-600 px-2 py-0.5 rounded border-2 border-green-600">
              23% OFF
            </span>
          </div>
          <span className="text-sm text-green-600 font-bold">-₹{productDiscount.toFixed(2)}</span>
        </div>

        {/* Subtotal after discount */}
        <div className="flex items-center justify-between bg-blue-50 px-3 py-2 -mx-3 rounded-lg">
          <span className="text-sm text-gray-900 font-bold">Subtotal</span>
          <span className="text-sm text-gray-900 font-bold">₹{subtotal.toFixed(2)}</span>
        </div>

        {/* Delivery Fee */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-blue-600" strokeWidth={2} />
              <span className="text-sm text-gray-700 font-semibold">Delivery Fee</span>
            </div>
            {isEligibleForFreeDelivery ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 line-through font-semibold">₹{DELIVERY_FEE}</span>
                <span className="text-sm text-green-600 font-bold">FREE</span>
              </div>
            ) : (
              <span className="text-sm text-gray-900 font-bold">₹{deliveryFee.toFixed(2)}</span>
            )}
          </div>
          
          {/* Free Delivery Message */}
          {isEligibleForFreeDelivery ? (
            <motion.div 
              className="bg-green-50 border-2 border-green-200 px-3 py-2 -mx-3 rounded-lg"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-600 font-bold">
                  Yay! You've unlocked FREE delivery 🎉
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              className="bg-amber-50 border-2 border-amber-200 px-3 py-2 -mx-3 rounded-lg"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-amber-600 font-bold">
                  Add ₹{amountNeededForFreeDelivery.toFixed(2)} more for FREE delivery
                </span>
                <Link 
                  to="/" 
                  className="text-xs text-amber-600 hover:text-amber-700 underline underline-offset-2 transition-colors font-bold"
                >
                  Shop
                </Link>
              </div>
            </motion.div>
          )}
        </div>

        {/* Packaging Fee */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-3.5 h-3.5 text-blue-600" strokeWidth={2} />
            <span className="text-sm text-gray-700 font-semibold">Packaging Fee</span>
            <span className="text-[10px] text-gray-600 font-bold">({PACKAGING_FEE_PERCENTAGE}%)</span>
          </div>
          <span className="text-sm text-gray-900 font-bold">₹{packagingFee.toFixed(2)}</span>
        </div>

        {/* Coupon Discount */}
        {coupon && isCouponApplied && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-green-600" strokeWidth={2} />
              <span className="text-sm text-gray-700 font-semibold">
                Coupon Discount
              </span>
              <span className="text-[10px] text-white font-bold bg-green-600 px-2 py-0.5 rounded border-2 border-green-600 uppercase">
                {coupon.code}
              </span>
            </div>
            <span className="text-sm text-green-600 font-bold">-₹{couponDiscount.toFixed(2)}</span>
          </div>
        )}

        {/* Total Savings Highlight */}
        {totalSavings > 0 && (
          <motion.div 
            className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 px-3 py-3 -mx-3 rounded-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-green-600 font-bold uppercase tracking-wide">
                  Total Savings
                </span>
              </div>
              <span className="text-lg text-green-600 font-bold">₹{totalSavings.toFixed(2)}</span>
            </div>
            <p className="text-[10px] text-green-600 font-semibold mt-1 ml-4">
              You're saving big on this order! 🎉
            </p>
          </motion.div>
        )}

        {/* Divider */}
        <div className="border-t-2 border-blue-100 pt-4 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-base text-gray-900 font-bold uppercase tracking-wide">Total Amount</span>
            <div className="text-right">
              <span className="text-2xl text-gray-900 font-bold">₹{finalTotal.toFixed(2)}</span>
              {totalSavings > 0 && (
                <p className="text-[10px] text-gray-600 font-semibold mt-0.5">
                  (Saved ₹{totalSavings.toFixed(2)})
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <motion.button
        className="group relative w-full flex justify-center items-center py-3 px-4 
        bg-blue-600 text-white text-sm font-bold uppercase tracking-wide rounded-lg
        hover:bg-blue-700 shadow-lg hover:shadow-xl
        transition-all duration-300 mb-6"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleProceedToCheckout}
      >
        <ShoppingBag className="mr-2 h-4 w-4 relative z-10" strokeWidth={2} />
        <span className="relative z-10">Proceed to Checkout</span>
      </motion.button>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-blue-100"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest">
          <span className="px-4 bg-white text-gray-500 font-bold">Or</span>
        </div>
      </div>

      {/* Continue Shopping Link */}
      <Link
        to="/"
        className="inline-flex items-center justify-center w-full text-sm text-blue-600 hover:text-blue-700 
        transition-colors group font-bold tracking-wide"
      >
        <span>Continue Shopping</span>
        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
      </Link>

      {/* Additional Info */}
      <div className="mt-6 pt-6 border-t-2 border-blue-100">
        <div className="flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <p className="text-center text-xs text-gray-600 font-bold uppercase tracking-widest">
            Secure Checkout
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
