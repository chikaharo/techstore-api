"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWishlist = exports.changePassword = exports.getMe = exports.getallUser = exports.logout = exports.login = exports.verifyOTP = exports.sendOTP = exports.createUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const sendMail_1 = require("../helpers/sendMail");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../helpers/AppError");
const createUser = async (req, res, next) => {
    const { email, name, password } = req.body;
    try {
        const findUser = await userModel_1.default.findOne({ email: email });
        if (findUser) {
            return next(new AppError_1.AppError("User already exists", 400, "Register failed", true));
        }
        const userData = {
            email,
            username: email,
            name,
            password,
        };
        const newUser = new userModel_1.default(userData);
        const otp = Math.floor(1000 + Math.random() * 9000);
        newUser.otp = 1768;
        await newUser.save();
        const data = {
            to: email,
            text: `Hey User here is your OTP ${otp}`,
            subject: "Sent OTP",
            htm: "<h1>Hey User here is your OTP</h1>" + otp,
        };
        (0, sendMail_1.sendEmail)(data);
        return res.json({
            status: "success",
            message: "Register new user successfully",
            data: newUser,
        });
    }
    catch (error) {
        console.log("[createUser_ERR]:", error);
        next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.createUser = createUser;
const sendOTP = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await userModel_1.default.findOne({ email });
        if (!user) {
            return next(new AppError_1.AppError("Email not found", 404, "Not Found", true));
        }
        const otp = Math.floor(1000 + Math.random() * 9000);
        user.otp = 1768;
        await user.save();
        const data = {
            to: email,
            text: `Hey User here is your OTP ${otp}`,
            subject: "Sent OTP",
            htm: "<h1>Hey User here is your OTP</h1>" + otp,
        };
        (0, sendMail_1.sendEmail)(data);
        return res
            .status(200)
            .json({ status: "success", message: "Verify Otp successfully" });
    }
    catch (error) {
        next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.sendOTP = sendOTP;
const verifyOTP = async (req, res, next) => {
    const { email, otp } = req.body;
    try {
        const user = await userModel_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }
        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP code" });
        }
        user.otp = "";
        await user.save();
        return res.json({
            status: "success",
            message: "OTP verification successful",
        });
    }
    catch (error) {
        console.error(error);
        next(new AppError_1.AppError("An error occurred during OTP verification", 400, "Verify Failed", true));
    }
};
exports.verifyOTP = verifyOTP;
const login = async (req, res) => {
    const { email, password, role } = req.body;
    console.log(req.body);
    const findUser = await userModel_1.default.findOne({ email });
    if (!findUser) {
        return res.status(404).json("Email not found");
    }
    const validPassword = await findUser.isPasswordMatched(password);
    if (!validPassword) {
        return res.status(404).json("Password is not correct");
    }
    const refreshToken = jsonwebtoken_1.default.sign({ _id: findUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    const accessToken = jsonwebtoken_1.default.sign({ _id: findUser._id }, process.env.JWT_SECRET, {
        expiresIn: "3d",
    });
    await userModel_1.default.findByIdAndUpdate(findUser.id, {
        refreshToken: refreshToken,
    }, { new: true });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: "strict",
        maxAge: 72 * 60 * 60 * 1000,
    });
    console.log({ refreshToken });
    return res.json({
        user: {
            _id: findUser === null || findUser === void 0 ? void 0 : findUser._id,
            name: findUser === null || findUser === void 0 ? void 0 : findUser.name,
            email: findUser === null || findUser === void 0 ? void 0 : findUser.email,
            mobile: findUser === null || findUser === void 0 ? void 0 : findUser.mobile,
            role: findUser === null || findUser === void 0 ? void 0 : findUser.role,
        },
        accessToken: accessToken,
    });
};
exports.login = login;
const logout = async (req, res, next) => {
    try {
        let { email } = req.body;
        if (!email)
            return res.status(401).json("No Email Provided");
        const user = await userModel_1.default.findOne({ email });
        if (!user) {
            res.clearCookie("refreshToken", {
                httpOnly: false,
                secure: false,
            });
            return res.sendStatus(204);
        }
        await userModel_1.default.findOneAndUpdate({ email }, {
            refreshToken: "",
        });
        res.clearCookie("refreshToken", {
            httpOnly: false,
            secure: false,
        });
        return res.json({
            status: "success",
            message: "Log out successfully",
        });
    }
    catch (error) {
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.logout = logout;
const getallUser = async (req, res, next) => {
    try {
        const users = await userModel_1.default.find();
        return res.json({
            status: "success",
            message: "Get users successfully",
            data: users,
        });
    }
    catch (error) {
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.getallUser = getallUser;
const getMe = async (req, res, next) => {
    try {
        const { _id } = req.user;
        const user = await userModel_1.default.findById(_id);
        if (!user) {
            return next(new AppError_1.AppError("User not found", 404, "Not Found", true));
        }
        return res.json({ message: "ok", status: "success", data: user });
    }
    catch (error) {
        next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.getMe = getMe;
const changePassword = async (req, res, next) => {
    try {
        const { _id } = req.user;
        const { password } = req.body;
        const user = await userModel_1.default.findById(_id);
        if (!user) {
            return next(new AppError_1.AppError("User not found", 404, "Not Found", true));
        }
        user.password = password;
        await user.save();
        return res.json({
            status: "success",
            message: "Updated password successfully",
        });
    }
    catch (error) {
        next(new AppError_1.AppError("Something went wrong", 500, "Server Error", true));
    }
};
exports.changePassword = changePassword;
const getWishlist = async (req, res, next) => {
    const { _id } = req.user;
    try {
        const user = await userModel_1.default.findById(_id).populate({
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
    }
    catch (error) {
        return next(new AppError_1.AppError(error.message, 500, "Server Error", true));
    }
};
exports.getWishlist = getWishlist;
//# sourceMappingURL=userController.js.map