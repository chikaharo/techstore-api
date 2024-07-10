import mongoose from "mongoose";
import "dotenv";

export const connectToDb = async () => {
	mongoose.Promise = Promise;
	console.log(process.env.MONGODB_URL! as string);
	mongoose.connect(process.env.MONGODB_URL! as string);

	mongoose.connection.on("error", (error: Error) => console.log(error));
};
