"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const defaultImage = "https://res.cloudinary.com/dqwdvpi4d/image/upload/v1691639790/default-product-image-removebg-preview_p3g0jy.png";
const productSchema = new mongoose_1.default.Schema({
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
            type: mongoose_1.default.Schema.ObjectId,
            required: true,
            ref: "Color",
        },
    ],
    tags: String,
    ratings: [
        {
            star: Number,
            comment: String,
            postedby: { type: mongoose_1.default.Types.ObjectId, ref: "User" },
        },
    ],
    totalrating: {
        type: String,
        default: 0,
    },
}, { timestamps: true });
productSchema.pre("save", async function (next) {
    if (this.isModified("images") && this.images.length > 0) {
        this.thumbnail = this.images[0].url;
    }
    next();
});
productSchema.post("save", async function (doc) {
    if (this.isModified("images") && this.images.length > 0) {
        await this.updateOne({ thumbnail: this.images[0].url });
    }
});
exports.default = mongoose_1.default.model("Product", productSchema);
//# sourceMappingURL=productModel.js.map