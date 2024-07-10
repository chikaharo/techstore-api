"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uploadController_1 = require("../controllers/uploadController");
const uploadImage_1 = require("../middlewares/uploadImage");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.post("/", auth_1.auth, (0, auth_1.retrictsTo)(["admin"]), uploadImage_1.uploadPhoto.array("images", 10), uploadController_1.uploadImages);
router.get("/", (req, res) => {
    res.json({ message: "upload route ok" });
});
exports.default = router;
//# sourceMappingURL=uploadRoute.js.map