/*
 * @Author: Hu Keyi
 * @Date: 2021-05-04 22:46:28
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-05 23:39:48
 */

// passport setting
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user.js');

const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = process.env.PASSPORT_JWT_SECRET;

// 身份验证策略
passport.use(
	new JwtStrategy(options, async function (jwt_payload, done) {
		console.log('jwtstrategy validate\n', jwt_payload);
		// fixme: 后面做邮箱验证的话，可能需要加一个字段判断是手机号还是邮箱
		try {
			const user = await User.findOne({ where: { id: jwt_payload.id } });
			console.log('----->jwt got userinfo from db:', user.id, user.name);

			// 用户不存在
			if (!user) {
				console.log('user not existed');
				return done(null, false);
			}
			// fixme: why jwt-strategy doesn't need password check?
			// // 密码不正确
			// if (!bcryptjs.compareSync(password, user.password)) {
			// 	console.log('wrong password');
			// 	return done(null, false);
			// }
			return done(null, user);
		} catch (err) {
			console.log('jwtstrategy went wrong', err);
			return done(err);
		}
	})
);

module.exports = passport;
