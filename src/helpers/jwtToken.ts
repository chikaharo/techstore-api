import jwt from "jsonwebtoken";

export const generateToken = (id: string) => {
	console.log("generate token id: ", id);
	return jwt.sign({ id }, process.env.JWT_SECRET as string, {
		expiresIn: "1d",
	});
};

export const generateRefreshToken = (id: string) => {
	console.log("generate refresh token id: ", id);
	return jwt.sign({ id }, process.env.JWT_SECRET as string, {
		expiresIn: "3d",
	});
};

module.exports = { generateRefreshToken };
