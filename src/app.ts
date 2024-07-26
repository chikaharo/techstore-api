import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";

import UserRouter from "./routes/userRoute";
import CategoryRouter from "./routes/categoryRoute";
import ColorRouter from "./routes/colorRoute";
import BrandRouter from "./routes/brandRoute";
import ProductRouter from "./routes/productRoute";
import UploadRouter from "./routes/uploadRoute";
import PaymentRouter from "./routes/paymentRoute";
import OrderRouter from "./routes/orderRoute";
import { connectToDb } from "./config/connectDb";
import {
	notFound,
	errorHandler,
	logError,
	isOperationalError,
} from "./middlewares/errorHandler";

const app = express();
app.use(helmet());
app.use(
	cors({
		origin:
			process.env.NODE_ENV === "production"
				? process.env.CORS_ORIGIN_PROD
				: process.env.CORS_ORIGIN_DEV,
		credentials: true,
	})
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(mongoSanitize());
app.use(express.static(`${__dirname}/public`));
app.use(
	session({
		name: process.env.COOKIE_NAME,
		secret: process.env.SECRET as string,
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
		cookie: {
			maxAge: 1000 * 60 * 60, //one hour
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "none",
		},
	})
);

// ALL ROUTERS
app.use("/api/user/", UserRouter);
app.use("/api/brand/", BrandRouter);
app.use("/api/category/", CategoryRouter);
app.use("/api/color/", ColorRouter);
app.use("/api/product/", ProductRouter);
app.use("/api/upload/", UploadRouter);
app.use("/api/payment/", PaymentRouter);
app.use("/api/order/", OrderRouter);

app.use(errorHandler);
app.use(notFound);

const PORT = process.env.PORT || 2222;
const server = app.listen(PORT, () => {
	connectToDb();
	console.log(`Server is running on port ${PORT}`);
});

process.on("unhandledRejection", (error: Error) => {
	logError(error);
	server.close(() => {
		process.exit(1);
	});
});
process.on("uncaughtException", (error: Error) => {
	logError(error);

	if (!isOperationalError(error)) {
		process.exit(1);
	}
});
