import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import { sendEmail } from "../helpers/sendMail";
import { generateRefreshToken, generateToken } from "../helpers/jwtToken";
import jwt from "jsonwebtoken";
import { AppError } from "../helpers/AppError";

export const createUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { email, name, password } = req.body;
	try {
		const findUser = await User.findOne({ email: email });

		if (findUser) {
			return next(
				new AppError("User already exists", 400, "Register failed", true)
			);
		}

		const userData = {
			email,
			username: email,
			name,
			password,
		};
		const newUser = new User(userData);
		const otp = Math.floor(1000 + Math.random() * 9000);
		// newUser.otp = otp;
		newUser.otp = 1768;
		await newUser.save();
		const data: NodemailerData = {
			to: email,
			text: `Hey User here is your OTP ${otp}`,
			subject: "Sent OTP",
			html: "<h1>Hey User here is your OTP</h1>" + otp,
		};
		sendEmail(data);
		return res.json({
			status: "success",
			message: "Register new user successfully",
			data: newUser,
		});
	} catch (error) {
		console.log("[createUser_ERR]:", error);
		next(new AppError(error.message, 500, "Server Error", true));
	}
};

export const sendOTP = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return next(new AppError("Email not found", 404, "Not Found", true));
		}
		const otp = Math.floor(1000 + Math.random() * 9000);
		// user.otp = otp;
		user.otp = 1768;
		await user.save();
		const data: NodemailerData = {
			to: email,
			text: `Hey User here is your OTP ${otp}`,
			subject: "Sent OTP",
			html: "<h1>Hey User here is your OTP</h1>" + otp,
		};
		sendEmail(data);
		return res
			.status(200)
			.json({ status: "success", message: "Verify Otp successfully" });
	} catch (error) {
		next(new AppError(error.message, 500, "Server Error", true));
	}
};

export const verifyOTP = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { email, otp } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: "User does not exist" });
		}
		if (user.otp !== otp) {
			return res.status(400).json({ message: "Invalid OTP code" });
		}

		user.otp = ""; // Xoá mã OTP sau khi xác minh thành công
		await user.save();
		return res.json({
			status: "success",
			message: "OTP verification successful",
		});
	} catch (error) {
		console.error(error);
		return next(new AppError(error.message, 400, "Server Error", true));
	}
};

export const login = async (req: Request, res: Response) => {
	const { email, password, role } = req.body;
	console.log(req.body);
	const findUser = await User.findOne({ email });
	if (!findUser) {
		return res.status(404).json("Email not found");
	}
	// if (role !== findUser.role) {
	// 	return res.status(404).json(`Not Authorised, Please login as ${role}`);
	// }
	// @ts-ignore
	const validPassword = await findUser.isPasswordMatched(password);
	if (!validPassword) {
		return res.status(404).json("Password is not correct");
	}

	// const refreshToken = generateRefreshToken(findUser?._id);
	const refreshToken = jwt.sign(
		{ _id: findUser._id },
		process.env.JWT_SECRET as string,
		{
			expiresIn: "1d",
		}
	);
	const accessToken = jwt.sign(
		{ _id: findUser._id },
		process.env.JWT_SECRET as string,
		{
			expiresIn: "3d",
		}
	);
	await User.findByIdAndUpdate(
		findUser.id,
		{
			refreshToken: refreshToken,
		},
		{ new: true }
	);
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production", // gán bằng true sau khi deploy
		sameSite: "none",
		maxAge: 72 * 60 * 60 * 1000,
	});

	return res.json({
		user: {
			_id: findUser?._id,
			name: findUser?.name,
			email: findUser?.email,
			role: findUser?.role,
		},
		accessToken: accessToken,
	});
};

export const logout = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		let { email } = req.body;
		if (!email) return res.status(401).json("No Email Provided");
		const user = await User.findOne({ email });
		if (!user) {
			res.clearCookie("refreshToken", {
				httpOnly: false,
				secure: false,
			});
			return res.sendStatus(204);
		}
		await User.findOneAndUpdate(
			{ email },
			{
				refreshToken: "",
			}
		);
		res.clearCookie("refreshToken", {
			httpOnly: false,
			secure: false,
		});
		return res.json({
			status: "success",
			message: "Log out successfully",
		});
	} catch (error) {
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};

export const getallUser = async (
	_req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const users = await User.find();
		return res.json({
			status: "success",
			message: "Get users successfully",
			data: users,
		});
	} catch (error) {
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};

export const getMe = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { _id } = req.userData;
		const user = await User.findById(_id);
		if (!user) {
			return next(new AppError("User not found", 404, "Not Found", true));
		}
		return res.json({ message: "ok", status: "success", data: user });
	} catch (error) {
		next(new AppError(error.message, 500, "Server Error", true));
	}
};

export const changePassword = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { _id } = req.userData;
		const { password } = req.body;
		const user = await User.findById(_id);
		if (!user) {
			return next(new AppError("User not found", 404, "Not Found", true));
		}

		user.password = password;
		await user.save();
		return res.json({
			status: "success",
			message: "Updated password successfully",
		});
	} catch (error) {
		next(new AppError("Something went wrong", 500, "Server Error", true));
	}
};

export const getWishlist = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { _id } = req.userData;

	try {
		const user = await User.findById(_id).populate({
			path: "wishlist",
			select: "title thumbnail price quantity slug",
			populate: {
				path: "colors",
				model: "Color",
			},
		});

		return res.json({
			status: "success",
			message: "Get user wishlist successfully",
			data: user.wishlist,
		});
	} catch (error) {
		return next(new AppError(error.message, 500, "Server Error", true));
	}
};
