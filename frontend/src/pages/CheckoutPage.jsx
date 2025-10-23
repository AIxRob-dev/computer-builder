import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import ShippingAddressForm from "../components/ShippingAddressForm";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, total, subtotal, coupon, clearCart } = useCartStore();
  const [shippingAddress, setShippingAddress] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
        shippingAddress: shippingAddress, // Send address to backend
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
            // Verify payment on backend
            const verifyRes = await axios.post("/payments/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              clearCart();
              toast.success("Payment successful! Check your email for confirmation.");
              navigate("/purchase-success");
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            toast.error("Payment verification failed. Please contact support.");
            navigate("/purchase-cancel");
          }
        },
        prefill: {
          name: shippingAddress.fullName,
          contact: shippingAddress.phone,
        },
        theme: {
          color: "#10b981",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast.error("Payment cancelled");
            navigate("/purchase-cancel");
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      setIsProcessing(false);
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
    <div className="min-h-screen py-8 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        {/* Back Button */}
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Cart</span>
        </button>

        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Shipping Address Form */}
          <div className="lg:col-span-2">
            <ShippingAddressForm
              onAddressSubmit={handleAddressSubmit}
              initialAddress={shippingAddress}
            />
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              className="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-sm sticky top-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <ShoppingBag className="text-emerald-400" size={24} />
                <h2 className="text-xl font-semibold text-white">Order Summary</h2>
              </div>

              {/* Products List */}
              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item._id} className="flex items-center gap-3 pb-3 border-b border-gray-700">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm text-emerald-400 font-semibold">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pt-4 border-t border-gray-700">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Savings</span>
                    <span>-₹{savings.toFixed(2)}</span>
                  </div>
                )}

                {coupon && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Coupon ({coupon.code})</span>
                    <span>-{coupon.discountPercentage}%</span>
                  </div>
                )}

                <div className="flex justify-between text-lg font-bold text-white pt-3 border-t border-gray-600">
                  <span>Total</span>
                  <span className="text-emerald-400">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Address Preview */}
              {shippingAddress && (
                <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                  <p className="text-sm font-semibold text-white mb-2">Delivering to:</p>
                  <p className="text-xs text-gray-300">
                    {shippingAddress.fullName}
                    <br />
                    {shippingAddress.addressLine1}
                    {shippingAddress.addressLine2 && `, ${shippingAddress.addressLine2}`}
                    <br />
                    {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
                    <br />
                    Phone: {shippingAddress.phone}
                  </p>
                </div>
              )}

              {/* Payment Button */}
              <button
                onClick={shippingAddress ? handlePayment : triggerAddressFormSubmit}
                disabled={isProcessing}
                className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                  isProcessing
                    ? "bg-gray-600 cursor-not-allowed"
                    : shippingAddress
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isProcessing
                  ? "Processing..."
                  : shippingAddress
                  ? `Pay ₹${total.toFixed(2)}`
                  : "Save Address & Continue"}
              </button>

              <p className="text-xs text-gray-400 text-center mt-4">
                Your payment is secured by Razorpay
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;