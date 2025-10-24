import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";

const OrderSummary = () => {
  const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();
  const navigate = useNavigate();

  const savings = subtotal - total;
  const formattedSubtotal = subtotal.toFixed(2);
  const formattedTotal = total.toFixed(2);
  const formattedSavings = savings.toFixed(2);

  const handleProceedToCheckout = () => {
    navigate("/checkout");
  };

  return (
    <motion.div
      className="bg-zinc-950 border border-zinc-800/50 p-6 sm:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <h2 className="text-lg uppercase tracking-widest text-zinc-500 font-light mb-6">
        Order Summary
      </h2>

      {/* Price Breakdown */}
      <div className="space-y-4 mb-6">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400 font-light">Subtotal</span>
          <span className="text-sm text-white font-light">₹{formattedSubtotal}</span>
        </div>

        {/* Savings */}
        {savings > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400 font-light">Discount</span>
            <span className="text-sm text-white font-light">-₹{formattedSavings}</span>
          </div>
        )}

        {/* Coupon */}
        {coupon && isCouponApplied && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400 font-light">
              Coupon 
              <span className="ml-2 text-xs text-zinc-500 uppercase tracking-wider">
                ({coupon.code})
              </span>
            </span>
            <span className="text-sm text-white font-light">-{coupon.discountPercentage}%</span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-zinc-800 pt-4 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-base text-white font-light uppercase tracking-wide">Total</span>
            <span className="text-xl text-white font-light">₹{formattedTotal}</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <motion.button
        className="group relative w-full flex justify-center items-center py-3 px-4 
        bg-white text-black text-sm font-medium uppercase tracking-wide
        hover:bg-zinc-900 hover:text-white border border-white hover:border-zinc-700
        transition-all duration-300 overflow-hidden mb-6"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleProceedToCheckout}
      >
        <div className="absolute inset-0 bg-zinc-900 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <ShoppingBag className="mr-2 h-4 w-4 relative z-10" strokeWidth={1.5} />
        <span className="relative z-10">Proceed to Checkout</span>
      </motion.button>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-800"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest">
          <span className="px-4 bg-zinc-950 text-zinc-600 font-light">Or</span>
        </div>
      </div>

      {/* Continue Shopping Link */}
      <Link
        to="/"
        className="inline-flex items-center justify-center w-full text-sm text-white hover:text-zinc-300 
        transition-colors group font-light tracking-wide"
      >
        <span>Continue Shopping</span>
        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
      </Link>

      {/* Additional Info */}
      <div className="mt-6 pt-6 border-t border-zinc-800/50">
        <p className="text-center text-xs text-zinc-600 font-light uppercase tracking-widest">
          Secure Checkout
        </p>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
