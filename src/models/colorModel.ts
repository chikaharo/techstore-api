import mongoose from "mongoose"; // Erase if already required

// Declare the Schema of the Mongo model
const colorSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		value: {
			type: String,
			required: true,
			default: "#000000",
		},
	},
	{
		timestamps: true,
	}
);

//Export the model
export default mongoose.model("Color", colorSchema);
