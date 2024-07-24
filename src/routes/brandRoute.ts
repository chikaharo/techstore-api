import express from "express";
import { auth, retrictsTo } from "../middlewares/auth";
import {
	createBrand,
	deleteBrand,
	getBrand,
	getallBrand,
	updateBrand,
} from "../controllers/brandController";
import schemaValidator from "../middlewares/schemaValidator";

const router = express.Router();

router.get("/", getallBrand);
router.get("/:id", getBrand);
router.post(
	"/",
	// auth,
	// retrictsTo(["admin"]),
	schemaValidator("/brand/create"),
	createBrand
);
router.put(
	"/:id",
	// auth,
	// retrictsTo(["admin"]),
	schemaValidator("/brand/update"),
	updateBrand
);
router.delete(
	"/:id",
	// auth,
	// retrictsTo(["admin"]),
	deleteBrand
);

export default router;
