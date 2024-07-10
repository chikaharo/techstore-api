"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePayment = exports.payment = void 0;
const moment_1 = __importDefault(require("moment"));
const sortObject_1 = require("../helpers/sortObject");
const uuid_1 = require("uuid");
const orderModel_1 = __importDefault(require("../models/orderModel"));
const payment = (req, res, next) => {
    try {
        process.env.TZ = "Asia/Ho_Chi_Minh";
        let date = new Date();
        let createDate = (0, moment_1.default)(date).format("YYYYMMDDHHmmss");
        let ipAddr = req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        let vnp_TmnCode = process.env.VNP_TmnCode;
        let vnp_HashSecret = process.env.VNP_HashSecret;
        let vnp_Url = process.env.VNP_Url;
        let vnp_ReturnUrl = `${process.env.SERVER_URL}${process.env.VNP_ReturnUrl}`;
        let { locale, amount, info } = req.body;
        console.log(req.body);
        if (!locale) {
            locale = "vn";
        }
        const _id = (0, uuid_1.v4)();
        let currCode = "VND";
        let vnp_Params = {};
        vnp_Params["vnp_Version"] = "2.1.0";
        vnp_Params["vnp_Command"] = "pay";
        vnp_Params["vnp_TmnCode"] = vnp_TmnCode;
        vnp_Params["vnp_Locale"] = locale;
        vnp_Params["vnp_CurrCode"] = currCode;
        vnp_Params["vnp_TxnRef"] = _id;
        vnp_Params["vnp_OrderInfo"] = info;
        vnp_Params["vnp_OrderType"] = "other";
        vnp_Params["vnp_Amount"] = amount * 100;
        vnp_Params["vnp_ReturnUrl"] = vnp_ReturnUrl;
        vnp_Params["vnp_IpAddr"] = ipAddr;
        vnp_Params["vnp_CreateDate"] = createDate;
        vnp_Params = (0, sortObject_1.sortObject)(vnp_Params);
        let querystring = require("qs");
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");
        let hmac = crypto.createHmac("sha512", vnp_HashSecret);
        let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
        vnp_Params["vnp_SecureHash"] = signed;
        vnp_Url += "?" + querystring.stringify(vnp_Params, { encode: false });
        console.log({ vnp_Url });
        return res.json({
            status: "success",
            message: "Payment url",
            data: vnp_Url,
        });
    }
    catch (e) {
        next(e);
    }
};
exports.payment = payment;
const validatePayment = async (req, res) => {
    try {
        let vnp_Params = req.query;
        let secureHash = vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHashType"];
        vnp_Params = (0, sortObject_1.sortObject)(vnp_Params);
        let secretKey = process.env.VNP_HashSecret;
        let querystring = require("qs");
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
        if (secureHash !== signed) {
            throw new Error("payment failed");
        }
        if (vnp_Params.vnp_ResponseCode !== "00") {
            throw new Error(`Payment Failed Code: ${vnp_Params.vnp_ResponseCode}`);
        }
        const [_, orderId] = String(vnp_Params.vnp_OrderInfo).split("%3A+");
        console.log("vnp Order Info: ", vnp_Params);
        console.log({ orderId });
        await orderModel_1.default.findByIdAndUpdate(orderId, {
            orderStatus: "Processing",
        });
        return res.redirect("http://localhost:3000/cart/payment/success");
    }
    catch (e) {
        return res.redirect("http://localhost:3000/cart/payment/failed");
    }
};
exports.validatePayment = validatePayment;
//# sourceMappingURL=paymentController.js.map