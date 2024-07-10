import Joi, { ObjectSchema } from "joi";

const PASSWORD_REGEX = new RegExp(
	"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})"
);

const userRegister = Joi.object().keys({
	name: Joi.string().required(),
	email: Joi.string().email().required(),
	username: Joi.string().email().required(),
	password: Joi.string().pattern(PASSWORD_REGEX).min(8).required(),
	password_confirmation: Joi.string().pattern(PASSWORD_REGEX).min(8).required(),
});

const userLogin = Joi.object().keys({
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
});

const userChangePassword = Joi.object().keys({
	password: Joi.string().pattern(PASSWORD_REGEX).min(6).required(),
	password_confirmation: Joi.string().pattern(PASSWORD_REGEX).min(6).required(),
});

const brandCreate = Joi.object().keys({
	title: Joi.string().required(),
});

const brandUpdate = Joi.object().keys({
	title: Joi.string().required(),
});

const categoryCreate = Joi.object().keys({
	title: Joi.string().required(),
});
const categoryUpdate = Joi.object().keys({
	title: Joi.string().required(),
});
const colorCreate = Joi.object().keys({
	title: Joi.string().required(),
	value: Joi.string().required(),
});
const colorUpdate = Joi.object().keys({
	title: Joi.string().required(),
	value: Joi.string().required(),
});
const productCreate = Joi.object().keys({
	title: Joi.string().required(),
	description: Joi.string().required(),
	price: Joi.number().required(),
	quantity: Joi.number().required(),
	brand: Joi.string().required(),
	category: Joi.string().required(),
	colors: Joi.array().required(),
	images: Joi.array(),
	tags: Joi.string().valid("Special", "Popular", "Featured"),
});
const productUpdate = Joi.object().keys({
	title: Joi.string().required(),
	description: Joi.string().required(),
	price: Joi.number().required(),
	quantity: Joi.number().required(),
	brand: Joi.string().required(),
	category: Joi.string().required(),
	colors: Joi.array().required(),
	images: Joi.array(),
	tags: Joi.string().valid("Special", "Popular", "Featured"),
});

export default {
	"/user/login": userLogin,
	"/user/register": userRegister,
	"/user/change-password": userChangePassword,
	"/brand/create": brandCreate,
	"/brand/update": brandUpdate,
	"/category/create": categoryCreate,
	"/category/update": categoryUpdate,
	"/color/create": colorCreate,
	"/color/update": colorUpdate,
	"/product/create": productCreate,
	"/product/update": productUpdate,
} as { [key: string]: ObjectSchema };
