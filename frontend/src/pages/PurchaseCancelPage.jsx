import { XCircle, ArrowLeft, ShoppingBag, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PurchaseCancelPage = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <motion.div
        className="max-w-2xl w-full relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Cancel Icon */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-zinc-500/10 blur-2xl rounded-full" />
            <XCircle className="text-zinc-500 w-20 h-20 relative z-10" strokeWidth={1.5} />
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
                Payment Cancelled
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base font-light leading-relaxed">
                Your order has been cancelled. No charges have been made to your account.
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <motion.div
                className="bg-black/30 border border-zinc-800 p-6 group hover:border-zinc-700 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <ShoppingBag className="h-5 w-5 text-zinc-500 mb-3 group-hover:text-white transition-colors" strokeWidth={1.5} />
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1 font-light">
                  Your Cart
                </p>
                <p className="text-sm text-white font-light">Items saved</p>
                <p className="text-xs text-zinc-600 mt-1 font-light">
                  Ready when you are
                </p>
              </motion.div>

              <motion.div
                className="bg-black/30 border border-zinc-800 p-6 group hover:border-zinc-700 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <HelpCircle className="h-5 w-5 text-zinc-500 mb-3 group-hover:text-white transition-colors" strokeWidth={1.5} />
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1 font-light">
                  Need Help?
                </p>
                <p className="text-sm text-white font-light">We're here</p>
                <p className="text-xs text-zinc-600 mt-1 font-light">
                  Contact support anytime
                </p>
              </motion.div>
            </div>

            {/* Support Notice */}
            <motion.div
              className="bg-black/30 border border-zinc-800 p-6 mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <p className="text-sm text-zinc-400 font-light leading-relaxed text-center">
                If you encountered any issues during checkout or have questions about your order, 
                our support team is ready to assist you.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              <Link
                to="/cart"
                className="group relative w-full flex justify-center items-center py-4 px-6 
                text-sm font-medium uppercase tracking-wide
                bg-white text-black hover:bg-zinc-900 hover:text-white 
                border border-white hover:border-zinc-700
                transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-zinc-900 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
                  Return to Cart
                </span>
              </Link>

              <Link
                to="/"
                className="group w-full flex justify-center items-center py-4 px-6 
                text-sm font-medium uppercase tracking-wide
                bg-transparent text-zinc-400 hover:text-white 
                border border-zinc-800 hover:border-zinc-700
                transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" strokeWidth={1.5} />
                  Continue Shopping
                </span>
              </Link>

              <Link
                to="/contact"
                className="group w-full flex justify-center items-center py-4 px-6 
                text-sm font-medium uppercase tracking-wide
                bg-transparent text-zinc-400 hover:text-white 
                border border-zinc-800 hover:border-zinc-700
                transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" strokeWidth={1.5} />
                  Contact Support
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
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          We're here whenever you're ready to complete your purchase
        </motion.p>
      </motion.div>
    </div>
  );
};

export default PurchaseCancelPage;
