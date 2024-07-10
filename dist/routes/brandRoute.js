"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const brandController_1 = require("../controllers/brandController");
const schemaValidator_1 = __importDefault(require("../middlewares/schemaValidator"));
const router = express_1.default.Router();
router.get("/", brandController_1.getallBrand);
router.get("/:id", brandController_1.getBrand);
router.post("/", auth_1.auth, (0, auth_1.retrictsTo)(["admin"]), (0, schemaValidator_1.default)("/brand/create"), brandController_1.createBrand);
router.put("/:id", auth_1.auth, (0, auth_1.retrictsTo)(["admin"]), (0, schemaValidator_1.default)("/brand/update"), brandController_1.updateBrand);
router.delete("/:id", auth_1.auth, (0, auth_1.retrictsTo)(["admin"]), brandController_1.deleteBrand);
exports.default = router;
//# sourceMappingURL=brandRoute.js.map