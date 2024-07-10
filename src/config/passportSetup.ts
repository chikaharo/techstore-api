import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/userModel";

passport.use(
	new LocalStrategy(async function (email, password, done) {
		console.log({ email });
		console.log([password]);
		const existingUser = await User.findOne({ email });
		// if (!existingUser) {
		// 	return done(null, false, { message: "User is not existed!" });
		// }
		// @ts-ignore
		if (existingUser) {
			return done(
				null,
				{ email, password, active: true },
				{ message: "authenticate successfully" }
			);
		}
	})
);

// passport.serializeUser(function{user, done }{
//     done(null, user.username);
// } )

passport.serializeUser(function (user, done) {
	process.nextTick(function () {
		done(null, { message: `user is ${user}` });
	});
});

passport.deserializeUser(function (user, done) {
	process.nextTick(function () {
		return done(null, {
			user,
		});
	});
});

export default passport;
