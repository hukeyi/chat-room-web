/*
 * @Author: Hu Keyi
 * @Date: 2021-05-04 23:01:35
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-23 20:52:58
 */

const { User, $ } = require('../models/index.js');
const bcrypt = require('bcryptjs');
const SALT_LENGTH = 8;
const jsonwebtoken = require('jsonwebtoken');
const { toJSON } = require('./utils.js');

/**
 * api for database
 */
function findUsers(id) {
	return User.findAll({
		where: {
			[$.or]: [{ id: id }, { phone: id }],
		},
		attributes: ['id', 'name', 'avatar', 'status'],
	});
}

const user_search_post = async (req, res, next) => {
	const { id } = req.body;
	console.log('\nsearch post', req.body);
	try {
		const users = await findUsers(id);
		console.log('\nuser search post', toJSON(users));
		res.status(200).json(toJSON(users));
	} catch (err) {
		res.status(500).send(err);
	}
};

const user_register_post = async (req, res, next) => {
	try {
		console.log(req.body);
		const { userId, name, password } = req.body;
		const user = await User.findOne({
			where: {
				phone: userId,
				is_active: true,
			},
			attributes: ['id', 'phone'],
		});
		if (!user) {
			const hash = await bcrypt.hash(password, SALT_LENGTH);
			const newUser = await User.create({
				phone: userId,
				name: name,
				password: hash,
			});
			console.log('\nNew user created: ', newUser.id);
			res.status(200).json({
				data: { id: newUser.id },
				message: 'User register success',
			});
		} else {
			res.status(401).json({
				message: 'User existed',
			});
		}
	} catch (err) {
		console.log('\ncontroller user register', err);
		res.sendStatus(500);
	}
};

const user_login_post = async (req, res, next) => {
	const { id, phone } = req.user;

	/**
	 * 生成jsonwebtoken
	 */
	const rule = { id: id, userId: phone };
	jsonwebtoken.sign(
		rule,
		process.env.PASSPORT_JWT_SECRET,
		{
			expiresIn: '7 days',
		},
		(err, token) => {
			const jsonMsg = err
				? {}
				: {
						data: req.user,
						token: 'Bearer ' + token,
						message: 'Login success',
				  };
			res.status(err ? 500 : 200).json(jsonMsg);
		}
	);
};

module.exports = {
	user_register_post,
	user_login_post,
	user_search_post,
};
