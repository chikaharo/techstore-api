import express, { Request, Response } from "express";
import {
	createColor,
	deleteColor,
	getColor,
	getallColor,
	updateColor,
} from "../controllers/colorController";
import schemaValidator from "../middlewares/schemaValidator";
import { auth, retrictsTo } from "../middlewares/auth";

const router = express.Router();

router.get("/", getallColor);
router.get("/:id", getColor);
router.post(
	"/",
	auth,
	retrictsTo(["admin"]),
	schemaValidator("/color/create"),
	createColor
);
router.put(
	"/:id",
	auth,
	retrictsTo(["admin"]),
	schemaValidator("/color/update"),
	updateColor
);
router.delete("/:id", auth, retrictsTo(["admin"]), deleteColor);

export default router;
