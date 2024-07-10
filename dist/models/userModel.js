"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const userSchema = new mongoose_1.default.Schema({
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
                    type: mongoose_1.default.Types.ObjectId,
                    ref: "Product",
                },
                color: {
                    type: mongoose_1.default.Types.ObjectId,
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
    wishlist: [{ type: mongoose_1.default.Types.ObjectId, ref: "Product" }],
    orders: [{ type: mongoose_1.default.Types.ObjectId, ref: "Order" }],
    refreshToken: {
        type: String,
    },
}, {
    timestamps: true,
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt_1.default.genSaltSync(10);
    this.password = await bcrypt_1.default.hash(this.password, salt);
    next();
});
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt_1.default.compare(enteredPassword, this.password);
};
userSchema.methods.createPasswordResetToken = async function () {
    const resettoken = node_crypto_1.default.randomBytes(32).toString("hex");
    this.passwordResetToken = node_crypto_1.default
        .createHash("sha256")
        .update(resettoken)
        .digest("hex");
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000;
    return resettoken;
};
exports.default = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=userModel.js.map