"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controllers/paymentController");
const router = express_1.default.Router();
router.post("/url", paymentController_1.payment);
router.post("/url1", paymentController_1.payment);
exports.default = router;
//# sourceMappingURL=paytmentRoute.js.map