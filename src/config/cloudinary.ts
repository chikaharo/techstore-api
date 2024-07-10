import { File } from "buffer";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryUploadImg = async (fileToUploads: string) => {
	return new Promise((resolve) => {
		cloudinary.uploader.upload(fileToUploads).then((result) => {
			console.log({ result });
			resolve(
				{
					url: result!.secure_url,
					asset_id: result!.asset_id,
					public_id: result!.public_id,
				},
				{
					resource_type: "auto",
				}
			);
		});
	});
};
export const cloudinaryDeleteImg = async (fileToDelete: string) => {
	return new Promise((resolve) => {
		cloudinary.uploader.destroy(fileToDelete).then((result) => {
			resolve(
				{
					url: result.secure_url,
					asset_id: result.asset_id,
					public_id: result.public_id,
				},
				{
					resource_type: "auto",
				}
			);
		});
	});
};
