import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			min: 0,
			required: true,
		},
		image: {
			type: String,
			required: [true, "Image is required"],
		},
		additionalImages: {
			type: [String],
			default: [],
			validate: {
				validator: function(arr) {
					return arr.length <= 3;
				},
				message: "You can add maximum 3 additional images"
			}
		},
		// UPDATED: category is now an array to support multiple categories
		category: {
			type: [String],
			required: true,
			validate: {
				validator: function(arr) {
					return arr.length > 0;
				},
				message: "At least one category is required"
			}
		},
		isFeatured: {
			type: Boolean,
			default: false,
		},
		isBestSeller: {
			type: Boolean,
			default: false,
		},
		inStock: {
			type: Boolean,
			default: true,
		},
		// PC Configurations/Specifications
		configurations: {
			processor: { type: String, default: "" },
			motherboard: { type: String, default: "" },
			ram: { type: String, default: "" },
			storage: { type: String, default: "" },
			graphicsCard: { type: String, default: "" },
			powerSupply: { type: String, default: "" },
			caseType: { type: String, default: "" },
			cooling: { type: String, default: "" },
			operatingSystem: { type: String, default: "" },
			additionalSpecs: { type: String, default: "" }
		},
	},
	{ timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;