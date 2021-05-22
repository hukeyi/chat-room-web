/*
 * @Author: Hu Keyi
 * @Date: 2021-05-06 20:18:26
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-22 13:08:30
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

async function updateAddFriend(u_id, f_id) {
	const relation = await UserFriend.findOne({
		where: { user_id: u_id, friend_id: f_id },
	});
	if (relation) {
		return { message: 'Friend existed' };
	} else {
		return UserFriend.bulkCreate(
			[
				{ user_id: u_id, friend_id: f_id },
				{ user_id: f_id, friend_id: u_id },
			],
			{ validate: true }
		);
	}
}

/**
 * Controllers for user_friend routes
 * @param {*} req
 * @param {*} res
 * 	req.user passed from passport.authenticated()
 *  user pass the auth and
 *  its info will be store in req.user
 */

const friend_add_post = async (req, res) => {
	try {
		const result = await updateAddFriend(req.user.id, req.body.fid);
		res.status(200).json(result);
	} catch (err) {
		res.status(500).send(err);
	}
};

const friend_list_get = async (req, res) => {
	try {
		const list = await findAllFriendsByUserId(req.user.id);
		res.status(200).json(list);
	} catch (err) {
		res.status(500).send(err);
	}
};

const friend_delete_post = async (req, res) => {
	try {
		const result = await removeFriendById(req.user.id, req.body.fid);
		res.status(200).json(result);
	} catch (err) {
		res.status(500).json(err);
	}
};

const friend_startChat_post = async (req, res) => {
	try {
		console.log('start chat', req.user.id, req.body.fid);
		await updateStatusChat(req.user.id, req.body.fid, 'chat');
		res.sendStatus(200);
	} catch (err) {
		res.status(500).send(err);
	}
};

module.exports = {
	friend_add_post,
	friend_list_get,
	findAllFriendChatByUserId,
	friend_delete_post,
	friend_startChat_post,
};
