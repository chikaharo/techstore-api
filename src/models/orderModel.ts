import mongoose from "mongoose"; // Erase if already required

// Declare the Schema of the Mongo model
const orderSchema = new mongoose.Schema(
	{
		// orderID: String,
		products: [
			{
				product: {
					type: mongoose.Types.ObjectId,
					ref: "Product",
				},
				quantity: Number,
				color: {
					type: mongoose.Types.ObjectId,
					ref: "Color",
				},
				feature: String,
			},
		],
		paymentIntent: {},
		orderStatus: {
			type: String,
			default: "Not Processed",
			enum: [
				"Not Processed",
				"Processing",
				"Delivering",
				"Cancelled",
				"Delivered",
			],
		},
		orderby: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: true,
		},
		name: { type: String, required: true },
		phone: { type: String, required: true },
		address: { type: String, required: true },
		total: { type: Number, required: true },
		totalAfterDiscount: { type: Number, required: true },
		totalQuantity: { type: Number, required: true },
	},
	{
		timestamps: true,
	}
);

//Export the model
export default mongoose.model("Order", orderSchema);
