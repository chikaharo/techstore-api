"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const PASSWORD_REGEX = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})");
const userRegister = joi_1.default.object().keys({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    username: joi_1.default.string().email().required(),
    password: joi_1.default.string().pattern(PASSWORD_REGEX).min(8).required(),
    password_confirmation: joi_1.default.string().pattern(PASSWORD_REGEX).min(8).required(),
});
const userLogin = joi_1.default.object().keys({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
});
const userChangePassword = joi_1.default.object().keys({
    password: joi_1.default.string().pattern(PASSWORD_REGEX).min(6).required(),
    password_confirmation: joi_1.default.string().pattern(PASSWORD_REGEX).min(6).required(),
});
const brandCreate = joi_1.default.object().keys({
    title: joi_1.default.string().required(),
});
const brandUpdate = joi_1.default.object().keys({
    title: joi_1.default.string().required(),
});
const categoryCreate = joi_1.default.object().keys({
    title: joi_1.default.string().required(),
});
const categoryUpdate = joi_1.default.object().keys({
    title: joi_1.default.string().required(),
});
const colorCreate = joi_1.default.object().keys({
    title: joi_1.default.string().required(),
    value: joi_1.default.string().required(),
});
const colorUpdate = joi_1.default.object().keys({
    title: joi_1.default.string().required(),
    value: joi_1.default.string().required(),
});
const productCreate = joi_1.default.object().keys({
    title: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    price: joi_1.default.number().required(),
    quantity: joi_1.default.number().required(),
    brand: joi_1.default.string().required(),
    category: joi_1.default.string().required(),
    colors: joi_1.default.array().required(),
    images: joi_1.default.array(),
    tags: joi_1.default.string().valid("Special", "Popular", "Featured"),
});
const productUpdate = joi_1.default.object().keys({
    title: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    price: joi_1.default.number().required(),
    quantity: joi_1.default.number().required(),
    brand: joi_1.default.string().required(),
    category: joi_1.default.string().required(),
    colors: joi_1.default.array().required(),
    images: joi_1.default.array(),
    tags: joi_1.default.string().valid("Special", "Popular", "Featured"),
});
exports.default = {
    "/user/login": userLogin,
    "/user/register": userRegister,
    "/user/change-password": userChangePassword,
    "/brand/create": brandCreate,
    "/brand/update": brandUpdate,
    "/category/create": categoryCreate,
    "/category/update": categoryUpdate,
    "/color/create": colorCreate,
    "/color/update": colorUpdate,
    "/product/create": productCreate,
    "/product/update": productUpdate,
};
//# sourceMappingURL=schemas.js.map