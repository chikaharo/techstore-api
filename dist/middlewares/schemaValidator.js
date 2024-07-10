"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schemas_1 = __importDefault(require("../schemas"));
const AppError_1 = require("../helpers/AppError");
const supportedMethods = ["post", "put", "patch", "delete"];
const validationOptions = {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: false,
};
const schemaValidator = (path, useJoiError = true) => {
    const schema = schemas_1.default[path];
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
            const customError = {
                status: "fail",
                error: error.message,
            };
            const joiError = {
                status: "fail",
                error: {
                    original: error._original,
                    details: error.details.map(({ message, type }) => ({
                        message: message.replace(/['"]/g, ""),
                        type,
                    })),
                },
            };
            return next(new AppError_1.AppError(useJoiError ? joiError.error.details.message : customError.error, 400, "Validate Error", true));
        }
        req.body = value;
        return next();
    };
};
exports.default = schemaValidator;
//# sourceMappingURL=schemaValidator.js.map