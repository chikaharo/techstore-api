"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getallCategory = exports.getCategory = exports.deleteCategory = exports.updateCategory = exports.createCategory = void 0;
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
const validateMongoId_1 = require("../helpers/validateMongoId");
const slugify_1 = __importDefault(require("slugify"));
const AppError_1 = require("../helpers/AppError");
const createCategory = async (req, res, next) => {
    try {
        if (req.body.title) {
            req.body.slug = (0, slugify_1.default)(req.body.title);
        }
        const newCategory = await categoryModel_1.default.create(req.body);
        return res.json({
            status: "success",
            message: "Create new category successfully",
            data: newCategory,
        });
    }
    catch (error) {
        console.error("CATEGORY ERROR: ", error);
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res, next) => {
    const { id } = req.params;
    try {
        const updatedCategory = await categoryModel_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        return res.json({
            status: "success",
            message: "Update category successfully",
            data: updatedCategory,
        });
    }
    catch (error) {
        console.error("CATEGORY ERROR: ", error);
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res, next) => {
    const { id } = req.params;
    (0, validateMongoId_1.validateMongoDbId)(id);
    try {
        const deletedCategory = await categoryModel_1.default.findByIdAndDelete(id);
        return res.json({
            status: "success",
            message: "Delete category successfully",
            data: deletedCategory,
        });
    }
    catch (error) {
        console.error("CATEGORY ERROR: ", error);
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.deleteCategory = deleteCategory;
const getCategory = async (req, res, next) => {
    const { id } = req.params;
    try {
        const category = await categoryModel_1.default.findById(id);
        return res.json({
            status: "success",
            message: "Get category successfully",
            data: category,
        });
    }
    catch (error) {
        console.error("CATEGORY ERROR: ", error);
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.getCategory = getCategory;
const getallCategory = async (req, res, next) => {
    try {
        const categories = await categoryModel_1.default.find();
        return res.json({
            status: "success",
            message: "Get all categories successfully",
            data: categories,
        });
    }
    catch (error) {
        console.error("CATEGORY ERROR: ", error);
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.getallCategory = getallCategory;
//# sourceMappingURL=categoryController.js.map