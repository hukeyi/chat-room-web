/*
 * @Author: Hu Keyi
 * @Date: 2021-05-04 23:01:35
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-05 23:41:36
 */

const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
const SALT_LENGTH = 8;

const jsonwebtoken = require('jsonwebtoken');

const user_register_post = async (req, res, next) => {
	console.log(req.body);
	const { userId, name, password } = req.body;
	try {
		const user = await User.findOne({
			where: {
				phone: userId,
				is_active: true,
			},
		});
		if (!user) {
			const hash = await bcrypt.hash(password, SALT_LENGTH);
			const newUser = await User.create({
				phone: userId,
				name: name,
				password: hash,
			});
			console.log('New user created: ', newUser.id);
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
		console.log('controller user register', err);
		res.sendStatus(500);
	}
};

const user_login_post = async (req, res, next) => {
	const { userId, password } = req.body;
	// 用手机号登录
	try {
		const user = await User.findOne({
			where: {
				phone: userId,
				is_active: true,
			},
		});
		if (!user || !(await bcrypt.compare(password, user.password))) {
			// fixme: need json?
			res.sendStatus(401);
		} else {
			/**
			 * 生成jsonwebtoken
			 */
			const rule = { id: user.id, userId: user.phone };
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
								data: user,
								token: 'Bearer ' + token,
								message: 'Login success',
						  };
					res.status(err ? 500 : 200).json(jsonMsg);
				}
			);
		}
	} catch (err) {
		console.log('controller user login', err);
		res.sendStatus(500);
	}
};

module.exports = {
	user_register_post,
	user_login_post,
};
