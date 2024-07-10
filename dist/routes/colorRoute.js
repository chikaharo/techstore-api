"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const colorController_1 = require("../controllers/colorController");
const schemaValidator_1 = __importDefault(require("../middlewares/schemaValidator"));
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.get("/", colorController_1.getallColor);
router.get("/:id", colorController_1.getColor);
router.post("/", auth_1.auth, (0, auth_1.retrictsTo)(["admin"]), (0, schemaValidator_1.default)("/color/create"), colorController_1.createColor);
router.put("/:id", (0, schemaValidator_1.default)("/color/update"), colorController_1.updateColor);
router.delete("/:id", colorController_1.deleteColor);
exports.default = router;
//# sourceMappingURL=colorRoute.js.map