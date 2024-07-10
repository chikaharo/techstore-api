import Color from "../models/colorModel";
import { validateMongoDbId } from "../helpers/validateMongoId";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../helpers/AppError";

export const createColor = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const newColor = await Color.create(req.body);
		return res.json({
			status: "success",
			message: "Create new color successfully",
			data: newColor,
		});
	} catch (error) {
		console.error(error);
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};

export const updateColor = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;
	try {
		const updatedColor = await Color.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		return res.json({
			status: "success",
			message: "Update color successfully",
			data: updatedColor,
		});
	} catch (error) {
		console.error(error);
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};

export const deleteColor = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;
	try {
		const deletedColor = await Color.findByIdAndDelete(id);
		return res.json({
			status: "success",
			message: "Delete color successfully",
			data: deletedColor,
		});
	} catch (error) {
		console.error(error);
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};

export const getColor = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;
	try {
		const color = await Color.findById(id);
		return res.json({
			status: "success",
			message: "Get a color successfully",
			data: color,
		});
	} catch (error) {
		console.error(error);
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};

export const getallColor = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const colors = await Color.find();
		return res.json({
			status: "success",
			message: "Get all color successfully",
			data: colors,
		});
	} catch (error) {
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};
