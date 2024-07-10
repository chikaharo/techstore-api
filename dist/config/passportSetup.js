"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const userModel_1 = __importDefault(require("../models/userModel"));
passport_1.default.use(new passport_local_1.Strategy(async function (email, password, done) {
    console.log({ email });
    console.log([password]);
    const existingUser = await userModel_1.default.findOne({ email });
    if (existingUser) {
        return done(null, { email, password, active: true }, { message: "authenticate successfully" });
    }
}));
passport_1.default.serializeUser(function (user, done) {
    process.nextTick(function () {
        done(null, { message: `user is ${user}` });
    });
});
passport_1.default.deserializeUser(function (user, done) {
    process.nextTick(function () {
        return done(null, {
            user,
        });
    });
});
exports.default = passport_1.default;
//# sourceMappingURL=passportSetup.js.map