/*
 * @Author: Hu Keyi
 * @Date: 2021-05-04 22:46:28
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-06-02 13:37:36
 */

// passport setting
const passport = require('passport');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');

const { User } = require('../models/index.js');
const { toJSON } = require('../controllers/utils');

const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = process.env.PASSPORT_JWT_SECRET;

// 序列化与反序列化
passport.serializeUser((user, done) => {
	console.log('\n-----> serialize user', toJSON(user));
	done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
	console.log('\n-----> deserialize user', id);
	const user = await User.findOne({
		where: {
			id: id,
		},
	});
	done(null, user);
});

// 在需要拦截未验证的用户的请求的时候调用
passport.ensureAthenticated = function ensureAthenticated() {
	return function (req, res, next) {
		console.log('\n-----> in ensureSthenticated process:');
		if (req.isAuthenticated()) {
			console.log('\n-----> Permission allowed');
			//这里是passport在登录验证时已经设置好的加密cookie
			return next();
		}
		res.json({ message: 'Permission denied' });
	};
};
// 身份验证策略
passport.use(
	new LocalStrategy(
		{
			// 对应的前端this.$axios.post('/', postdata)
			// 中postdata = {username: data.name, password: data.pass};
			// 的两个字段名，后面回调函数的参数名不用改
			usernameField: 'userId',
			passwordField: 'password',
		},
		async function (username, password, done) {
			// fixme: 后面做邮箱验证的话，可能需要加一个字段判断是手机号还是邮箱
			try {
				const user = toJSON(
					await User.findOne({
						where: { phone: username, is_active: true },
						attributes: [
							'id',
							'name',
							'phone',
							'email',
							'avatar',
							'gender',
							'password',
							['birth_date', 'birthDate'],
							'status',
						],
					})
				);
				console.log('\n-----> user ' + username + ' attempted to log in.');

				// 用户不存在
				if (!user) {
					console.log('\n-----> user not existed');
					return done(null, false);
				}
				// 密码不正确
				if (!bcrypt.compareSync(password, user.password)) {
					console.log('\n-----> wrong password');
					return done(null, false);
				}
				console.log('\n-----> user info from database:', user.id, user.name);
				delete user.password;
				return done(null, user);
			} catch (err) {
				console.log('\n-----> something went wrong', err);
				return done(err);
			}
		}
	)
);

// 身份验证策略
passport.use(
	new JwtStrategy(options, async function (jwt_payload, done) {
		// fixme: 后面做邮箱验证的话，可能需要加一个字段判断是手机号还是邮箱
		try {
			const user = await User.findOne({ where: { id: jwt_payload.id } });
			console.log('\n----->jwt got userinfo from db:', user.id, user.name);

			// 用户不存在
			if (!user) {
				console.log('\n-----> user not existed');
				return done(null, false);
			}
			return done(null, user);
		} catch (err) {
			console.log('\n-----> jwtstrategy went wrong', err);
			return done(err);
		}
	})
);

module.exports = passport;
