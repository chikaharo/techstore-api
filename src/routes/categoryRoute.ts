import express, { Request, Response } from "express";
import {
	createCategory,
	deleteCategory,
	getCategory,
	getallCategory,
	updateCategory,
} from "../controllers/categoryController";
import schemaValidator from "../middlewares/schemaValidator";
import { auth, retrictsTo } from "../middlewares/auth";

const router = express.Router();

router.get("/", getallCategory);
router.get("/:id", getCategory);
router.post(
	"/",
	auth,
	retrictsTo(["admin"]),
	schemaValidator("/category/create"),
	createCategory
);
router.put(
	"/:id",
	auth,
	retrictsTo(["admin"]),
	schemaValidator("/category/update"),
	updateCategory
);
router.delete("/:id", auth, retrictsTo(["admin"]), deleteCategory);

export default router;
