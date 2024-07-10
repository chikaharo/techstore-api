import multer, { FileFilterCallback, Multer } from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { NextFunction, Request, Response } from "express";

const storage = multer.diskStorage({
	destination: function (_req, _file, cb) {
		const imagesPath = path.join(__dirname, "../public/images/");
		fs.stat(imagesPath, (err, _stats) => {
			if (err) {
				if (err.code === "ENOENT") {
					// Thư mục không tồn tại, tạo mới
					fs.mkdir(imagesPath, { recursive: true }, (err) => {
						if (err) {
							console.error("Không thể tạo thư mục:", err);
						} else {
							console.log("Thư mục đã được tạo.");
						}
					});
				} else {
					console.error("Lỗi khi kiểm tra thư mục:", err);
				}
			} else {
				console.log("Thư mục đã tồn tại.");
			}
		});
		cb(null, path.join(__dirname, "../public/images/"));
	},
	filename: function (_req, file, cb) {
		const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		const fileExt = file.originalname.split(".")[1];
		cb(null, file.fieldname + "-" + uniquesuffix + ".jpeg");
		// cb(null, file.originalname);
	},
});

const multerFilter = (
	_req: Request,
	file: Express.Multer.File,
	cb: FileFilterCallback
) => {
	if (file.mimetype.startsWith("image")) {
		cb(null, true);
	} else {
		cb(new Error("Unsupported file format"));
	}
};

export const uploadPhoto = multer({
	storage: storage,
	fileFilter: multerFilter,
	limits: { fileSize: 1000000 },
});

export const productImgResize = async (
	req: Request,
	_res: Response,
	next: NextFunction
) => {
	if (!req.files) return next();
	await Promise.all(
		(req.files as Express.Multer.File[]).map(async (file) => {
			console.log("Sharp file: ", file);
			await sharp(file.path)
				.resize(300, 300)
				.toFormat("jpeg")
				.jpeg({ quality: 90 })
				.toFile(
					path.join(__dirname, `public/images/products/${file.filename}`)
				);
			fs.unlinkSync(
				path.join(__dirname, `public/images/products/${file.filename}`)
			);
		})
	);
	next();
};

export const blogImgResize = async (
	req: Request,
	_res: Response,
	next: NextFunction
) => {
	if (!req.files) return next();
	await Promise.all(
		(req.files as Express.Multer.File[]).map(async (file) => {
			await sharp(file.path)
				.resize(300, 300)
				.toFormat("jpeg")
				.jpeg({ quality: 90 })
				.toFile(`public/images/blogs/${file.filename}`);
			fs.unlinkSync(`public/images/blogs/${file.filename}`);
		})
	);
	next();
};
