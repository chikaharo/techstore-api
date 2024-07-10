"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userGetOrders = exports.getAllOrders = exports.getOrder = exports.deleteOrder = exports.cancelOrder = exports.updateOrder = exports.createOrder = void 0;
const orderModel_1 = __importDefault(require("../models/orderModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const AppError_1 = require("../helpers/AppError");
const createOrder = async (req, res, next) => {
    const { _id } = req.user;
    try {
        const user = await userModel_1.default.findById(_id)
            .populate({
            path: "cart.product",
            select: "_id title thumbnail price quantity slug",
            model: "Product",
        })
            .populate({
            path: "cart.color",
            model: "Color",
        });
        if (user.cart.length === 0) {
            return next(new AppError_1.AppError("Cart is Empty", 404, "Empty", true));
        }
        const total = user.cart.reduce((acc, cur) => {
            return (acc += cur.product.price * cur.quantity);
        }, 0);
        const totalAfterDiscount = total;
        const totalQuantity = user.cart.reduce((acc, cur) => {
            return (acc += cur.quantity);
        }, 0);
        const data = Object.assign(Object.assign({}, req.body), { orderby: _id, products: user.cart, total,
            totalAfterDiscount,
            totalQuantity });
        const newOrder = await orderModel_1.default.create(data);
        user.cart = [];
        user.orders.push(newOrder);
        await user.save();
        return res.json({
            status: "success",
            message: "Create new order successfully",
            data: newOrder,
        });
    }
    catch (error) {
        console.log("[Create Order Error]:", error);
        return next(new AppError_1.AppError(error, 500, "Server Error", true));
    }
};
exports.createOrder = createOrder;
const updateOrder = async (req, res, next) => {
    const { id } = req.params;
    try {
        const updatedOrder = await orderModel_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        return res.json({
            status: "success",
            message: "Update order successfully",
            data: updatedOrder,
        });
    }
    catch (error) {
        console.log("[UPDATE_ORDER_ERROR]:", error);
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.updateOrder = updateOrder;
const cancelOrder = async (req, res, next) => {
    const { _id } = req.user;
    const { id } = req.params;
    try {
        const updatedOrder = await orderModel_1.default.findOne({
            _id: id,
            orderby: _id,
        });
        console.log({ updatedOrder });
        if (!updatedOrder) {
            return next(new AppError_1.AppError("Order Not Found", 404, "Not Found", true));
        }
        updatedOrder.orderStatus = "Cancelled";
        await updatedOrder.save();
        return res.json({
            status: "success",
            message: "Cancel order successfully",
            data: updatedOrder,
        });
    }
    catch (error) {
        console.log("[CANCELLED_ORDER_ERROR]:", error);
        return next(new AppError_1.AppError(error, 500, "Server Error", true));
    }
};
exports.cancelOrder = cancelOrder;
const deleteOrder = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedOrder = await orderModel_1.default.findByIdAndDelete(id);
        return res.json({
            status: "Delete order successfully",
            data: deletedOrder,
        });
    }
    catch (error) {
        console.log("[DELETE_ORDER_ERROR]:", error);
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.deleteOrder = deleteOrder;
const getOrder = async (req, res, next) => {
    const { id } = req.params;
    try {
        const order = await orderModel_1.default.findById(id);
        return res.json({
            status: "success",
            message: "Get order successfully",
            data: order,
        });
    }
    catch (error) {
        console.error("[GET ORDER ERROR]", error);
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.getOrder = getOrder;
const getAllOrders = async (req, res, next) => {
    try {
        const orders = await orderModel_1.default.find();
        return res.json({
            status: "success",
            message: "Get all order successfully",
            data: orders,
        });
    }
    catch (error) {
        console.error("[GET ALL ORDERS ERROR]", error);
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.getAllOrders = getAllOrders;
const userGetOrders = async (req, res, next) => {
    try {
        const { _id } = req.user;
        const orderQuery = req.query.status;
        const user = await userModel_1.default.findById(_id);
        let userOrders = await orderModel_1.default.find({ _id: { $in: user.orders } })
            .populate({
            path: "products.product",
            model: "Product",
        })
            .populate({
            path: "products.color",
            model: "Color",
        });
        if (orderQuery !== "All") {
            userOrders = userOrders.filter((order) => order.orderStatus === orderQuery);
        }
        userOrders.sort((a, b) => b.createdAt - a.createdAt);
        return res.json({
            status: "success",
            message: "Get orders by user successfully",
            data: userOrders,
        });
    }
    catch (error) {
        console.log("[serGetOrder_ERROR] ", error);
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.userGetOrders = userGetOrders;
//# sourceMappingURL=orderController.js.map