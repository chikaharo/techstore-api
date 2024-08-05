import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export let mongodbUrl = `mongodb://${process.env.MONGO_ADMIN_USERNAME}:${process.env.MONGO_ADMIN_PASSWORD}@${process.env.MONGO_DATABASE_URL}`;

export const connectToDb = async () => {
	mongoose.Promise = Promise;
	// mongoose.connect(process.env.MONGODB_URL! as string);
	mongoose.connect(mongodbUrl);
	mongoose.connection.on("error", (error: Error) => console.log(error));
};
