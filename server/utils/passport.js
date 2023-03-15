/*
 * @Author: Hu Keyi
 * @Date: 2021-05-04 22:46:28
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2023-03-11 16:10:10
 */

// passport setting
const passport = require('passport');

// const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');

const { User } = require('../models/index.js');
const { toJSON } = require('../controllers/utils');

// const options = {};
// options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// options.secretOrKey = process.env.PASSPORT_JWT_SECRET;

// 序列化与反序列化函数
passport.serializeUser((user, done) => {
	console.log('【Passport.js】serialize user', user.id);
	// serializeUser() sets req.session.passport.user = {id: 'xyz'}
	done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
	// deserializeUser() gets user id from req.session.passport.user and returns user object for req.user
	console.log('【Passport.js】deserialize user', id);
	const user = await User.findOne({
		where: {
			id: id,
		},
	});
	done(null, user);
});

// 在需要拦截未验证的用户请求时调用
passport.ensureAthenticated = function ensureAthenticated() {
	return function (req, res, next) {
		console.log('\n【Passport.js】in ensureSthenticated process:');
		if (req.isAuthenticated()) {
			console.log('-【Passport.js】Permission allowed');
			//这里是passport在登录验证时已经设置好的加密cookie
			return next();
		}
		console.log('-【Passport.js】Permission denied');
		res.json({ message: 'Permission denied' });
	};
};

/**
 * 注册两个不同的身份验证策略
 * local for login auth
 * jwt for session auth
 */

// 身份验证策略，声明 local 策略
// 使用此策略用：`passport.authenticate('local', ...)
// 用于用户登录验证
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
			// verify function
			// fixme: 后面做邮箱验证的话，可能需要加一个字段判断是手机号还是邮箱
			try {
				// find user in database and get the user info
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
				console.log(`【Passport.js】in Local strategy verify function`);
				console.log(
					'\n【Passport.js】user ' +
						username +
						' attempted to log in.'
				);

				// 用户不存在
				if (!user) {
					console.log('\n【Passport.js】user not existed');
					return done(null, false);
				}
				// 密码不正确
				if (!bcrypt.compareSync(password, user.password)) {
					console.log('\n【Passport.js】wrong password');
					return done(null, false);
				}
				console.log(
					`\n【Passport.js】user info from database: id ${user.id} name ${user.name}`
				);
				delete user.password;
				return done(null, user);
			} catch (err) {
				console.log('\n【Passport.js】something went wrong', err);
				return done(err);
			}
		}
	)
);

// 身份验证策略之二，声明 jwt 策略
// 使用此策略用：`passport.authenticate('jwt', ...)
// passport.use(
// 	new JwtStrategy(options, async function (jwt_payload, done) {
// 		// verify function
// 		// fixme: 后面做邮箱验证的话，可能需要加一个字段判断是手机号还是邮箱
// 		try {
// 			const user = await User.findOne({ where: { id: jwt_payload.id } });

// 			console.log(`【Passport.js】in jwt strategy verify function`);
// 			// 用户不存在
// 			if (!user) {
// 				console.log(`\n【Passport.js】${jwt_payload.id} not existed`);
// 				return done(null, false);
// 			}

// 			console.log(
// 				`\n【Passport.js】jwt got id: ${user.id} and name: ${user.name} from db`
// 			);
// 			return done(null, user);
// 		} catch (err) {
// 			console.log('\n【Passport.js】jwt went wrong', err);
// 			return done(err);
// 		}
// 	})
// );

module.exports = passport;
