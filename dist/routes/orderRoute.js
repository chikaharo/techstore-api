"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const orderController_1 = require("../controllers/orderController");
const router = express_1.default.Router();
router.get("/", auth_1.auth, (0, auth_1.retrictsTo)(["admin"]), orderController_1.getAllOrders);
router.get("/user-orders", auth_1.auth, orderController_1.userGetOrders);
router.get("/:id", auth_1.auth, orderController_1.getOrder);
router.post("/", auth_1.auth, orderController_1.createOrder);
router.put("/:id", auth_1.auth, orderController_1.updateOrder);
router.put("/cancel/:id", auth_1.auth, orderController_1.cancelOrder);
router.delete("/:id", auth_1.auth, (0, auth_1.retrictsTo)(["admin"]), orderController_1.deleteOrder);
exports.default = router;
//# sourceMappingURL=orderRoute.js.map