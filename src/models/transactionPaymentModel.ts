import mongoose from "mongoose";
// Declare the Schema of the Mongo model
const TransactionPayment = new mongoose.Schema(
	{
		vnp_OrderInfo: String,
		vnp_CardType: String,
		vnp_BankTranNo: String,
		vnp_BankCode: String,
		vnp_Amount: String,
		vnp_TxnRef: String,
		vnp_TransactionNo: String,
		vnp_TmnCode: String,
		vnp_SecureHash: String,
	},
	{
		timestamps: true,
	}
);

//Export the model
export default mongoose.model("TransactionPayments", TransactionPayment);
