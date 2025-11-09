import { ArrowRight, CheckCircle, Package, Mail, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

const PurchaseSuccessPage = () => {
  const { clearCart } = useCartStore();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // Clear cart on mount (backup in case it wasn't cleared during payment)
    clearCart();

    // Handle window resize for confetti
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center px-4 py-12">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        gravity={0.15}
        style={{ zIndex: 99 }}
        numberOfPieces={500}
        recycle={false}
        colors={["#ffffff", "#dbeafe", "#93c5fd", "#3b82f6", "#2563eb"]}
      />

      <motion.div
        className="max-w-2xl w-full relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Success Icon */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-white/30 blur-2xl rounded-full" />
            <CheckCircle className="text-white w-20 h-20 relative z-10" strokeWidth={2} />
          </div>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          className="bg-white border-2 border-white rounded-xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="p-8 sm:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-3">
                Order Confirmed
              </h1>
              <p className="text-gray-600 text-sm sm:text-base font-semibold leading-relaxed">
                Thank you for your purchase. Your order has been successfully processed.
              </p>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <motion.div
                className="bg-green-50 border-2 border-green-600 rounded-lg p-5 group hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <CheckCircle className="h-5 w-5 text-green-600 mb-3" strokeWidth={2} />
                <p className="text-xs uppercase tracking-widest text-green-700 mb-1 font-bold">
                  Payment
                </p>
                <p className="text-sm text-green-900 font-bold">Confirmed</p>
              </motion.div>

              <motion.div
                className="bg-blue-50 border-2 border-blue-600 rounded-lg p-5 group hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <Package className="h-5 w-5 text-blue-600 mb-3" strokeWidth={2} />
                <p className="text-xs uppercase tracking-widest text-blue-700 mb-1 font-bold">
                  Status
                </p>
                <p className="text-sm text-blue-900 font-bold">Processing</p>
              </motion.div>

              <motion.div
                className="bg-orange-50 border-2 border-orange-500 rounded-lg p-5 group hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <Clock className="h-5 w-5 text-orange-600 mb-3" strokeWidth={2} />
                <p className="text-xs uppercase tracking-widest text-orange-700 mb-1 font-bold">
                  Delivery
                </p>
                <p className="text-sm text-orange-900 font-bold">3-5 Days</p>
              </motion.div>
            </div>

            {/* Email Notice */}
            <motion.div
              className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8 flex items-start gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              <Mail className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" strokeWidth={2} />
              <div>
                <p className="text-sm text-gray-900 font-bold mb-1">
                  Order confirmation sent
                </p>
                <p className="text-xs text-gray-600 font-semibold leading-relaxed">
                  Check your email for order details, tracking information, and receipt.
                </p>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.8 }}
            >
              <Link
                to="/"
                className="group relative w-full flex justify-center items-center py-4 px-6 
                text-sm font-bold uppercase tracking-wide rounded-lg
                bg-blue-600 text-white hover:bg-blue-700
                border-2 border-blue-600 hover:border-blue-700
                shadow-lg hover:shadow-xl
                transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Continue Shopping
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Bottom Decorative Line */}
          <div className="h-1 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400" />
        </motion.div>

        {/* Footer Note */}
        <motion.p
          className="text-center text-xs text-white/80 mt-8 font-semibold tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          Thank you for trusting us with your order
        </motion.p>
      </motion.div>
    </div>
  );
};

export default PurchaseSuccessPage;