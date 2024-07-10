import mongoose from "mongoose";

export const validateMongoDbId = (id: string) => {
	const isValid = mongoose.Types.ObjectId.isValid(id);
	return isValid;
	if (!isValid) throw new Error("This id is not valid or not Found");
};
