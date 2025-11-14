import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Lock, Truck, Package, TrendingUp, Sparkles } from "lucide-react";
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
  
  // Calculate delivery fee
  const deliveryFee = isEligibleForFreeDelivery ? 0 : DELIVERY_FEE;

  // Calculate packaging fee (2% of subtotal)
  const packagingFee = (subtotal * PACKAGING_FEE_PERCENTAGE) / 100;

  // Calculate coupon discount if applied
  const couponDiscount = (coupon) ? (subtotal * coupon.discountPercentage) / 100 : 0;

  // Calculate final total
  const finalTotal = subtotal + deliveryFee + packagingFee - couponDiscount;

  // Calculate total savings (product discount + free delivery + coupon)
  const totalSavings = productDiscount + (isEligibleForFreeDelivery ? DELIVERY_FEE : 0) + couponDiscount;

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
        name: "COMPUTER BUILDER",
        description: "Purchase from Computer Builder",
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
          color: "#2563eb",
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
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate("/cart")}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 
          transition-colors font-semibold tracking-wide mb-6 sm:mb-8 group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" strokeWidth={2} />
          <span>Back to Cart</span>
        </motion.button>

        {/* Page Header */}
        <motion.div
          className="mb-8 sm:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Checkout
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 font-semibold">
            Complete your order • {cart.length} {cart.length === 1 ? 'item' : 'items'}
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

          {/* Right Side - Enhanced Order Summary */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-white border-2 border-blue-100 rounded-xl shadow-lg p-6 sm:p-8 lg:sticky lg:top-24">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <ShoppingBag className="h-4 w-4 text-blue-600 mr-2" strokeWidth={2} />
                  <h2 className="text-lg uppercase tracking-widest text-blue-600 font-bold">
                    Order Summary
                  </h2>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" strokeWidth={2} />
                  <span className="text-xs text-blue-600 font-bold">{cart.length}</span>
                </div>
              </div>

              {/* Products List */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto custom-scrollbar">
                {cart.map((item, index) => (
                  <motion.div
                    key={item._id}
                    className="flex items-center gap-3 pb-4 border-b-2 border-blue-100 last:border-0 last:pb-0"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="w-14 h-14 shrink-0 bg-gray-50 border-2 border-blue-100 rounded-lg overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-900 font-semibold line-clamp-1 tracking-tight">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[10px] sm:text-xs text-gray-600 font-semibold">
                          Qty: {item.quantity}
                        </p>
                        <span className="text-[10px] text-gray-400">•</span>
                        <p className="text-[10px] sm:text-xs text-green-600 font-bold">
                          23% off
                        </p>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-900 font-bold shrink-0">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Enhanced Price Breakdown */}
              <div className="space-y-3 mb-6 pt-6 border-t-2 border-blue-100">
                {/* Original Price */}
                <div className="flex justify-between text-sm pb-3 border-b-2 border-blue-100">
                  <span className="text-gray-600 font-semibold">Original Price</span>
                  <span className="text-gray-500 line-through font-semibold">₹{originalTotal.toFixed(2)}</span>
                </div>

                {/* Product Discount */}
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-green-600" strokeWidth={2} />
                    <span className="text-gray-700 font-semibold">Product Discount</span>
                    <span className="text-[9px] text-white font-bold bg-green-600 px-1.5 py-0.5 rounded border-2 border-green-600">
                      23% OFF
                    </span>
                  </div>
                  <span className="text-green-600 font-bold">-₹{productDiscount.toFixed(2)}</span>
                </div>

                {/* Subtotal */}
                <div className="flex justify-between text-sm bg-blue-50 px-3 py-2 -mx-3 rounded-lg">
                  <span className="text-gray-900 font-bold">Subtotal</span>
                  <span className="text-gray-900 font-bold">₹{subtotal.toFixed(2)}</span>
                </div>

                {/* Delivery Fee */}
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Truck className="w-3 h-3 text-blue-600" strokeWidth={2} />
                    <span className="text-gray-700 font-semibold">Delivery Fee</span>
                  </div>
                  {isEligibleForFreeDelivery ? (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 line-through text-xs font-semibold">₹{DELIVERY_FEE}</span>
                      <span className="text-green-600 font-bold">FREE</span>
                    </div>
                  ) : (
                    <span className="text-gray-900 font-bold">₹{deliveryFee.toFixed(2)}</span>
                  )}
                </div>

                {/* Free Delivery Message */}
                {isEligibleForFreeDelivery && (
                  <div className="bg-green-50 border-2 border-green-200 px-3 py-2 -mx-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs text-green-600 font-bold">
                        Free delivery applied!
                      </span>
                    </div>
                  </div>
                )}

                {/* Packaging Fee */}
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="w-3 h-3 text-blue-600" strokeWidth={2} />
                    <span className="text-gray-700 font-semibold">Packaging Fee</span>
                    <span className="text-[9px] text-gray-600 font-bold">({PACKAGING_FEE_PERCENTAGE}%)</span>
                  </div>
                  <span className="text-gray-900 font-bold">₹{packagingFee.toFixed(2)}</span>
                </div>

                {/* Coupon Discount */}
                {coupon && (
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-green-600" strokeWidth={2} />
                      <span className="text-gray-700 font-semibold">Coupon Discount</span>
                      <span className="text-[9px] text-white font-bold bg-green-600 px-1.5 py-0.5 rounded border-2 border-green-600 uppercase">
                        {coupon.code}
                      </span>
                    </div>
                    <span className="text-green-600 font-bold">-₹{couponDiscount.toFixed(2)}</span>
                  </div>
                )}

                {/* Total Savings */}
                {totalSavings > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 px-3 py-2.5 -mx-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs text-green-600 font-bold uppercase tracking-wide">
                          Total Savings
                        </span>
                      </div>
                      <span className="text-base text-green-600 font-bold">₹{totalSavings.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {/* Final Total */}
                <div className="flex justify-between text-base sm:text-lg pt-4 border-t-2 border-blue-100 font-bold">
                  <span className="text-gray-900 uppercase tracking-wide">Total Amount</span>
                  <div className="text-right">
                    <span className="text-gray-900">₹{finalTotal.toFixed(2)}</span>
                    {totalSavings > 0 && (
                      <p className="text-[10px] text-gray-600 font-semibold mt-0.5">
                        (Saved ₹{totalSavings.toFixed(2)})
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Preview */}
              {shippingAddress && (
                <motion.div
                  className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-xs uppercase tracking-widest text-blue-600 font-bold mb-2">
                    Delivering to:
                  </p>
                  <p className="text-xs text-gray-700 font-semibold leading-relaxed">
                    {shippingAddress.fullName}
                    <br />
                    {shippingAddress.addressLine1}
                    {shippingAddress.addressLine2 && `, ${shippingAddress.addressLine2}`}
                    <br />
                    {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
                    <br />
                    <span className="text-gray-600">Phone:</span> {shippingAddress.phone}
                  </p>
                </motion.div>
              )}

              {/* Payment Button */}
              <button
                onClick={shippingAddress ? handlePayment : triggerAddressFormSubmit}
                disabled={isProcessing}
                className={`group relative w-full flex justify-center items-center py-3 sm:py-4 px-4 
                text-sm font-bold uppercase tracking-wide rounded-lg
                transition-all duration-300 overflow-hidden
                ${
                  isProcessing
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed border-2 border-gray-300"
                    : "bg-blue-600 text-white hover:bg-blue-700 border-2 border-blue-600 hover:border-blue-700 shadow-lg hover:shadow-xl"
                }`}
              >
                <span className="relative z-10">
                  {isProcessing
                    ? "Processing..."
                    : shippingAddress
                    ? `Pay ₹${finalTotal.toFixed(2)}`
                    : "Save Address & Continue"}
                </span>
              </button>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t-2 border-blue-100 flex items-center justify-center gap-2">
                <Lock className="h-3 w-3 text-blue-600" strokeWidth={2} />
                <p className="text-xs text-blue-600 font-bold uppercase tracking-widest">
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
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2563eb;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #1d4ed8;
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;
