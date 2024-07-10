import express from "express";
import {
	createProduct,
	getaProduct,
	getProductBySlug,
	getAllProduct,
	updateProduct,
	deleteProduct,
	addToWishlist,
	rating,
	getSimilarProducts,
} from "../controllers/productController";
import {
	addToCart,
	deleteFromCart,
	getCart,
	removeFromCart,
} from "../controllers/cartController";
import { auth, retrictsTo } from "../middlewares/auth";
import schemaValidator from "../middlewares/schemaValidator";

const router = express.Router();

router.post(
	"/",
	auth,
	retrictsTo(["admin"]),
	schemaValidator("/product/create"),
	createProduct
);

router.get("/cart", auth, getCart);
router.get("/similar", getSimilarProducts);
router.get("/:slug", getProductBySlug);
router.get("/by-id/:id", getaProduct);

router.put("/add-cart", auth, addToCart);
router.put("/remove-cart", auth, removeFromCart);
router.put("/delete-cart", auth, deleteFromCart);

router.put("/wishlist", auth, addToWishlist);
router.put("/rating", auth, rating);

router.put(
	"/:id",
	auth,
	retrictsTo(["admin"]),
	schemaValidator("/product/update"),
	updateProduct
);
router.delete("/:id", auth, retrictsTo(["admin"]), deleteProduct);

router.get("/", getAllProduct);

export default router;
