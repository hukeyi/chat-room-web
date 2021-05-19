/*
 * @Author: Hu Keyi
 * @Date: 2021-05-06 20:18:26
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-19 17:23:58
 */

const { UserFriend, User } = require('../models/index');
const { toJSON } = require('./utils.js');

/**
 * api for Database
 */
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
	// id, username, avatar, gender, age, birth_date
	const friends_info = await User.findAll({
		where: {
			id: idList,
		},
		attributes: ['id', 'name', 'avatar', 'gender', 'age', 'birth_date'],
	});
	return toJSON(friends_info);
}

async function findAllFriendChatByUserId(userId) {
	const friends = await UserFriend.findAll({
		where: {
			user_id: userId,
			status: 'chat',
			is_active: true,
		},
		attributes: ['friend_id'],
	});

	const idList = toJSON(friends).map((item) => item.friend_id);
	const chats_info = await User.findAll({
		where: {
			id: idList,
		},
		attributes: ['id', 'name', 'avatar', 'status'],
	});
	return toJSON(chats_info);
}

/**
 * Controllers for user_friend routes
 * @param {*} req
 * @param {*} res
 */
const friend_add_post = (req, res) => {
	// todo: add friend test
	// find friend id in table user
	// if not exist, return a error json with status 200
	// if exist friend xx
	// first, send a message to xx
	// return a success json with status 200, remind user to wait for reply
};

const friend_list_get = async (req, res) => {
	// req.user passed from passport.authenticated()
	// user pass the auth and its info will be store in req.user
	const list = await findAllFriendsByUserId(req.user.id);
	// get every friend's status through other api('on' or 'off')
	res.status(200).json(toJSON(list));
};

const friend_chatlist_get = async (req, res) => {
	const list = await findAllFriendChatByUserId(req.user.id);
	res.status(200).json(toJSON(list));
};
module.exports = {
	friend_add_post,
	friend_list_get,
	friend_chatlist_get,
};
