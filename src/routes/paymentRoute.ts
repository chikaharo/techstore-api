import express from "express";
import { uploadImages } from "../controllers/uploadController";
import { productImgResize, uploadPhoto } from "../middlewares/uploadImage";
import { payment, validatePayment } from "../controllers/paymentController";
import { auth } from "../middlewares/auth";

const router = express.Router();

router.post("/", auth, payment);
router.get("/vnpay_return", validatePayment);

export default router;
