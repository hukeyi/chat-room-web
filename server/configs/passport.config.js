/*
 * @Author: Hu Keyi
 * @Date: 2021-05-04 22:46:28
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-04 22:51:47
 */

// passport setting
const passport = require('passport');
const LocalStrategy = require('passport-local');
// const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;

const bcryptjs = require('bcryptjs');
const User = require('../models/user.js');

// const options = {};
// options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// options.secretOrKey = process.env.PASSPORT_JWT_SECRET;

// serializeUser 在用户登录验证成功以后将会把用户的数据存储到 session 中（在这里
// 存到 session 中的是用户的 id user 应为我们之前在 new
// LocalStrategy (fution() { ... }) 中传递到回调函数 done 的参数 user 对象（从数据// 库中获取到的
passport.serializeUser((user, done) => {
	console.log('passport serialize user', user);
	done(null, user.id);
});
// deserializeUser 在每次请求的时候将会根据用户名读取 从 session 中读取用户的全部数据
// 的对象，并将其封装到 req.user
passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findOne({
			where: {
				id: id,
				is_active: true,
			},
		});
		console.log('passport deserialize user', user.id, user.name);
		done(null, user);
	} catch (err) {
		console.log('passport deserialize error', err);
		done(err);
	}
});
// 这是封装了一个中间件函数到 passport 中，
// 在需要拦截未验证的用户的请求的时候调用
passport.ensureAthenticated = function ensureAthenticated() {
	return function (req, res, next) {
		console.log('in ensureSthenticated process:');
		if (req.isAuthenticated()) {
			console.log('Permission allowed');
			//这里是passport在登录验证时已经设置好的加密cookie
			return next();
		}
		res.json({ errMsg: 'Permission denied' });
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
			console.log('passport validate', username, password);
			// fixme: 后面做邮箱验证的话，可能需要加一个字段判断是手机号还是邮箱
			try {
				const user = await User.findOne({ where: { phone: username } });
				console.log('-----> user ' + username + ' attempted to log in.');
				console.log('-----> user info from database:', user.id, user.name);

				// 用户不存在
				if (!user) {
					console.log('user not existed');
					return done(null, false);
				}
				// 密码不正确
				if (!bcryptjs.compareSync(password, user.password)) {
					console.log('wrong password');
					return done(null, false);
				}
				return done(null, user);
			} catch (err) {
				console.log('something went wrong', err);
				return done(err);
			}
		}
	)
);

module.exports = passport;
