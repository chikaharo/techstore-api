import jwt from "jsonwebtoken";
import { resolve } from "path";
import { AppError } from "./AppError";

export const generateToken = async (id: string) => {
	return new Promise((resolve, reject) => {
		jwt.sign(
			{ _id: id },
			process.env.JWT_SECRET,
			{
				expiresIn: "1d",
			},
			(err, token) => {
				if (err) reject(err);
				resolve(token);
			}
		);
	});
};

export const generateRefreshToken = async (id: string) => {
	return new Promise((resolve, reject) => {
		jwt.sign(
			{ _id: id },
			process.env.JWT_REFRESH_SECRET,
			{
				expiresIn: "1d",
			},
			(err, token) => {
				if (err) reject(err);
				resolve(token);
			}
		);
	});
};
