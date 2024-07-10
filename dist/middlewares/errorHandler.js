"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOperationalError = exports.returnError = exports.logErrorMiddleware = exports.logError = exports.errorHandler = exports.notFound = void 0;
const AppError_1 = require("../helpers/AppError");
const notFound = (req, res, next) => {
    const error = new AppError_1.AppError(`Not Found : ${req.originalUrl}`, 404, "Not Found", true);
    next(error);
};
exports.notFound = notFound;
const sendErrorDev = (err, res) => {
    res.json({
        status: "error",
        message: err === null || err === void 0 ? void 0 : err.message,
        stack: err === null || err === void 0 ? void 0 : err.stack,
    });
};
const sendErrorProd = (err, res) => {
    if (!err.isOperational) {
        console.error("ERROR: ", err);
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
        });
    }
    else {
        res.json({
            status: "error",
            message: err === null || err === void 0 ? void 0 : err.message,
        });
    }
};
const errorHandler = (err, req, res, next) => {
    console.error(err);
    if (!err.isOperational) {
        next(err);
    }
    err.httpCode = err.httpCode || 500;
    res.status(err.httpCode);
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    }
    else {
        sendErrorProd(err, res);
    }
};
exports.errorHandler = errorHandler;
function logError(err) {
    console.error(err);
}
exports.logError = logError;
function logErrorMiddleware(err, _req, _res, next) {
    logError(err);
    next(err);
}
exports.logErrorMiddleware = logErrorMiddleware;
function returnError(err, _req, res, _next) {
    res.status(err.statusCode || 500).send(err.message);
}
exports.returnError = returnError;
function isOperationalError(error) {
    if (error instanceof AppError_1.AppError) {
        return error.isOperational;
    }
    return false;
}
exports.isOperationalError = isOperationalError;
//# sourceMappingURL=errorHandler.js.map