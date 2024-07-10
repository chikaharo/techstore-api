import mongoose from "mongoose"; // Erase if already required
import bcrypt from "bcrypt";
import crypto from "node:crypto";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		dateOfBirth: {
			type: Date,
		},
		role: {
			type: String,
			default: "user",
		},
		isBlocked: {
			type: Boolean,
			default: false,
		},
		cart: [
			{
				type: {
					product: {
						type: mongoose.Types.ObjectId,
						ref: "Product",
					},
					color: {
						type: mongoose.Types.ObjectId,
						ref: "Color",
					},
					quantity: Number,
				},
			},
		],
		address: {
			type: String,
		},
		otp: {
			type: String,
			default: "",
		},
		wishlist: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
		orders: [{ type: mongoose.Types.ObjectId, ref: "Order" }],
		refreshToken: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

// userSchema.plugin(PassportLocalMongoose);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}
	const salt = await bcrypt.genSaltSync(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

userSchema.methods.isPasswordMatched = async function (
	enteredPassword: string
) {
	return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.createPasswordResetToken = async function () {
	const resettoken = crypto.randomBytes(32).toString("hex");
	this.passwordResetToken = crypto
		.createHash("sha256")
		.update(resettoken)
		.digest("hex");
	this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 minutes
	return resettoken;
};

//Export the model
// module.exports = mongoose.model("User", userSchema);
export default mongoose.model("User", userSchema);
