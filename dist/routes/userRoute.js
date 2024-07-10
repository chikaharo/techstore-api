"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middlewares/auth");
const schemaValidator_1 = __importDefault(require("../middlewares/schemaValidator"));
const router = express_1.default.Router();
router.post("/register", (0, schemaValidator_1.default)("/user/register"), userController_1.createUser);
router.post("/send-otp", userController_1.sendOTP);
router.post("/login/password", (0, schemaValidator_1.default)("/user/login"), userController_1.login);
router.post("/logout", userController_1.logout);
router.post("/verify-otp", userController_1.verifyOTP);
router.get("/all-users", auth_1.auth, (0, auth_1.retrictsTo)(["admin"]), userController_1.getallUser);
router.get("/me", auth_1.auth, userController_1.getMe);
router.get("/wishlist", auth_1.auth, userController_1.getWishlist);
router.put("/change-password", auth_1.auth, (0, schemaValidator_1.default)("/user/login"), userController_1.changePassword);
exports.default = router;
//# sourceMappingURL=userRoute.js.map