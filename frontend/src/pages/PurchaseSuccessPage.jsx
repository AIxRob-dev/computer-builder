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
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        gravity={0.15}
        style={{ zIndex: 99 }}
        numberOfPieces={500}
        recycle={false}
        colors={["#ffffff", "#e4e4e7", "#a1a1aa", "#71717a"]}
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
            <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full" />
            <CheckCircle className="text-white w-20 h-20 relative z-10" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          className="bg-zinc-950 border border-zinc-800/50 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="p-8 sm:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight mb-3">
                Order Confirmed
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base font-light leading-relaxed">
                Thank you for your purchase. Your order has been successfully processed.
              </p>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <motion.div
                className="bg-black/30 border border-zinc-800 p-5 group hover:border-zinc-700 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <CheckCircle className="h-5 w-5 text-zinc-500 mb-3 group-hover:text-white transition-colors" strokeWidth={1.5} />
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1 font-light">
                  Payment
                </p>
                <p className="text-sm text-white font-light">Confirmed</p>
              </motion.div>

              <motion.div
                className="bg-black/30 border border-zinc-800 p-5 group hover:border-zinc-700 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <Package className="h-5 w-5 text-zinc-500 mb-3 group-hover:text-white transition-colors" strokeWidth={1.5} />
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1 font-light">
                  Status
                </p>
                <p className="text-sm text-white font-light">Processing</p>
              </motion.div>

              <motion.div
                className="bg-black/30 border border-zinc-800 p-5 group hover:border-zinc-700 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <Clock className="h-5 w-5 text-zinc-500 mb-3 group-hover:text-white transition-colors" strokeWidth={1.5} />
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1 font-light">
                  Delivery
                </p>
                <p className="text-sm text-white font-light">3-5 Days</p>
              </motion.div>
            </div>

            {/* Email Notice */}
            <motion.div
              className="bg-black/30 border border-zinc-800 p-6 mb-8 flex items-start gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              <Mail className="h-5 w-5 text-zinc-500 shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <p className="text-sm text-white font-light mb-1">
                  Order confirmation sent
                </p>
                <p className="text-xs text-zinc-500 font-light leading-relaxed">
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
                text-sm font-medium uppercase tracking-wide
                bg-white text-black hover:bg-zinc-900 hover:text-white 
                border border-white hover:border-zinc-700
                transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-zinc-900 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center gap-2">
                  Continue Shopping
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
                </span>
              </Link>

             
            </motion.div>
          </div>

          {/* Bottom Decorative Line */}
          <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
        </motion.div>

        {/* Footer Note */}
        <motion.p
          className="text-center text-xs text-zinc-600 mt-8 font-light tracking-wide"
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
