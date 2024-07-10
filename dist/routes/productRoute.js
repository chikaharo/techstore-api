"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const cartController_1 = require("../controllers/cartController");
const auth_1 = require("../middlewares/auth");
const schemaValidator_1 = __importDefault(require("../middlewares/schemaValidator"));
const router = express_1.default.Router();
router.post("/", auth_1.auth, (0, auth_1.retrictsTo)(["admin"]), (0, schemaValidator_1.default)("/product/create"), productController_1.createProduct);
router.get("/cart", auth_1.auth, cartController_1.getCart);
router.get("/similar", productController_1.getSimilarProducts);
router.get("/:slug", productController_1.getProductBySlug);
router.get("/by-id/:id", productController_1.getaProduct);
router.put("/add-cart", auth_1.auth, cartController_1.addToCart);
router.put("/remove-cart", auth_1.auth, cartController_1.removeFromCart);
router.put("/delete-cart", auth_1.auth, cartController_1.deleteFromCart);
router.put("/wishlist", auth_1.auth, productController_1.addToWishlist);
router.put("/rating", auth_1.auth, productController_1.rating);
router.put("/:id", auth_1.auth, (0, auth_1.retrictsTo)(["admin"]), (0, schemaValidator_1.default)("/product/update"), productController_1.updateProduct);
router.delete("/:id", auth_1.auth, (0, auth_1.retrictsTo)(["admin"]), productController_1.deleteProduct);
router.get("/", productController_1.getAllProduct);
exports.default = router;
//# sourceMappingURL=productRoute.js.map