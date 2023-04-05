/*
 * @Author: Hu Keyi
 * @Date: 2021-05-20 12:19:14
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2023-04-05 21:08:24
 */
// create default data
const { $ } = require('./db');

module.exports = async function (models) {
	const { User, Room, UserRoom } = models;
	const bcrypt = require('bcryptjs');
	const SALT_LENGTH = 8;

	const createDefaultUser = async (name, phone, password) => {
		const hash = await bcrypt.hash(password, SALT_LENGTH);
		return User.create({
			phone: phone,
			name: name,
			password: hash,
		});
	};
	const createDefaultRoom = async (name, creator_id, intro) => {
		const room = await Room.create({
			intro: intro,
			name: name,
			creator_id: creator_id,
		});
		return UserRoom.create({
			user_id: creator_id,
			room_id: room.id,
			is_admin: true,
		});
	};
	/**
	 * default data for User
	 */
	await createDefaultUser('null', '', '');

	/**
	 * default data for Room and UserRoom
	 */
	await createDefaultRoom('null', 1, '');
};
