import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Lock } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import ShippingAddressForm from "../components/ShippingAddressForm";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, total, subtotal, coupon, clearCart } = useCartStore();
  const [shippingAddress, setShippingAddress] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const paymentCompletedRef = useRef(false);

  // Redirect if cart is empty
  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  const savings = subtotal - total;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleAddressSubmit = (address) => {
    setShippingAddress(address);
    toast.success("Address saved! Ready for payment.");
  };

  const handlePayment = async () => {
    if (!shippingAddress) {
      toast.error("Please fill in your shipping address first");
      return;
    }

    try {
      setIsProcessing(true);
      paymentCompletedRef.current = false;

      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error("Failed to load payment gateway. Please try again.");
        setIsProcessing(false);
        return;
      }

      // Create order on backend with shipping address
      const { data } = await axios.post("/payments/create-checkout-session", {
        products: cart,
        couponCode: coupon ? coupon.code : null,
        shippingAddress: shippingAddress,
      });

      const { orderId, amount, currency, keyId } = data;

      // Razorpay options
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "Your Store Name",
        description: "Purchase from Your Store",
        order_id: orderId,
        handler: async function (response) {
          try {
            paymentCompletedRef.current = true;
            
            // Verify payment on backend
            const verifyRes = await axios.post("/payments/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              clearCart();
              toast.success("Payment successful! Check your email for confirmation.");
              
              // Small delay to ensure modal closes properly
              setTimeout(() => {
                navigate("/purchase-success");
              }, 500);
            } else {
              toast.error("Payment verification failed. Please contact support.");
              setTimeout(() => {
                navigate("/purchase-cancel");
              }, 500);
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            toast.error("Payment verification failed. Please contact support.");
            
            setTimeout(() => {
              navigate("/purchase-cancel");
            }, 500);
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: shippingAddress.fullName,
          contact: shippingAddress.phone,
        },
        theme: {
          color: "#ffffff",
        },
        modal: {
          ondismiss: function () {
            // Only navigate to cancel if payment wasn't completed successfully
            if (!paymentCompletedRef.current) {
              setTimeout(() => {
                setIsProcessing(false);
                toast.error("Payment cancelled");
                navigate("/purchase-cancel");
              }, 300);
            }
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
      setIsProcessing(false);
    }
  };

  const triggerAddressFormSubmit = () => {
    document.getElementById("address-form-submit")?.click();
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate("/cart")}
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white 
          transition-colors font-light tracking-wide mb-6 sm:mb-8 group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" strokeWidth={1.5} />
          <span>Back to Cart</span>
        </motion.button>

        {/* Page Header */}
        <motion.div
          className="mb-8 sm:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight">
            Checkout
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-400 font-light">
            Complete your order
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-12">
          {/* Left Side - Shipping Address Form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ShippingAddressForm
              onAddressSubmit={handleAddressSubmit}
              initialAddress={shippingAddress}
            />
          </motion.div>

          {/* Right Side - Order Summary */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-zinc-950 border border-zinc-800/50 p-6 sm:p-8 lg:sticky lg:top-24">
              {/* Header */}
              <div className="flex items-center mb-6">
                <ShoppingBag className="h-4 w-4 text-zinc-500 mr-2" strokeWidth={1.5} />
                <h2 className="text-lg uppercase tracking-widest text-zinc-500 font-light">
                  Order Summary
                </h2>
              </div>

              {/* Products List */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto custom-scrollbar">
                {cart.map((item, index) => (
                  <motion.div
                    key={item._id}
                    className="flex items-center gap-3 pb-4 border-b border-zinc-800/50 last:border-0 last:pb-0"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="w-14 h-14 shrink-0 bg-black/30 border border-zinc-800 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-white font-light line-clamp-1 tracking-tight">
                        {item.name}
                      </p>
                      <p className="text-[10px] sm:text-xs text-zinc-500 font-light mt-0.5">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-xs sm:text-sm text-white font-light shrink-0">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pt-6 border-t border-zinc-800/50">
                <div className="flex justify-between text-sm text-zinc-400 font-light">
                  <span>Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-sm text-white font-light">
                    <span>Discount</span>
                    <span>-₹{savings.toFixed(2)}</span>
                  </div>
                )}

                {coupon && (
                  <div className="flex justify-between text-sm text-zinc-400 font-light">
                    <span>Coupon <span className="text-zinc-500 text-xs uppercase">({coupon.code})</span></span>
                    <span>-{coupon.discountPercentage}%</span>
                  </div>
                )}

                <div className="flex justify-between text-base sm:text-lg pt-4 border-t border-zinc-800 font-light">
                  <span className="text-white uppercase tracking-wide">Total</span>
                  <span className="text-white">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Address Preview */}
              {shippingAddress && (
                <motion.div
                  className="mb-6 p-4 bg-black/30 border border-zinc-800"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-xs uppercase tracking-widest text-zinc-500 font-light mb-2">
                    Delivering to:
                  </p>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed">
                    {shippingAddress.fullName}
                    <br />
                    {shippingAddress.addressLine1}
                    {shippingAddress.addressLine2 && `, ${shippingAddress.addressLine2}`}
                    <br />
                    {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
                    <br />
                    <span className="text-zinc-500">Phone:</span> {shippingAddress.phone}
                  </p>
                </motion.div>
              )}

              {/* Payment Button */}
              <button
                onClick={shippingAddress ? handlePayment : triggerAddressFormSubmit}
                disabled={isProcessing}
                className={`group relative w-full flex justify-center items-center py-3 sm:py-4 px-4 
                text-sm font-medium uppercase tracking-wide
                transition-all duration-300 overflow-hidden
                ${
                  isProcessing
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                    : "bg-white text-black hover:bg-zinc-900 hover:text-white border border-white hover:border-zinc-700"
                }`}
              >
                {!isProcessing && (
                  <div className="absolute inset-0 bg-zinc-900 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                )}
                <span className="relative z-10">
                  {isProcessing
                    ? "Processing..."
                    : shippingAddress
                    ? `Pay ₹${total.toFixed(2)}`
                    : "Save Address & Continue"}
                </span>
              </button>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-zinc-800/50 flex items-center justify-center gap-2">
                <Lock className="h-3 w-3 text-zinc-600" strokeWidth={1.5} />
                <p className="text-xs text-zinc-600 font-light uppercase tracking-widest">
                  Secured by Razorpay
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #18181b;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3f3f46;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #52525b;
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;
