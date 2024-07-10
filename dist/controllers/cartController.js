"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCart = exports.removeFromCart = exports.addToCart = exports.getCart = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const productModel_1 = __importDefault(require("../models/productModel"));
const AppError_1 = require("../helpers/AppError");
const getCart = async (req, res, next) => {
    const { _id } = req.user;
    try {
        const user = await userModel_1.default.findById(_id)
            .populate({
            path: "cart.product",
            model: "Product",
            select: "title thumbnail price quantity slug",
        })
            .populate({
            path: "cart.color",
            model: "Color",
        });
        return res.json({
            status: "success",
            message: "Get cart successfully",
            data: user.cart,
        });
    }
    catch (error) {
        console.log("[GETCART_ERROR]:", error);
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.getCart = getCart;
const addToCart = async (req, res, next) => {
    const { _id } = req.user;
    const { prodId, colorId } = req.body;
    try {
        const product = await productModel_1.default.findById(prodId);
        if (product.quantity < 1) {
            return next(new AppError_1.AppError("Can't add more this product", 400, "Not Allowed", true));
        }
        const user = await userModel_1.default.findById(_id);
        const existingProdInCart = user.cart.find((item) => item.product.toString() === prodId && item.color.toString() === colorId);
        if (existingProdInCart) {
            existingProdInCart.quantity++;
            await user.save();
        }
        else {
            user.cart.push({
                product: prodId,
                color: colorId,
                quantity: 1,
            });
            await user.save();
        }
        return res.json({ status: "success", message: "Add to Cart Successfully" });
    }
    catch (error) {
        console.log("[addToCart_ERROR]:", error);
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.addToCart = addToCart;
const removeFromCart = async (req, res, next) => {
    const { _id } = req.user;
    const { prodId, colorId } = req.body;
    try {
        const user = await userModel_1.default.findById(_id);
        const updatedCartIdx = user.cart.findIndex((item) => item.product.toString() === prodId && item.color.toString() === colorId);
        if (updatedCartIdx === -1) {
            return next(new AppError_1.AppError("Remove cart failed", 400, "Not Found", true));
        }
        else {
            const updatedCart = user.cart[updatedCartIdx];
            updatedCart.quantity -= 1;
            if (updatedCart.quantity <= 0) {
                user.cart.splice(updatedCartIdx, 1);
            }
            else {
                user.cart[updatedCartIdx] = updatedCart;
            }
            await user.save();
        }
        return res.json({
            status: "success",
            message: "removeFromCart successfully",
        });
    }
    catch (error) {
        console.log("[addToCart_ERROR]:", error);
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.removeFromCart = removeFromCart;
const deleteFromCart = async (req, res, next) => {
    const { _id } = req.user;
    const { prodId, colorId } = req.body;
    try {
        const user = await userModel_1.default.findById(_id);
        const updatedCartIdx = user.cart.findIndex((item) => item.product.toString() === prodId && item.color.toString() === colorId);
        if (updatedCartIdx === -1) {
            return next(new AppError_1.AppError("Product not in cart", 400, "Not Found", true));
        }
        else {
            user.cart.splice(updatedCartIdx, 1);
            await user.save();
        }
        return res.json(user);
    }
    catch (error) {
        console.log("[addToCart_ERROR]:", error);
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.deleteFromCart = deleteFromCart;
//# sourceMappingURL=cartController.js.map