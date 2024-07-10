"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrictsTo = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../helpers/AppError");
const userModel_1 = __importDefault(require("../models/userModel"));
const auth = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        if (token) {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            console.log({ decoded });
            req.user = decoded;
            next();
        }
        else {
            console.log("dont have token");
            next(new AppError_1.AppError("Dont have token", 401, "Authorization", true));
        }
    }
    catch (err) {
        next(new AppError_1.AppError("Authentification Failed", 401, "Authorization", true));
    }
};
exports.auth = auth;
const retrictsTo = (roles) => {
    return async (req, res, next) => {
        if (!req.user) {
            return next(new AppError_1.AppError("Aunthorized", 403, "Authorized", true));
        }
        const user = await userModel_1.default.findById(req.user._id);
        console.log("user retrict To: ", user);
        if (!roles.includes(user.role)) {
            return next(new AppError_1.AppError("Aunthorized", 403, "Authorized", true));
        }
        next();
    };
};
exports.retrictsTo = retrictsTo;
//# sourceMappingURL=auth.js.map