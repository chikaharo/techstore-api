// not Found

import { NextFunction, Request, Response } from "express";
import { AppError } from "../helpers/AppError";

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
	const error = new AppError(
		`Not Found : ${req.originalUrl}`,
		404,
		"Not Found",
		true
	);
	// res.status(404);
	next(error);
};

// Error Handler

const sendErrorDev = (err: AppError, res: Response) => {
	res.json({
		status: "error",
		message: err?.message,
		stack: err?.stack,
	});
};

const sendErrorProd = (err: AppError, res: Response) => {
	if (!err.isOperational) {
		console.error("ERROR: ", err);
		res.status(500).json({
			status: "error",
			message: "Something went wrong",
		});
	} else {
		res.json({
			status: "error",
			message: err?.message,
		});
	}
};

export const errorHandler = (
	err: AppError,
	__dirnamereq: Request,
	res: Response,
	next: NextFunction
) => {
	console.error(err);
	if (!err.isOperational) {
		next(err);
	}

	res.status(err.httpCode);
	if (process.env.NODE_ENV === "development") {
		sendErrorDev(err, res);
	} else {
		sendErrorProd(err, res);
	}
};

export function logError(err: Error) {
	console.error(err);
}

export function logErrorMiddleware(
	err: Error,
	_req: Request,
	_res: Response,
	next: NextFunction
) {
	logError(err);
	next(err);
}

// export function returnError(
// 	err: Error,
// 	_req: Request,
// 	res: Response,
// 	_next: NextFunction
// ) {
// 	res.status(err.statusCode || 500).send(err.message);
// }

export function isOperationalError(error: Error) {
	if (error instanceof AppError) {
		return error.isOperational;
	}
	return false;
}

// class ErrorHandler {
//     public async handleError(error: Error, responseStream: Response): Promise<void> {
//         await logger.logError(error);
//         await fireMonitoringMetric(error);
//         await crashIfUntrustedErrorOrSendResponse(error, responseStream);
//     };
// }
