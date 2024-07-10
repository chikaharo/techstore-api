"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImages = exports.uploadImages = void 0;
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = require("../config/cloudinary");
const uploadImages = async (req, res) => {
    const urls = [];
    const files = req.files;
    try {
        const uploader = (path) => (0, cloudinary_1.cloudinaryUploadImg)(path, "images");
        for (const file of files) {
            const { path } = file;
            const newpath = await uploader(path);
            urls.push(newpath);
            fs_1.default.unlinkSync(path);
        }
        const images = [];
        urls.forEach((file) => {
            images.push(file);
        });
        console.log("image", images);
        return res.json(images);
    }
    catch (error) {
        for (const file of files) {
            const { path } = file;
            fs_1.default.unlinkSync(path);
        }
        console.log("[uploadImages error]:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};
exports.uploadImages = uploadImages;
const deleteImages = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = (0, cloudinary_1.cloudinaryDeleteImg)(id);
        return res.json({ message: "Deleted" });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};
exports.deleteImages = deleteImages;
//# sourceMappingURL=uploadController.js.map