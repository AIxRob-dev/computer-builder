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
      className="bg-white border-2 border-blue-100 rounded-xl shadow-lg p-6 sm:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center mb-8">
        <MapPin className="h-4 w-4 text-blue-600 mr-2" strokeWidth={2} />
        <h2 className="text-lg uppercase tracking-widest text-blue-600 font-bold">
          Shipping Address
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-xs uppercase tracking-widest text-gray-600 font-semibold mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={address.fullName}
            onChange={handleChange}
            className={`block w-full px-4 py-3 bg-gray-50 border-2 rounded-lg ${
              errors.fullName ? "border-red-500" : "border-gray-200"
            } text-gray-900 placeholder-gray-400 font-medium
            focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20
            transition-all duration-300`}
            placeholder="Enter your full name"
          />
          {errors.fullName && (
            <p className="mt-2 text-xs text-red-500 font-semibold">{errors.fullName}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone" className="block text-xs uppercase tracking-widest text-gray-600 font-semibold mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={address.phone}
            onChange={handleChange}
            className={`block w-full px-4 py-3 bg-gray-50 border-2 rounded-lg ${
              errors.phone ? "border-red-500" : "border-gray-200"
            } text-gray-900 placeholder-gray-400 font-medium
            focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20
            transition-all duration-300`}
            placeholder="10-digit mobile number"
            maxLength="10"
          />
          {errors.phone && (
            <p className="mt-2 text-xs text-red-500 font-semibold">{errors.phone}</p>
          )}
        </div>

        {/* Address Line 1 */}
        <div>
          <label htmlFor="addressLine1" className="block text-xs uppercase tracking-widest text-gray-600 font-semibold mb-2">
            Address Line 1 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="addressLine1"
            name="addressLine1"
            value={address.addressLine1}
            onChange={handleChange}
            className={`block w-full px-4 py-3 bg-gray-50 border-2 rounded-lg ${
              errors.addressLine1 ? "border-red-500" : "border-gray-200"
            } text-gray-900 placeholder-gray-400 font-medium
            focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20
            transition-all duration-300`}
            placeholder="House/Flat No., Building Name"
          />
          {errors.addressLine1 && (
            <p className="mt-2 text-xs text-red-500 font-semibold">{errors.addressLine1}</p>
          )}
        </div>

        {/* Address Line 2 (Optional) */}
        <div>
          <label htmlFor="addressLine2" className="block text-xs uppercase tracking-widest text-gray-600 font-semibold mb-2">
            Address Line 2 <span className="text-gray-400 text-[10px] font-semibold">(Optional)</span>
          </label>
          <input
            type="text"
            id="addressLine2"
            name="addressLine2"
            value={address.addressLine2}
            onChange={handleChange}
            className="block w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg
            text-gray-900 placeholder-gray-400 font-medium
            focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20
            transition-all duration-300"
            placeholder="Street, Landmark"
          />
        </div>

        {/* City and State in same row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label htmlFor="city" className="block text-xs uppercase tracking-widest text-gray-600 font-semibold mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={address.city}
              onChange={handleChange}
              className={`block w-full px-4 py-3 bg-gray-50 border-2 rounded-lg ${
                errors.city ? "border-red-500" : "border-gray-200"
              } text-gray-900 placeholder-gray-400 font-medium
              focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20
              transition-all duration-300`}
              placeholder="Enter city"
            />
            {errors.city && (
              <p className="mt-2 text-xs text-red-500 font-semibold">{errors.city}</p>
            )}
          </div>

          <div>
            <label htmlFor="state" className="block text-xs uppercase tracking-widest text-gray-600 font-semibold mb-2">
              State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={address.state}
              onChange={handleChange}
              className={`block w-full px-4 py-3 bg-gray-50 border-2 rounded-lg ${
                errors.state ? "border-red-500" : "border-gray-200"
              } text-gray-900 placeholder-gray-400 font-medium
              focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20
              transition-all duration-300`}
              placeholder="Enter state"
            />
            {errors.state && (
              <p className="mt-2 text-xs text-red-500 font-semibold">{errors.state}</p>
            )}
          </div>
        </div>

        {/* Pincode and Country in same row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label htmlFor="pincode" className="block text-xs uppercase tracking-widest text-gray-600 font-semibold mb-2">
              Pincode <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={address.pincode}
              onChange={handleChange}
              className={`block w-full px-4 py-3 bg-gray-50 border-2 rounded-lg ${
                errors.pincode ? "border-red-500" : "border-gray-200"
              } text-gray-900 placeholder-gray-400 font-medium
              focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20
              transition-all duration-300`}
              placeholder="6-digit pincode"
              maxLength="6"
            />
            {errors.pincode && (
              <p className="mt-2 text-xs text-red-500 font-semibold">{errors.pincode}</p>
            )}
          </div>

          <div>
            <label htmlFor="country" className="block text-xs uppercase tracking-widest text-gray-600 font-semibold mb-2">
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={address.country}
              readOnly
              className="block w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-lg
              text-gray-500 cursor-not-allowed font-medium"
            />
          </div>
        </div>

        {/* Hidden submit button - will be triggered by parent */}
        <button type="submit" id="address-form-submit" className="hidden">
          Submit
        </button>
      </form>

      {/* Info Footer */}
      <div className="mt-8 pt-6 border-t-2 border-blue-100">
        <p className="text-center text-xs text-blue-600 font-bold uppercase tracking-widest">
          Secure & Confidential
        </p>
      </div>
    </motion.div>
  );
};

export default ShippingAddressForm;