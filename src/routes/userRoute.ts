import express from "express";
import {
	changePassword,
	createUser,
	getallUser,
	getMe,
	getWishlist,
	login,
	logout,
	sendOTP,
	verifyOTP,
} from "../controllers/userController";
import { auth, retrictsTo } from "../middlewares/auth";
import schemaValidator from "../middlewares/schemaValidator";
const router = express.Router();

router.post("/register", schemaValidator("/user/register"), createUser);
router.post("/send-otp", sendOTP);
router.post("/login/password", schemaValidator("/user/login"), login);
router.post("/logout", logout);
// router.post("/admin-login", login);
router.post("/verify-otp", verifyOTP);

router.get("/all-users", auth, retrictsTo(["admin"]), getallUser);
router.get("/me", auth, getMe);

router.get("/wishlist", auth, getWishlist);

router.put(
	"/change-password",
	auth,
	schemaValidator("/user/login"),
	changePassword
);

export default router;
