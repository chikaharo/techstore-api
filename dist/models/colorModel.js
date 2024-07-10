"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const colorSchema = new mongoose_1.default.Schema({
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
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Color", colorSchema);
//# sourceMappingURL=colorModel.js.map