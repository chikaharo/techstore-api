"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryDeleteImg = exports.cloudinaryUploadImg = void 0;
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const cloudinaryUploadImg = async (fileToUploads) => {
    return new Promise((resolve) => {
        cloudinary_1.v2.uploader.upload(fileToUploads).then((result) => {
            console.log({ result });
            resolve({
                url: result.secure_url,
                asset_id: result.asset_id,
                public_id: result.public_id,
            }, {
                resource_type: "auto",
            });
        });
    });
};
exports.cloudinaryUploadImg = cloudinaryUploadImg;
const cloudinaryDeleteImg = async (fileToDelete) => {
    return new Promise((resolve) => {
        cloudinary_1.v2.uploader.destroy(fileToDelete).then((result) => {
            resolve({
                url: result.secure_url,
                asset_id: result.asset_id,
                public_id: result.public_id,
            }, {
                resource_type: "auto",
            });
        });
    });
};
exports.cloudinaryDeleteImg = cloudinaryDeleteImg;
//# sourceMappingURL=cloudinary.js.map