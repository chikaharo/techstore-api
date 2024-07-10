"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getallBrand = exports.getBrand = exports.deleteBrand = exports.updateBrand = exports.createBrand = void 0;
const brandModel_1 = __importDefault(require("../models/brandModel"));
const validateMongoId_1 = require("../helpers/validateMongoId");
const AppError_1 = require("../helpers/AppError");
const createBrand = async (req, res, next) => {
    try {
        const newBrand = await brandModel_1.default.create(req.body);
        return res.json({
            status: "success",
            message: "Create new brand successfully",
            data: newBrand,
        });
    }
    catch (error) {
        console.log("[Create Brand Error]:", error);
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.createBrand = createBrand;
const updateBrand = async (req, res, next) => {
    const { id } = req.params;
    (0, validateMongoId_1.validateMongoDbId)(id);
    try {
        const updatedBrand = await brandModel_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        return res.json({
            status: "success",
            message: "Update brand successfully",
            data: updatedBrand,
        });
    }
    catch (error) {
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.updateBrand = updateBrand;
const deleteBrand = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedBrand = await brandModel_1.default.findByIdAndDelete(id);
        return res.json({
            status: "success",
            message: "Delete brand successfully",
            data: deletedBrand,
        });
    }
    catch (error) {
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.deleteBrand = deleteBrand;
const getBrand = async (req, res, next) => {
    const { id } = req.params;
    console.log("get Brand id:", id);
    try {
        const brand = await brandModel_1.default.findById(id);
        return res.json({
            status: "success",
            message: "Get brand successfully",
            data: brand,
        });
    }
    catch (error) {
        console.error("[GET BRAND ERROR]", error);
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.getBrand = getBrand;
const getallBrand = async (req, res, next) => {
    try {
        const brands = await brandModel_1.default.find();
        return res.json({
            status: "success",
            message: "Get all brand successfully",
            data: brands,
        });
    }
    catch (error) {
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.getallBrand = getallBrand;
//# sourceMappingURL=brandController.js.map