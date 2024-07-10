import { Request, Response } from "express";
import fs from "fs";

import { cloudinaryUploadImg, cloudinaryDeleteImg } from "../config/cloudinary";
export const uploadImages = async (req: Request, res: Response) => {
	const urls = [];
	const files = req.files;
	try {
		// @ts-ignore
		const uploader = (path: string) => cloudinaryUploadImg(path, "images");
		// @ts-ignore
		for (const file of files) {
			const { path } = file;
			const newpath = await uploader(path);
			urls.push(newpath);
			fs.unlinkSync(path);
		}
		// @ts-ignore
		const images = [];
		urls.forEach((file) => {
			images.push(file);
		});
		// @ts-ignore
		return res.json(images);
	} catch (error) {
		for (const file of files) {
			const { path } = file;
			fs.unlinkSync(path);
		}
		console.log("[uploadImages error]:", error);
		return res.status(500).json({
			success: false,
			message: "Something went wrong",
		});
	}
};

export const deleteImages = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const deleted = cloudinaryDeleteImg(id);
		return res.json({ message: "Deleted" });
	} catch (error) {
		// throw new Error(error);
		return res.status(500).json({
			success: false,
			message: "Something went wrong",
		});
	}
};
