import Category from "../models/categoryModel";
import { validateMongoDbId } from "../helpers/validateMongoId";
import { NextFunction, Request, Response } from "express";
import slugify from "slugify";
import { AppError } from "../helpers/AppError";

export const createCategory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (req.body.title) {
			req.body.slug = slugify(req.body.title);
		}
		const newCategory = await Category.create(req.body);
		return res.json({
			status: "success",
			message: "Create new category successfully",
			data: newCategory,
		});
	} catch (error) {
		console.error("CATEGORY ERROR: ", error);
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};

export const updateCategory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;
	try {
		const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		return res.json({
			status: "success",
			message: "Update category successfully",
			data: updatedCategory,
		});
	} catch (error) {
		console.error("CATEGORY ERROR: ", error);
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};

export const deleteCategory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;
	validateMongoDbId(id);
	try {
		const deletedCategory = await Category.findByIdAndDelete(id);
		return res.json({
			status: "success",
			message: "Delete category successfully",
			data: deletedCategory,
		});
	} catch (error) {
		console.error("CATEGORY ERROR: ", error);
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};

export const getCategory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;
	try {
		const category = await Category.findById(id);
		return res.json({
			status: "success",
			message: "Get category successfully",
			data: category,
		});
	} catch (error) {
		console.error("CATEGORY ERROR: ", error);
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};

export const getallCategory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const categories = await Category.find();
		return res.json({
			status: "success",
			message: "Get all categories successfully",
			data: categories,
		});
	} catch (error) {
		console.error("CATEGORY ERROR: ", error);
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};
