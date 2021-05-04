const User = require('../models/user.js');
const bcryptjs = require('bcryptjs');
const SALT_LENGTH = 8;

// Id, phone, email, password,
// name, avatar, gender, age, birth_date,
// status, create_date, is_active
User.register = async function (reqData) {
	console.log(reqData);
	const { userId, name, password } = reqData;
	try {
		// check if user existed
		const user = await User.findOne({
			where: {
				phone: userId,
				is_active: true,
			},
		});
		if (!user) {
			const hash = await bcryptjs.hash(password, SALT_LENGTH);
			return User.create({
				phone: userId,
				name: name,
				password: hash,
			});
		}
		return Promise.reject('phone used');
	} catch (err) {
		console.log('controller user register', err);
	}
};

User.login = async function (reqData) {
	const { userId, password } = reqData;
	// 用手机号登录
	try {
		const user = await User.findOne({
			where: {
				phone: userId,
				is_active: true,
			},
		});
		if (!user || !(await bcryptjs.compare(password, user.password))) {
			return Promise.reject('user not exists or password not right');
		}
		return user;
	} catch (err) {
		console.log('user login controller error', err);
		return Promise.reject('something went wrong');
	}
};

exports.user_register_post = (req, res, next) => {
	User.register(req.body)
		.then((result) => {
			res.json({ id: result.id });
		})
		.catch((err) => {
			console.log(err);
			res.json({ errorMsg: err });
		});
};

exports.user_login_post = (req, res, next) => {
	console.log(req.body);
	User.login(req.body)
		.then((result) => {
			res.json({
				id: result.id,
				name: result.name,
			});
		})
		.catch((err) => {
			console.log(err);
			res.json({
				errorMsg: err,
			});
		});
};
