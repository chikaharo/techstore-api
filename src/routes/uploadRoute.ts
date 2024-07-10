import express, { Request, Response } from "express";
import { uploadImages } from "../controllers/uploadController";
import { productImgResize, uploadPhoto } from "../middlewares/uploadImage";
import { auth, retrictsTo } from "../middlewares/auth";

const router = express.Router();

router.post(
	"/",
	auth,
	retrictsTo(["admin"]),
	uploadPhoto.array("images", 10),
	uploadImages
);
router.get("/", (_req: Request, res: Response) => {
	res.json({ message: "upload route ok" });
});

export default router;
