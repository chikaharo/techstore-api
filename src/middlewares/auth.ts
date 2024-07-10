import { Request, Response, NextFunction } from "express";
import {} from "passport";
import jwt from "jsonwebtoken";
import { AppError } from "../helpers/AppError";
import User from "../models/userModel";

export const auth = (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.headers.authorization?.replace("Bearer ", "");
		if (token) {
			const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
			console.log({ decoded });
			req.user = decoded;
			next();
		} else {
			console.log("dont have token");
			next(new AppError("Dont have token", 401, "Authorization", true));
		}
	} catch (err) {
		next(new AppError("Authentification Failed", 401, "Authorization", true));
	}
};

export const retrictsTo = (roles: string[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		if (!req.user) {
			return next(new AppError("Aunthorized", 403, "Authorized", true));
		}
		const user = await User.findById(req.user._id);
		console.log("user retrict To: ", user);
		if (!roles.includes(user.role)) {
			return next(new AppError("Aunthorized", 403, "Authorized", true));
		}
		next();
	};
};
