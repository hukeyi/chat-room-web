const User = require('../models/user.js');
const bcryptjs = require('bcryptjs');
const SALT_LENGTH = 8;

// Id, phone, email, password,
// name, avatar, gender, age, birth_date,
// status, create_date, is_active
User.register = async function (phone, name, password) {
	console.log(phone, name, password);
	// check if user existed
	const user = await User.findOne({
		where: {
			phone: phone,
			is_active: true,
		},
	});
	if (!user) {
		const hash = await bcryptjs.hash(password, SALT_LENGTH);
		return User.create({
			phone: phone,
			name: name,
			password: hash,
		});
	}

	return Promise.reject('phone used');
};

User.login = async function (phone, password) {
	const user = await User.findOne({
		where: {
			phone: phone,
			is_active: true,
		},
	});
	if (!user || !(await bcryptjs.compare(password, user.password))) {
		return Promise.reject('user not exists or password not right');
	}
	return user;
};

exports.user_register_post = (req, res, next) => {
	User.register(req.body.phone, req.body.name, req.body.password)
		.then((result) => {
			res.json({ id: result.id });
		})
		.catch((err) => {
			console.log(err);
			res.json({ errorMsg: err });
		});
};

exports.user_login_post = (req, res, next) => {
	console.log(req.params, req.body);
	User.login(req.params.id, req.body.password)
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
