"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const categoryRoute_1 = __importDefault(require("./routes/categoryRoute"));
const colorRoute_1 = __importDefault(require("./routes/colorRoute"));
const brandRoute_1 = __importDefault(require("./routes/brandRoute"));
const productRoute_1 = __importDefault(require("./routes/productRoute"));
const uploadRoute_1 = __importDefault(require("./routes/uploadRoute"));
const paymentRoute_1 = __importDefault(require("./routes/paymentRoute"));
const orderRoute_1 = __importDefault(require("./routes/orderRoute"));
const connectDb_1 = require("./config/connectDb");
const errorHandler_1 = require("./middlewares/errorHandler");
const helmet_1 = __importDefault(require("helmet"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    credentials: true,
    origin: true,
}));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, express_mongo_sanitize_1.default)());
app.use(express_1.default.static(`${__dirname}/public`));
app.use((0, express_session_1.default)({
    name: process.env.COOKIE_NAME,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: connect_mongo_1.default.create({ mongoUrl: process.env.MONGODB_URL }),
    cookie: {
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    },
}));
app.use("/api/user/", userRoute_1.default);
app.use("/api/brand/", brandRoute_1.default);
app.use("/api/category/", categoryRoute_1.default);
app.use("/api/color/", colorRoute_1.default);
app.use("/api/product/", productRoute_1.default);
app.use("/api/upload/", uploadRoute_1.default);
app.use("/api/payment/", paymentRoute_1.default);
app.use("/api/order/", orderRoute_1.default);
app.use(errorHandler_1.errorHandler);
app.use(errorHandler_1.notFound);
const PORT = process.env.PORT || 2222;
const server = app.listen(PORT, () => {
    (0, connectDb_1.connectToDb)();
    console.log(`Server is running on port ${PORT}`);
});
process.on("unhandledRejection", (error) => {
    (0, errorHandler_1.logError)(error);
    server.close(() => {
        process.exit(1);
    });
});
process.on("uncaughtException", (error) => {
    (0, errorHandler_1.logError)(error);
    if (!(0, errorHandler_1.isOperationalError)(error)) {
        process.exit(1);
    }
});
//# sourceMappingURL=app.js.map