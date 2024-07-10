import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import Product from "../models/productModel";
import Color from "../models/colorModel";
import { validateMongoDbId } from "../helpers/validateMongoId";
import { AppError } from "../helpers/AppError";

export const getCart = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { _id } = req.userData;
	try {
		const user = await User.findById(_id)
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
	} catch (error) {
		console.log("[GETCART_ERROR]:", error);
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};

export const addToCart = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { _id } = req.userData;
	const { prodId, colorId } = req.body;

	try {
		const product = await Product.findById(prodId);
		if (product.quantity < 1) {
			return next(
				new AppError("Can't add more this product", 400, "Not Allowed", true)
			);
		}
		const user = await User.findById(_id);
		const existingProdInCart = user.cart.find(
			// @ts-ignore
			(item) =>
				item.product.toString() === prodId && item.color.toString() === colorId
		);
		if (existingProdInCart) {
			existingProdInCart.quantity++;
			await user.save();
		} else {
			user.cart.push({
				product: prodId,
				color: colorId,
				quantity: 1,
			});
			await user.save();
		}
		return res.json({ status: "success", message: "Add to Cart Successfully" });
	} catch (error) {
		console.log("[addToCart_ERROR]:", error);
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};

export const removeFromCart = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { _id } = req.userData;
	const { prodId, colorId } = req.body;
	try {
		const user = await User.findById(_id);
		const updatedCartIdx = user.cart.findIndex(
			// @ts-ignore
			(item) =>
				item.product.toString() === prodId && item.color.toString() === colorId
		);
		if (updatedCartIdx === -1) {
			return next(new AppError("Remove cart failed", 400, "Not Found", true));
		} else {
			const updatedCart = user.cart[updatedCartIdx];
			updatedCart.quantity -= 1;
			if (updatedCart.quantity <= 0) {
				user.cart.splice(updatedCartIdx, 1);
			} else {
				user.cart[updatedCartIdx] = updatedCart;
			}
			await user.save();
		}
		return res.json({
			status: "success",
			message: "removeFromCart successfully",
		});
	} catch (error) {
		console.log("[addToCart_ERROR]:", error);
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};

export const deleteFromCart = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { _id } = req.userData;
	const { prodId, colorId } = req.body;
	try {
		const user = await User.findById(_id);
		const updatedCartIdx = user.cart.findIndex(
			// @ts-ignore
			(item) =>
				item.product.toString() === prodId && item.color.toString() === colorId
		);
		if (updatedCartIdx === -1) {
			return next(new AppError("Product not in cart", 400, "Not Found", true));
		} else {
			user.cart.splice(updatedCartIdx, 1);
			await user.save();
		}
		return res.json(user);
	} catch (error) {
		console.log("[addToCart_ERROR]:", error);
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};
