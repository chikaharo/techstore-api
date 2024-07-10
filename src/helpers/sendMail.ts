import NodeMailer from "nodemailer";

export const sendEmail = async (data: NodemailerData) => {
	let transporter = NodeMailer.createTransport({
		host: "smtp.gmail.com",
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: process.env.MAIL_ID,
			pass: process.env.MP, //
		},
	});

	let info = await transporter.sendMail({
		from: `"Hey 👻" ${data.to} `,
		to: data.to,
		subject: data.subject,
		text: data.text,
		html: data.html,
	});

	console.log("Message sent: %s", info.messageId);
	// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

	// Preview only available when sending through an Ethereal account
	console.log("Preview URL: %s", NodeMailer.getTestMessageUrl(info));
	// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};
