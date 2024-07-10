"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TransactionPayment = new mongoose_1.default.Schema({
    vnp_OrderInfo: String,
    vnp_CardType: String,
    vnp_BankTranNo: String,
    vnp_BankCode: String,
    vnp_Amount: String,
    vnp_TxnRef: String,
    vnp_TransactionNo: String,
    vnp_TmnCode: String,
    vnp_SecureHash: String,
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("TransactionPayments", TransactionPayment);
//# sourceMappingURL=transactionPaymentModel.js.map