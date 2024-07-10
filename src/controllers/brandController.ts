import { NextFunction, Request, Response } from "express";
import Brand from "../models/brandModel";
import { validateMongoDbId } from "../helpers/validateMongoId";
import { AppError } from "../helpers/AppError";

export const createBrand = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const newBrand = await Brand.create(req.body);
		return res.json({
			status: "success",
			message: "Create new brand successfully",
			data: newBrand,
		});
	} catch (error) {
		console.log("[Create Brand Error]:", error);
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};

export const updateBrand = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;
	validateMongoDbId(id);
	try {
		const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		return res.json({
			status: "success",
			message: "Update brand successfully",
			data: updatedBrand,
		});
	} catch (error) {
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};

export const deleteBrand = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;
	try {
		const deletedBrand = await Brand.findByIdAndDelete(id);
		return res.json({
			status: "success",
			message: "Delete brand successfully",
			data: deletedBrand,
		});
	} catch (error) {
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};

export const getBrand = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;
	console.log("get Brand id:", id);
	// validateMongoDbId(id);
	try {
		const brand = await Brand.findById(id);
		return res.json({
			status: "success",
			message: "Get brand successfully",
			data: brand,
		});
	} catch (error) {
		console.error("[GET BRAND ERROR]", error);
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};

export const getallBrand = async (
	_req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const brands = await Brand.find();
		return res.json({
			status: "success",
			message: "Get all brand successfully",
			data: brands,
		});
	} catch (error) {
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};
