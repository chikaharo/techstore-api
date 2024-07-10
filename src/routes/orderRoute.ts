import express from "express";
import { auth, retrictsTo } from "../middlewares/auth";
import {
	cancelOrder,
	createOrder,
	deleteOrder,
	getAllOrders,
	getOrder,
	updateOrder,
	userGetOrders,
} from "../controllers/orderController";
import schemaValidator from "../middlewares/schemaValidator";

const router = express.Router();

router.get("/", auth, retrictsTo(["admin"]), getAllOrders);
router.get("/user-orders", auth, userGetOrders);
// router.get("/:id", auth, getOrder);
router.post("/", auth, schemaValidator("/order/create"), createOrder);
router.put("/:id", auth, updateOrder);
router.put("/cancel/:id", auth, cancelOrder);
router.delete("/:id", auth, retrictsTo(["admin"]), deleteOrder);

export default router;
