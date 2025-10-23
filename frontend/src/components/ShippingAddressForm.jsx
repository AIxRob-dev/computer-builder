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
      className="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="text-emerald-400" size={24} />
        <h2 className="text-xl font-semibold text-white">Shipping Address</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={address.fullName}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-gray-700 border ${
              errors.fullName ? "border-red-500" : "border-gray-600"
            } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500`}
            placeholder="Enter your full name"
          />
          {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={address.phone}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-gray-700 border ${
              errors.phone ? "border-red-500" : "border-gray-600"
            } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500`}
            placeholder="10-digit mobile number"
            maxLength="10"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
        </div>

        {/* Address Line 1 */}
        <div>
          <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-300 mb-2">
            Address Line 1 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="addressLine1"
            name="addressLine1"
            value={address.addressLine1}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-gray-700 border ${
              errors.addressLine1 ? "border-red-500" : "border-gray-600"
            } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500`}
            placeholder="House/Flat No., Building Name"
          />
          {errors.addressLine1 && <p className="mt-1 text-sm text-red-500">{errors.addressLine1}</p>}
        </div>

        {/* Address Line 2 (Optional) */}
        <div>
          <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-300 mb-2">
            Address Line 2 <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
          <input
            type="text"
            id="addressLine2"
            name="addressLine2"
            value={address.addressLine2}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Street, Landmark"
          />
        </div>

        {/* City and State in same row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={address.city}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-gray-700 border ${
                errors.city ? "border-red-500" : "border-gray-600"
              } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500`}
              placeholder="Enter city"
            />
            {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-2">
              State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={address.state}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-gray-700 border ${
                errors.state ? "border-red-500" : "border-gray-600"
              } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500`}
              placeholder="Enter state"
            />
            {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
          </div>
        </div>

        {/* Pincode and Country in same row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pincode" className="block text-sm font-medium text-gray-300 mb-2">
              Pincode <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={address.pincode}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-gray-700 border ${
                errors.pincode ? "border-red-500" : "border-gray-600"
              } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500`}
              placeholder="6-digit pincode"
              maxLength="6"
            />
            {errors.pincode && <p className="mt-1 text-sm text-red-500">{errors.pincode}</p>}
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-2">
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={address.country}
              readOnly
              className="w-full px-3 py-2 bg-gray-600 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Hidden submit button - will be triggered by parent */}
        <button type="submit" id="address-form-submit" className="hidden">
          Submit
        </button>
      </form>
    </motion.div>
  );
};

export default ShippingAddressForm;