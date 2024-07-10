"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rating = exports.addToWishlist = exports.getAllProduct = exports.getSimilarProducts = exports.getProductBySlug = exports.getaProduct = exports.deleteProduct = exports.updateProduct = exports.createProduct = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const slugify_1 = __importDefault(require("slugify"));
const cloudinary_1 = require("../config/cloudinary");
const AppError_1 = require("../helpers/AppError");
const createProduct = async (req, res, next) => {
    try {
        if (req.body.title) {
            req.body.slug = (0, slugify_1.default)(req.body.title);
        }
        const newProduct = await productModel_1.default.create(req.body);
        return res.json({
            status: "success",
            message: "Create product successfully",
            data: newProduct,
        });
    }
    catch (error) {
        console.log("[CREATE_PRODUCT_ERROR]:", error);
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res, next) => {
    const { id } = req.params;
    try {
        if (req.body.title) {
            req.body.slug = (0, slugify_1.default)(req.body.title);
        }
        const oldProduct = await productModel_1.default.findById(id);
        const updatedProduct = await productModel_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        if (req.body.images &&
            req.body.images.length > 0 &&
            ((oldProduct.images.length > 0 &&
                oldProduct.images[0].url !== req.body.images[0].url) ||
                oldProduct.images.length === 0)) {
            for (const img of oldProduct.images) {
                await (0, cloudinary_1.cloudinaryDeleteImg)(img.asset_id);
            }
            updatedProduct.thumbnail = req.body.images[0].url;
            await updatedProduct.save();
        }
        else if (req.body.images && req.body.images.length === 0) {
            updatedProduct.thumbnail =
                "https://res.cloudinary.com/dqwdvpi4d/image/upload/v1691639790/default-product-image-removebg-preview_p3g0jy.png";
            await updatedProduct.save();
        }
        return res.json({
            status: "success",
            message: "Update product successfully",
            data: updatedProduct,
        });
    }
    catch (error) {
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedProduct = await productModel_1.default.findByIdAndDelete(id);
        return res.json({
            status: "success",
            message: "Deleted product successfully",
            data: deletedProduct,
        });
    }
    catch (error) {
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.deleteProduct = deleteProduct;
const getaProduct = async (req, res, next) => {
    const { id } = req.params;
    try {
        const product = await productModel_1.default.findById(id).populate(["colors"]);
        return res.json({
            status: "success",
            message: "Get Product successfully",
            data: product,
        });
    }
    catch (error) {
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.getaProduct = getaProduct;
const getProductBySlug = async (req, res, next) => {
    const { slug } = req.params;
    console.log(slug);
    try {
        const product = await productModel_1.default.findOne({ slug: slug }).populate(["colors"]);
        return res.json({
            status: "success",
            message: "Get Product successfully",
            data: product,
        });
    }
    catch (error) {
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.getProductBySlug = getProductBySlug;
const getSimilarProducts = async (req, res, next) => {
    try {
        const { id } = req.query;
        const product = await productModel_1.default.findById(id);
        if (!product) {
            return res.json({ status: "success", data: { products: [] } });
        }
        const similarProducts = await productModel_1.default.find({
            $or: [
                { category: product.category },
                { brand: product.brand },
                { tags: { $in: product.tags.split(",") } },
            ],
            _id: { $ne: id },
        }).limit(8);
        console.log({ similarProducts });
        return res.json({ status: "success", data: { products: similarProducts } });
    }
    catch (error) {
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.getSimilarProducts = getSimilarProducts;
const getAllProduct = async (req, res, next) => {
    try {
        const queryObj = Object.assign({}, req.query);
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
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        console.log({ queryStr });
        let query = productModel_1.default.find(Object.assign({}, JSON.parse(queryStr)));
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
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        }
        else {
            query = query.sort("-createdAt");
        }
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        }
        else {
            query = query.select("-__v");
        }
        const page = req.query.page;
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        let productCount;
        if (req.query.page) {
            productCount = await productModel_1.default.countDocuments();
            if (skip >= productCount)
                throw new Error("This Page does not exists");
        }
        const product = await query.select({ colors: true });
        return res.json({
            status: "success",
            message: "Get products",
            data: { products: product, count: productCount },
        });
    }
    catch (error) {
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.getAllProduct = getAllProduct;
const addToWishlist = async (req, res, next) => {
    const { _id } = req.user;
    const { prodId } = req.body;
    try {
        const user = await userModel_1.default.findById(_id);
        const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
        if (alreadyadded) {
            let user = await userModel_1.default.findByIdAndUpdate(_id, {
                $pull: { wishlist: prodId },
            }, {
                new: true,
            });
        }
        else {
            let user = await userModel_1.default.findByIdAndUpdate(_id, {
                $push: { wishlist: prodId },
            }, {
                new: true,
            });
        }
        return res.json({
            status: "success",
            message: alreadyadded
                ? "Remove from wishlist successfully"
                : "Add to wishlist successfully",
        });
    }
    catch (error) {
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.addToWishlist = addToWishlist;
const rating = async (req, res, next) => {
    const { _id } = req.user;
    const { star, prodId, comment } = req.body;
    try {
        const product = await productModel_1.default.findById(prodId);
        let alreadyRated = product.ratings.find((userId) => userId.postedby.toString() === _id.toString());
        if (alreadyRated) {
            const updateRating = await productModel_1.default.updateOne({
                ratings: { $elemMatch: alreadyRated },
            }, {
                $set: { "ratings.$.star": star, "ratings.$.comment": comment },
            }, {
                new: true,
            });
        }
        else {
            const rateProduct = await productModel_1.default.findByIdAndUpdate(prodId, {
                $push: {
                    ratings: {
                        star: star,
                        comment: comment,
                        postedby: _id,
                    },
                },
            }, {
                new: true,
            });
        }
        const getallratings = await productModel_1.default.findById(prodId);
        let totalRating = getallratings.ratings.length;
        let ratingsum = getallratings.ratings
            .map((item) => item.star)
            .reduce((prev, curr) => prev + curr, 0);
        let actualRating = Math.round(ratingsum / totalRating);
        let finalproduct = await productModel_1.default.findByIdAndUpdate(prodId, {
            totalrating: actualRating,
        }, { new: true });
        return res.json({
            status: "success",
            message: "Rate product successfully",
        });
    }
    catch (error) {
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.rating = rating;
//# sourceMappingURL=productController.js.map