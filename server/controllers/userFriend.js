/*
 * @Author: Hu Keyi
 * @Date: 2021-05-06 20:18:26
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-21 17:41:39
 */

const { UserFriend, User, sequelize } = require('../models/index');
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
		include: {
			model: User,
			as: 'friend_1_n',
			attributes: [],
		},
		raw: true, //必须，如果用sequelize.col的话，不然查询结果没属性
		attributes: [
			sequelize.col('friend_1_n.id'),
			sequelize.col('friend_1_n.name'),
			sequelize.col('friend_1_n.avatar'),
			sequelize.col('friend_1_n.gender'),
			sequelize.col('friend_1_n.age'),
			sequelize.col('friend_1_n.birth_date'),
			sequelize.col('friend_1_n.status'),
		],
	});
	return toJSON(friends);
}

async function findAllFriendChatByUserId(userId) {
	let chats_info = await UserFriend.findAll({
		where: {
			user_id: userId,
			status: 'chat',
			is_active: true,
		},
		include: {
			model: User,
			as: 'friend_1_n',
			attributes: [],
		},
		raw: true,
		attributes: [
			sequelize.col('friend_1_n.id'),
			sequelize.col('friend_1_n.name'),
			sequelize.col('friend_1_n.avatar'),
			sequelize.col('friend_1_n.status'),
		],
	});
	const results = {};
	chats_info = toJSON(chats_info);
	while (chats_info.length) {
		const label = chats_info[0].id.toString();
		results[label] = chats_info.shift();
	}
	// console.log('chatlist', results);
	return results;
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
	// console.log('list', list);
	// get every friend's status through other api('on' or 'off')
	res.status(200).json(list);
};
module.exports = {
	friend_add_post,
	friend_list_get,
	findAllFriendChatByUserId,
};
