import mongoose from "mongoose"; // Erase if already required

// Declare the Schema of the Mongo model
const Category = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
	},
	{
		timestamps: true,
	}
);

//Export the model
export default mongoose.model("Category", Category);
