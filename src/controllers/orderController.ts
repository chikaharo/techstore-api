import { NextFunction, Request, Response } from "express";

import { validateMongoDbId } from "../helpers/validateMongoId";
import Order from "../models/orderModel";
import User from "../models/userModel";
import { AppError } from "../helpers/AppError";
import Product from "../models/productModel";

export const createOrder = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { _id } = req.user;

	try {
		const user = await User.findById(_id)
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
			return next(new AppError("Cart is Empty", 404, "Empty", true));
		}

		const total = user.cart.reduce((acc: number, cur: any) => {
			return (acc += cur.product.price * cur.quantity);
		}, 0);

		const totalAfterDiscount = total;

		const totalQuantity = user.cart.reduce((acc: number, cur: any) => {
			return (acc += cur.quantity);
		}, 0);

		const data = {
			...req.body,
			orderby: _id,
			products: user.cart,
			total,
			totalAfterDiscount,
			totalQuantity,
		};

		const newOrder = await Order.create(data);
		// for (const c of user.cart) {
		// 	console.log('user cart item: ', c)
		// 	await Product.findByIdAndUpdate(c.product._id, {
		// 		$inc: {
		// 			quantity: -c.quantity,
		// 		},
		// 	});
		// }
		user.cart = [];
		user.orders.push(newOrder);
		await user.save();
		return res.json({
			status: "success",
			message: "Create new order successfully",
			data: newOrder,
		});
	} catch (error) {
		console.log("[Create Order Error]:", error);
		return next(new AppError(error, 500, "Server Error", true));
	}
};

export const updateOrder = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;
	try {
		const updatedOrder = await Order.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		return res.json({
			status: "success",
			message: "Update order successfully",
			data: updatedOrder,
		});
	} catch (error) {
		console.log("[UPDATE_ORDER_ERROR]:", error);
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};

export const cancelOrder = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { _id } = req.user;
	const { id } = req.params;

	try {
		const updatedOrder = await Order.findOne({
			_id: id,
			orderby: _id,
		});

		console.log({ updatedOrder });
		if (!updatedOrder) {
			return next(new AppError("Order Not Found", 404, "Not Found", true));
		}

		updatedOrder.orderStatus = "Cancelled";
		await updatedOrder.save();
		// for (const c of updatedOrder.products) {
		// 	await Product.findByIdAndUpdate(c.product.toString(), {
		// 		$inc: {
		// 			quantity: -c.quantity,
		// 		},
		// 	});
		// }
		return res.json({
			status: "success",
			message: "Cancel order successfully",
			data: updatedOrder,
		});
	} catch (error) {
		console.log("[CANCELLED_ORDER_ERROR]:", error);
		return next(new AppError(error, 500, "Server Error", true));
	}
};

export const deleteOrder = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;
	try {
		const deletedOrder = await Order.findByIdAndDelete(id);
		return res.json({
			status: "Delete order successfully",
			data: deletedOrder,
		});
	} catch (error) {
		console.log("[DELETE_ORDER_ERROR]:", error);

		return next(new AppError(error.message, 500, "Server Error", true));
	}
};

export const getOrder = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;
	try {
		const order = await Order.findById(id);
		return res.json({
			status: "success",
			message: "Get order successfully",
			data: order,
		});
	} catch (error) {
		console.error("[GET ORDER ERROR]", error);
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};

export const getAllOrders = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const orders = await Order.find();
		return res.json({
			status: "success",
			message: "Get all order successfully",
			data: orders,
		});
	} catch (error) {
		console.error("[GET ALL ORDERS ERROR]", error);
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};

export const userGetOrders = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { _id } = req.user;
		const orderQuery = req.query.status as string;
		const user = await User.findById(_id);
		let userOrders = await Order.find({ _id: { $in: user.orders } })
			.populate({
				path: "products.product",
				model: "Product",
			})
			.populate({
				path: "products.color",
				model: "Color",
			});

		if (orderQuery !== "All") {
			userOrders = userOrders.filter(
				(order) => order.orderStatus === orderQuery
			);
		}
		userOrders.sort((a, b) => b.createdAt - a.createdAt);

		return res.json({
			status: "success",
			message: "Get orders by user successfully",
			data: userOrders,
		});
	} catch (error) {
		console.log("[serGetOrder_ERROR] ", error);
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};
