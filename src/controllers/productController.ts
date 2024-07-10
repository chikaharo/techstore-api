import Product from "../models/productModel";
import User from "../models/userModel";
import slugify from "slugify";
import { NextFunction, Request, Response } from "express";
import { cloudinaryDeleteImg } from "../config/cloudinary";
import { AppError } from "../helpers/AppError";

export const createProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (req.body.title) {
			req.body.slug = slugify(req.body.title);
		}
		const newProduct = await Product.create(req.body);
		return res.json({
			status: "success",
			message: "Create product successfully",
			data: newProduct,
		});
	} catch (error) {
		console.log("[CREATE_PRODUCT_ERROR]:", error);
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};

export const updateProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;
	try {
		if (req.body.title) {
			req.body.slug = slugify(req.body.title);
		}
		const oldProduct = await Product.findById(id);
		const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
			new: true,
		});

		if (
			req.body.images &&
			req.body.images.length > 0 &&
			((oldProduct.images.length > 0 &&
				oldProduct.images[0].url !== req.body.images[0].url) ||
				oldProduct.images.length === 0)
		) {
			for (const img of oldProduct.images) {
				await cloudinaryDeleteImg(img.asset_id);
			}
			updatedProduct.thumbnail = req.body.images[0].url;
			await updatedProduct.save();
		} else if (req.body.images && req.body.images.length === 0) {
			updatedProduct.thumbnail =
				"https://res.cloudinary.com/dqwdvpi4d/image/upload/v1691639790/default-product-image-removebg-preview_p3g0jy.png";
			await updatedProduct.save();
		}

		return res.json({
			status: "success",
			message: "Update product successfully",
			data: updatedProduct,
		});
	} catch (error) {
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};

export const deleteProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;
	try {
		const deletedProduct = await Product.findByIdAndDelete(id);
		return res.json({
			status: "success",
			message: "Deleted product successfully",
			data: deletedProduct,
		});
	} catch (error) {
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};

export const getaProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;
	try {
		const product = await Product.findById(id).populate(["colors"]);
		return res.json({
			status: "success",
			message: "Get Product successfully",
			data: product,
		});
	} catch (error) {
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};
export const getProductBySlug = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { slug } = req.params;
	console.log(slug);
	try {
		const product = await Product.findOne({ slug: slug }).populate(["colors"]);
		return res.json({
			status: "success",
			message: "Get Product successfully",
			data: product,
		});
	} catch (error) {
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};

export const getSimilarProducts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.query;
		const product = await Product.findById(id);
		if (!product) {
			return res.json({ status: "success", data: { products: [] } });
		}
		const similarProducts = await Product.find({
			$or: [
				{ category: product.category }, // Find products in the same category
				{ brand: product.brand }, // Find products with the same brand
				{ tags: { $in: product.tags.split(",") } }, // Find products with similar tags
			],
			_id: { $ne: id }, // Exclude the current product fro
		}).limit(8);

		console.log({ similarProducts });
		return res.json({ status: "success", data: { products: similarProducts } });
	} catch (error) {
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};

export const getAllProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// Filtering
		const queryObj = { ...req.query };
		const excludeFields = [
			"page",
			"sort",
			"limit",
			"fields",
			"title",
			"category",
		];
		excludeFields.forEach((el) => delete queryObj[el]);
		console.log({ queryObj });
		// req.query.title = req.query.title || "";

		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

		console.log({ queryStr });

		let query = Product.find({
			...JSON.parse(queryStr),
		});

		if (req.query.title) {
			query.find({
				title: {
					$regex: req.query.title,
					$options: "i",
				},
			});
		}

		if (req.query.category) {
			query.find({
				category: {
					$regex: req.query.category,
					$options: "i",
				},
			});
		}

		// Sorting

		if (req.query.sort) {
			const sortBy = (req.query.sort as string).split(",").join(" ");
			query = query.sort(sortBy);
		} else {
			query = query.sort("-createdAt");
		}

		// limiting the fields

		if (req.query.fields) {
			const fields = (req.query.fields as string).split(",").join(" ");
			query = query.select(fields);
		} else {
			query = query.select("-__v");
		}

		// pagination

		const page = req.query.page;
		const limit = req.query.limit ? Number(req.query.limit) : 10;
		// @ts-ignore
		const skip = (page - 1) * limit;
		query = query.skip(skip).limit(limit);
		let productCount;
		if (req.query.page) {
			productCount = await Product.countDocuments();
			if (skip >= productCount) throw new Error("This Page does not exists");
		}
		const product = await query.select({ colors: true });
		return res.json({
			status: "success",
			message: "Get products",
			data: { products: product, count: productCount },
		});
	} catch (error) {
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};

export const addToWishlist = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { _id } = req.userData;
	const { prodId } = req.body;
	try {
		const user = await User.findById(_id);
		const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
		if (alreadyadded) {
			let user = await User.findByIdAndUpdate(
				_id,
				{
					$pull: { wishlist: prodId },
				},
				{
					new: true,
				}
			);
		} else {
			let user = await User.findByIdAndUpdate(
				_id,
				{
					$push: { wishlist: prodId },
				},
				{
					new: true,
				}
			);
		}
		return res.json({
			status: "success",
			message: alreadyadded
				? "Remove from wishlist successfully"
				: "Add to wishlist successfully",
		});
	} catch (error) {
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};

export const rating = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { _id } = req.userData;
	const { star, prodId, comment } = req.body;
	try {
		const product = await Product.findById(prodId);
		let alreadyRated = product.ratings.find(
			// @ts-ignore
			(userId) => userId.postedby.toString() === _id.toString()
		);
		if (alreadyRated) {
			const updateRating = await Product.updateOne(
				{
					ratings: { $elemMatch: alreadyRated },
				},
				{
					$set: { "ratings.$.star": star, "ratings.$.comment": comment },
				},
				{
					new: true,
				}
			);
		} else {
			const rateProduct = await Product.findByIdAndUpdate(
				prodId,
				{
					$push: {
						ratings: {
							star: star,
							comment: comment,
							postedby: _id,
						},
					},
				},
				{
					new: true,
				}
			);
		}
		const getallratings = await Product.findById(prodId);
		let totalRating = getallratings.ratings.length;
		let ratingsum = getallratings.ratings
			// @ts-ignore
			.map((item) => item.star)
			// @ts-ignore
			.reduce((prev, curr) => prev + curr, 0);
		let actualRating = Math.round(ratingsum / totalRating);
		let finalproduct = await Product.findByIdAndUpdate(
			prodId,
			{
				totalrating: actualRating,
			},
			{ new: true }
		);
		return res.json({
			status: "success",
			message: "Rate product successfully",
		});
	} catch (error) {
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};
