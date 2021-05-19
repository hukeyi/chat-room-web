/*
 * @Author: Hu Keyi
 * @Date: 2021-05-19 16:27:34
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-19 17:18:29
 */
const { Message } = require('../models/index.js');
const { toJSON } = require('./utils.js');

/**
 * api for database
 */
async function findFChatHisById(userid) {
	const friends = await Message.findAll({
		where: {
			user_id: userId,
			is_active: true,
		},
		attributes: ['friend_id'],
	});

	const idList = toJSON(friends).map((item) => item.friend_id);

	// then find them all in table user
	// to generate a new array with attributes
	// id, username, avatar, gender, age, birth_date
	const friends_info = await User.findAll({
		where: {
			id: idList,
		},
		attributes: ['id', 'name', 'avatar', 'gender', 'age', 'birth_date'],
	});
	return toJSON(friends_info);
}

/**
 * controllers for route
 */

module.exports = {};
