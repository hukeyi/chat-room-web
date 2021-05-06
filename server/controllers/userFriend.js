/*
 * @Author: Hu Keyi
 * @Date: 2021-05-06 20:18:26
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-06 23:02:16
 */
const UserFriend = require('../models/user_friend');
const User = require('../models/user');
const { toJSON, decodeToken } = require('./utils.js');

// api for db
async function findAllFriendsByUserId(userId) {
	const friends = await UserFriend.findAll({
		where: {
			user_id: userId,
			is_active: true,
		},
		attributes: ['friend_id'],
	});

	const idList = toJSON(friends).map((item) => item.friend_id);

	// then find them all in table user
	// to generate a new array with attributes
	// id, username, avator, gender, age, birth_date
	const friends_info = await User.findAll({
		where: {
			id: idList,
		},
		attributes: ['id', 'name', 'avator', 'gender', 'age', 'birth_date'],
	});
	return toJSON(friends_info);
}

const friend_add_post = (req, res) => {
	// find friend id in table user
	// if not exist, return a error json with status 200
	// if exist friend xx
	// first, send a message to xx
	// return a success json with status 200, remind user to wait for reply
};

const friend_list_get = async (req, res) => {
	let token = req.headers.authorization;
	const decoded = decodeToken(token);
	console.log(decoded);
	const list = await findAllFriendsByUserId(decoded.id);
	console.log('get list', list);
	// todo: get every friend's status through other api('on' or 'off')
	res.status(200).json(toJSON(list));
};

module.exports = {
	friend_add_post,
	friend_list_get,
};
