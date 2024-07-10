"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    products: [
        {
            product: {
                type: mongoose_1.default.Types.ObjectId,
                ref: "Product",
            },
            quantity: Number,
            color: {
                type: mongoose_1.default.Types.ObjectId,
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
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: String,
    phone: String,
    address: String,
    total: Number,
    totalAfterDiscount: Number,
    totalQuantity: Number,
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Order", orderSchema);
//# sourceMappingURL=orderModel.js.map