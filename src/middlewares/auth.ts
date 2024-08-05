import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AppError } from "../helpers/AppError";
import User from "../models/userModel";

declare global {
	namespace Express {
		interface Request {
			userData?: JwtPayload;
		}
	}
}

export const auth = (req: Request, _res: Response, next: NextFunction) => {
	try {
		const token = req.headers.authorization?.replace("Bearer ", "");

		if (token) {
			const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
			console.log({ decoded });
			req.userData = decoded;
			next();
		} else {
			console.log("dont have token");
			next(new AppError("Dont have token", 401, "Unauthorized", true));
		}
	} catch (err) {
		console.log("check auth failed: ", err);
		next(new AppError("Authentification Failed", 401, "Unauthorized", true));
	}
};

export const retrictsTo = (roles: string[]) => {
	return async (req: Request, _res: Response, next: NextFunction) => {
		if (!req.userData) {
			return next(new AppError("Aunthorized", 403, "Unauthorized", true));
		}
		// @ts-ignore
		const user = await User.findById(req.userData._id);
		console.log("user retrict To: ", user);
		// @ts-ignore
		if (!roles.includes(user.role)) {
			return next(new AppError("Aunthorized", 403, "Unauthorized", true));
		}
		next();
	};
};
