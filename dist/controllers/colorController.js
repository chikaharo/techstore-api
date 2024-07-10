"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getallColor = exports.getColor = exports.deleteColor = exports.updateColor = exports.createColor = void 0;
const colorModel_1 = __importDefault(require("../models/colorModel"));
const AppError_1 = require("../helpers/AppError");
const createColor = async (req, res, next) => {
    try {
        const newColor = await colorModel_1.default.create(req.body);
        return res.json({
            status: "success",
            message: "Create new color successfully",
            data: newColor,
        });
    }
    catch (error) {
        console.error(error);
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.createColor = createColor;
const updateColor = async (req, res, next) => {
    const { id } = req.params;
    try {
        const updatedColor = await colorModel_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        return res.json({
            status: "success",
            message: "Update color successfully",
            data: updatedColor,
        });
    }
    catch (error) {
        console.error(error);
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.updateColor = updateColor;
const deleteColor = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedColor = await colorModel_1.default.findByIdAndDelete(id);
        return res.json({
            status: "success",
            message: "Delete color successfully",
            data: deletedColor,
        });
    }
    catch (error) {
        console.error(error);
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.deleteColor = deleteColor;
const getColor = async (req, res, next) => {
    const { id } = req.params;
    try {
        const color = await colorModel_1.default.findById(id);
        return res.json({
            status: "success",
            message: "Get a color successfully",
            data: color,
        });
    }
    catch (error) {
        console.error(error);
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.getColor = getColor;
const getallColor = async (req, res, next) => {
    try {
        const colors = await colorModel_1.default.find();
        return res.json({
            status: "success",
            message: "Get all color successfully",
            data: colors,
        });
    }
    catch (error) {
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.getallColor = getallColor;
//# sourceMappingURL=colorController.js.map