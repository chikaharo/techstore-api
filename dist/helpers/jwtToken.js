"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (id) => {
    console.log("generate token id: ", id);
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};
exports.generateToken = generateToken;
const generateRefreshToken = (id) => {
    console.log("generate refresh token id: ", id);
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "3d",
    });
};
exports.generateRefreshToken = generateRefreshToken;
module.exports = { generateRefreshToken: exports.generateRefreshToken };
//# sourceMappingURL=jwtToken.js.map