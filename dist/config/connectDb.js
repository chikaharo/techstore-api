"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv");
const connectToDb = async () => {
    mongoose_1.default.Promise = Promise;
    console.log(process.env.MONGODB_URL);
    mongoose_1.default.connect(process.env.MONGODB_URL);
    mongoose_1.default.connection.on("error", (error) => console.log(error));
};
exports.connectToDb = connectToDb;
//# sourceMappingURL=connectDb.js.map