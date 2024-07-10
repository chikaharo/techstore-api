import MongoStore from "connect-mongo";
import mongoose from "mongoose"; // Erase if already required

const defaultImage =
	"https://res.cloudinary.com/dqwdvpi4d/image/upload/v1691639790/default-product-image-removebg-preview_p3g0jy.png";
// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		brand: {
			type: String,
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
		},
		sold: {
			type: Number,
			default: 0,
		},
		thumbnail: {
			type: String,
			default: defaultImage,
		},
		images: [
			{
				public_id: String,
				url: String,
				asset_id: String,
			},
		],
		colors: [
			{
				type: mongoose.Schema.ObjectId,
				required: true,
				ref: "Color",
			},
		],
		tags: String,
		ratings: [
			{
				star: Number,
				comment: String,
				postedby: { type: mongoose.Types.ObjectId, ref: "User" },
			},
		],
		totalrating: {
			type: String,
			default: 0,
		},
	},
	{ timestamps: true }
);

productSchema.pre("save", async function (next) {
	if (this.isModified("images") && this.images.length > 0) {
		// @ts-ignore
		this.thumbnail = this.images[0].url;
	}
	next();
});

productSchema.post("save", async function (doc) {
	if (this.isModified("images") && this.images.length > 0) {
		await this.updateOne({ thumbnail: this.images[0].url });
	}
});

//Export the model
export default mongoose.model("Product", productSchema);
