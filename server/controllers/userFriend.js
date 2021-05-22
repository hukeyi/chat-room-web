/*
 * @Author: Hu Keyi
 * @Date: 2021-05-06 20:18:26
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-22 09:46:05
 */

const { UserFriend, User, sequelize, $ } = require('../models/index');
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
	return results;
}

async function removeFriendById(uid, fid) {
	return UserFriend.destroy({
		where: {
			[$.or]: [
				{ user_id: uid, friend_id: fid },
				{ user_id: fid, friend_id: uid },
			],
		},
	});
}

async function updateStatusChat(uid, fid, status) {
	return UserFriend.update(
		{ status: status },
		{
			where: {
				[$.or]: [
					{ user_id: uid, friend_id: fid },
					{ user_id: fid, friend_id: uid },
				],
			},
		}
	);
}

/**
 * Controllers for user_friend routes
 * @param {*} req
 * @param {*} res
 */
const friend_add_post = (req, res) => {
	// todo: add friend test
};

const friend_list_get = async (req, res) => {
	// req.user passed from passport.authenticated()
	// user pass the auth and its info will be store in req.user
	const list = await findAllFriendsByUserId(req.user.id);
	res.status(200).json(list);
};

const friend_delete_post = async (req, res) => {
	try {
		await removeFriendById(req.user.id, req.body.fid);
		res.sendStatus(200);
	} catch (err) {
		res.status(500).json(err);
	}
};

const friend_startChat_post = async (req, res) => {
	console.log('start chat', req.user.id, req.body.fid);
	updateStatusChat(req.user.id, req.body.fid, 'chat')
		.then(() => res.sendStatus(200))
		.catch((err) => res.status(500).send(err));
};

module.exports = {
	friend_add_post,
	friend_list_get,
	findAllFriendChatByUserId,
	friend_delete_post,
	friend_startChat_post,
};
