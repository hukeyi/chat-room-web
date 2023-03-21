/*
 * @Author: Hu Keyi
 * @Date: 2021-05-04 23:01:35
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2023-03-21 21:13:33
 */

const { User, $ } = require('../models/index.js');
const bcrypt = require('bcryptjs');
const SALT_LENGTH = parseInt(process.env.SALT_LENGTH);
const jsonwebtoken = require('jsonwebtoken');
const { toJSON } = require('./utils.js');
const fs = require('fs');

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

function findUserPassById(id) {
	return User.findOne({
		where: {
			id: id,
		},
		attributes: ['password'],
	});
}

async function updateUserPass(id, newPass) {
	// update: newPass is hashed by frontend
	// const hash = await bcrypt.hash(newPass, SALT_LENGTH);
	return User.update(
		{ password: newPass },
		{
			where: { id },
		}
	);
}

function updateUserInfo(id, colName, newValue) {
	return User.update(
		{ [`${colName}`]: newValue },
		{
			where: { id },
		}
	);
}

function updateUserAvatar(id, newValue) {
	return User.update(
		{ avatar: newValue },
		{
			where: { id },
		}
	);
}

function updateUserInfoAll(id, name, email, gender, birth_date) {
	return User.update(
		{
			name,
			email,
			gender,
			birth_date,
		},
		{
			where: { id },
		}
	);
}
/**
 * compare password, if match return true
 *
 * @param {*} password hashed password send by user
 * @param {*} storedPassword hashed one stored in database
 */
const isPasswordMatch = async (password, storedPassword) => {
	const salt = await bcrypt.genSalt(SALT_LENGTH);
	// hash the user password again
	// make sure the SALT_LENGTH is equal to frontend
	const hashedPassword = await bcrypt.hash(password, salt);
	// compare the double-hashed password with
	// the one stored in database
	const isMatch = await bcrypt.compare(hashedPassword, storedPassword);
	return isMatch;
};

const user_search_post = async (req, res, next) => {
	try {
		const { id } = req.body;
		console.log('\nsearch post', req.body);

		let users = null;
		if (id != 1) users = await findUsers(id);
		console.log('\nuser search post', toJSON(users));
		res.status(200).json(toJSON(users));
	} catch (err) {
		res.status(500).send(err);
	}
};

const user_update_info_post = async (req, res, next) => {
	try {
		const { id } = req.user;
		const { name, email, gender, birth_date } = req.body;
		await updateUserInfoAll(
			id,
			name,
			email,
			gender,
			Date.parse(new Date(birth_date))
		);
		res.sendStatus(200);
	} catch (err) {
		res.status(500).json(err);
	}
};

const user_update_avatar_post = async (req, res, next) => {
	try {
		console.log('👮‍♀️receive avatar', req.file);
		const avatar = req.file;
		const uid = req.query.uid;
		const filename = 'avatar_user_' + uid + '.jpg';

		fs.renameSync('upload/' + avatar.filename, 'upload/' + filename);
		await updateUserAvatar(uid, filename);
		res.sendFile(process.cwd() + '/upload/' + filename);
	} catch (err) {
		res.status(500).json(err);
	}
};

const user_update_password_post = async (req, res, next) => {
	const { id } = req.user;
	console.log('\nchange password post', req.body);
	const { exPass, newPass } = req.body;
	try {
		const user = toJSON(await findUserPassById(id));
		console.log('\nuser change password post', user);
		// 密码不正确
		// if (!bcrypt.compareSync(exPass, user.password)) {
		if (!isPasswordMatch(exPass, user.password)) {
			console.log('\nwrong password');
			res.status(401).json('密码错误，认证失败');
		} else {
			await updateUserPass(id, newPass);
			res.sendStatus(200);
		}
	} catch (err) {
		res.status(500).json(err);
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
			// updated: hash in frontend
			// const hash = await bcrypt.hash(password, SALT_LENGTH);
			const newUser = await User.create({
				phone: userId,
				name: name,
				password: password,
			});
			console.log('\nNew user created: ', newUser.id);
			return res.status(200).json({
				data: { id: newUser.id },
				message: 'User register success',
			});
		} else {
			return res.status(401).json({
				message: 'User existed',
			});
		}
	} catch (err) {
		console.log('\n😈 controller user register\n', err);
		return res.sendStatus(500);
	}
};

const user_login_post = async (req, res, next) => {
	const { id, phone } = req.user;

	// 这里不需要验证密码
	// 密码验证在 passport.authenticate('local') 里做了

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
			return res.status(err ? 500 : 200).json(jsonMsg);
		}
	);
};

module.exports = {
	user_register_post,
	user_login_post,
	user_search_post,
	user_update_password_post,
	user_update_info_post,
	user_update_avatar_post,
	isPasswordMatch,
};
