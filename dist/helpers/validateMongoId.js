"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMongoDbId = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validateMongoDbId = (id) => {
    const isValid = mongoose_1.default.Types.ObjectId.isValid(id);
    return isValid;
    if (!isValid)
        throw new Error("This id is not valid or not Found");
};
exports.validateMongoDbId = validateMongoDbId;
//# sourceMappingURL=validateMongoId.js.map