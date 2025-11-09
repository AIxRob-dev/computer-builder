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
      className="bg-white border-2 border-blue-100 rounded-xl shadow-lg p-6 sm:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <h2 className="text-lg uppercase tracking-widest text-blue-600 font-bold mb-6">
        Order Summary
      </h2>

      {/* Price Breakdown */}
      <div className="space-y-4 mb-6">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 font-semibold">Subtotal</span>
          <span className="text-sm text-gray-900 font-bold">₹{formattedSubtotal}</span>
        </div>

        {/* Savings */}
        {savings > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 font-semibold">Discount</span>
            <span className="text-sm text-green-600 font-bold">-₹{formattedSavings}</span>
          </div>
        )}

        {/* Coupon */}
        {coupon && isCouponApplied && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 font-semibold">
              Coupon 
              <span className="ml-2 text-xs text-blue-600 uppercase tracking-wider font-bold">
                ({coupon.code})
              </span>
            </span>
            <span className="text-sm text-green-600 font-bold">-{coupon.discountPercentage}%</span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t-2 border-blue-100 pt-4 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-base text-gray-900 font-bold uppercase tracking-wide">Total</span>
            <span className="text-xl text-gray-900 font-bold">₹{formattedTotal}</span>
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
        <p className="text-center text-xs text-gray-500 font-bold uppercase tracking-widest">
          Secure Checkout
        </p>
      </div>
    </motion.div>
  );
};

export default OrderSummary;