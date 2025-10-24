import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useState } from "react";

const ShippingAddressForm = ({ onAddressSubmit, initialAddress = null }) => {
  const [address, setAddress] = useState(
    initialAddress || {
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    }
  );

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!address.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!address.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(address.phone)) {
      newErrors.phone = "Please enter a valid 10-digit Indian phone number";
    }

    if (!address.addressLine1.trim()) {
      newErrors.addressLine1 = "Address is required";
    }

    if (!address.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!address.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!address.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(address.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onAddressSubmit(address);
    }
  };

  return (
    <motion.div
      className="bg-zinc-950 border border-zinc-800/50 p-6 sm:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center mb-8">
        <MapPin className="h-4 w-4 text-zinc-500 mr-2" strokeWidth={1.5} />
        <h2 className="text-lg uppercase tracking-widest text-zinc-500 font-light">
          Shipping Address
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-xs uppercase tracking-widest text-zinc-500 font-light mb-2">
            Full Name <span className="text-white">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={address.fullName}
            onChange={handleChange}
            className={`block w-full px-4 py-3 bg-black/50 border ${
              errors.fullName ? "border-red-500/50" : "border-zinc-800"
            } text-white placeholder-zinc-600 
            focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700
            transition-all duration-300 font-light`}
            placeholder="Enter your full name"
          />
          {errors.fullName && (
            <p className="mt-2 text-xs text-red-400 font-light">{errors.fullName}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone" className="block text-xs uppercase tracking-widest text-zinc-500 font-light mb-2">
            Phone Number <span className="text-white">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={address.phone}
            onChange={handleChange}
            className={`block w-full px-4 py-3 bg-black/50 border ${
              errors.phone ? "border-red-500/50" : "border-zinc-800"
            } text-white placeholder-zinc-600 
            focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700
            transition-all duration-300 font-light`}
            placeholder="10-digit mobile number"
            maxLength="10"
          />
          {errors.phone && (
            <p className="mt-2 text-xs text-red-400 font-light">{errors.phone}</p>
          )}
        </div>

        {/* Address Line 1 */}
        <div>
          <label htmlFor="addressLine1" className="block text-xs uppercase tracking-widest text-zinc-500 font-light mb-2">
            Address Line 1 <span className="text-white">*</span>
          </label>
          <input
            type="text"
            id="addressLine1"
            name="addressLine1"
            value={address.addressLine1}
            onChange={handleChange}
            className={`block w-full px-4 py-3 bg-black/50 border ${
              errors.addressLine1 ? "border-red-500/50" : "border-zinc-800"
            } text-white placeholder-zinc-600 
            focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700
            transition-all duration-300 font-light`}
            placeholder="House/Flat No., Building Name"
          />
          {errors.addressLine1 && (
            <p className="mt-2 text-xs text-red-400 font-light">{errors.addressLine1}</p>
          )}
        </div>

        {/* Address Line 2 (Optional) */}
        <div>
          <label htmlFor="addressLine2" className="block text-xs uppercase tracking-widest text-zinc-500 font-light mb-2">
            Address Line 2 <span className="text-zinc-600 text-[10px]">(Optional)</span>
          </label>
          <input
            type="text"
            id="addressLine2"
            name="addressLine2"
            value={address.addressLine2}
            onChange={handleChange}
            className="block w-full px-4 py-3 bg-black/50 border border-zinc-800 
            text-white placeholder-zinc-600 
            focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700
            transition-all duration-300 font-light"
            placeholder="Street, Landmark"
          />
        </div>

        {/* City and State in same row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label htmlFor="city" className="block text-xs uppercase tracking-widest text-zinc-500 font-light mb-2">
              City <span className="text-white">*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={address.city}
              onChange={handleChange}
              className={`block w-full px-4 py-3 bg-black/50 border ${
                errors.city ? "border-red-500/50" : "border-zinc-800"
              } text-white placeholder-zinc-600 
              focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700
              transition-all duration-300 font-light`}
              placeholder="Enter city"
            />
            {errors.city && (
              <p className="mt-2 text-xs text-red-400 font-light">{errors.city}</p>
            )}
          </div>

          <div>
            <label htmlFor="state" className="block text-xs uppercase tracking-widest text-zinc-500 font-light mb-2">
              State <span className="text-white">*</span>
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={address.state}
              onChange={handleChange}
              className={`block w-full px-4 py-3 bg-black/50 border ${
                errors.state ? "border-red-500/50" : "border-zinc-800"
              } text-white placeholder-zinc-600 
              focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700
              transition-all duration-300 font-light`}
              placeholder="Enter state"
            />
            {errors.state && (
              <p className="mt-2 text-xs text-red-400 font-light">{errors.state}</p>
            )}
          </div>
        </div>

        {/* Pincode and Country in same row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label htmlFor="pincode" className="block text-xs uppercase tracking-widest text-zinc-500 font-light mb-2">
              Pincode <span className="text-white">*</span>
            </label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={address.pincode}
              onChange={handleChange}
              className={`block w-full px-4 py-3 bg-black/50 border ${
                errors.pincode ? "border-red-500/50" : "border-zinc-800"
              } text-white placeholder-zinc-600 
              focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700
              transition-all duration-300 font-light`}
              placeholder="6-digit pincode"
              maxLength="6"
            />
            {errors.pincode && (
              <p className="mt-2 text-xs text-red-400 font-light">{errors.pincode}</p>
            )}
          </div>

          <div>
            <label htmlFor="country" className="block text-xs uppercase tracking-widest text-zinc-500 font-light mb-2">
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={address.country}
              readOnly
              className="block w-full px-4 py-3 bg-black/30 border border-zinc-800 
              text-zinc-500 cursor-not-allowed font-light"
            />
          </div>
        </div>

        {/* Hidden submit button - will be triggered by parent */}
        <button type="submit" id="address-form-submit" className="hidden">
          Submit
        </button>
      </form>

      {/* Info Footer */}
      <div className="mt-8 pt-6 border-t border-zinc-800/50">
        <p className="text-center text-xs text-zinc-600 font-light uppercase tracking-widest">
          Secure & Confidential
        </p>
      </div>
    </motion.div>
  );
};

export default ShippingAddressForm;
