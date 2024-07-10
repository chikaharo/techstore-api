import { RequestHandler } from "express";
import schemas from "../schemas";
import { AppError } from "../helpers/AppError";

interface ValidationError {
	message: string;
	type: string;
}

interface JoiError {
	status: string;
	error: {
		original: unknown;
		details: ValidationError[];
	};
}

interface CustomError {
	status: string;
	error: string;
}

const supportedMethods = ["post", "put", "patch", "delete"];

const validationOptions = {
	abortEarly: false,
	allowUnknown: false,
	stripUnknown: false,
};

const schemaValidator = (path: string, useJoiError = true): RequestHandler => {
	const schema = schemas[path];

	if (!schema) {
		throw new Error(`Schema not found for path: ${path}`);
	}

	return (req, res, next) => {
		const method = req.method.toLowerCase();

		if (!supportedMethods.includes(method)) {
			return next();
		}

		const { error, value } = schema.validate(req.body, validationOptions);
		if (error) {
			console.log("validate er: ", error);
			const customError: CustomError = {
				status: "fail",
				error: error.message,
			};

			const joiError: JoiError = {
				status: "fail",
				error: {
					original: error._original,
					details: error.details.map(({ message, type }: ValidationError) => ({
						message: message.replace(/['"]/g, ""),
						type,
					})),
				},
			};

			// return res.status(422).json(useJoiError ? joiError : customError);
			return next(
				new AppError(
					useJoiError ? joiError.error.details.message : customError.error,
					400,
					"Validate Error",
					true
				)
			);
		}

		// validation successful
		req.body = value;
		return next();
	};
};

export default schemaValidator;
