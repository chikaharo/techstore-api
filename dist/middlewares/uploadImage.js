"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogImgResize = exports.productImgResize = exports.uploadPhoto = void 0;
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const imagesPath = path_1.default.join(__dirname, "../public/images/");
        fs_1.default.stat(imagesPath, (err, stats) => {
            if (err) {
                if (err.code === "ENOENT") {
                    fs_1.default.mkdir(imagesPath, { recursive: true }, (err) => {
                        if (err) {
                            console.error("Không thể tạo thư mục:", err);
                        }
                        else {
                            console.log("Thư mục đã được tạo.");
                        }
                    });
                }
                else {
                    console.error("Lỗi khi kiểm tra thư mục:", err);
                }
            }
            else {
                console.log("Thư mục đã tồn tại.");
            }
        });
        cb(null, path_1.default.join(__dirname, "../public/images/"));
    },
    filename: function (req, file, cb) {
        const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileExt = file.originalname.split(".")[1];
        cb(null, file.fieldname + "-" + uniquesuffix + ".jpeg");
    },
});
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    }
    else {
        cb({ message: "Unsupported file format" }, false);
    }
};
exports.uploadPhoto = (0, multer_1.default)({
    storage: storage,
    fileFilter: multerFilter,
    limits: { fileSize: 1000000 },
});
const productImgResize = async (req, res, next) => {
    if (!req.files)
        return next();
    await Promise.all(req.files.map(async (file) => {
        console.log("Sharp file: ", file);
        await (0, sharp_1.default)(file.path)
            .resize(300, 300)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(path_1.default.join(__dirname, `public/images/products/${file.filename}`));
        fs_1.default.unlinkSync(path_1.default.join(__dirname, `public/images/products/${file.filename}`));
    }));
    next();
};
exports.productImgResize = productImgResize;
const blogImgResize = async (req, res, next) => {
    if (!req.files)
        return next();
    await Promise.all(req.files.map(async (file) => {
        await (0, sharp_1.default)(file.path)
            .resize(300, 300)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`public/images/blogs/${file.filename}`);
        fs_1.default.unlinkSync(`public/images/blogs/${file.filename}`);
    }));
    next();
};
exports.blogImgResize = blogImgResize;
//# sourceMappingURL=uploadImage.js.map