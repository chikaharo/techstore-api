"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryController_1 = require("../controllers/categoryController");
const schemaValidator_1 = __importDefault(require("../middlewares/schemaValidator"));
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.get("/", categoryController_1.getallCategory);
router.get("/:id", categoryController_1.getCategory);
router.post("/", auth_1.auth, (0, auth_1.retrictsTo)(["admin"]), (0, schemaValidator_1.default)("/category/create"), categoryController_1.createCategory);
router.put("/:id", auth_1.auth, (0, auth_1.retrictsTo)(["admin"]), (0, schemaValidator_1.default)("/category/update"), categoryController_1.updateCategory);
router.delete("/:id", auth_1.auth, (0, auth_1.retrictsTo)(["admin"]), categoryController_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=categoryRoute.js.map