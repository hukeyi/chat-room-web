/*
 * @Author: Hu Keyi
 * @Date: 2021-05-19 16:27:34
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-22 10:20:12
 */
const {
	Message,
	MessageRecipient,
	User,
	$,
	sequelize,
} = require('../models/index.js');
const { toJSON } = require('./utils.js');
const { findAllFriendChatByUserId } = require('./userFriend');

/**
 * api for database
 */

async function findFChatHistoryById(userId) {
	const chatList = await Message.findAll({
		where: {
			[$.or]: [
				{ sender_id: userId },
				{ '$MessageRecipient.recipient_id$': userId },
			],
			is_active: true,
		},
		include: [
			{
				attributes: [], // 必须，不然所有属性都会包括在查询结果中
				model: MessageRecipient,
			},
			{
				attributes: [],
				model: User,
			},
		],
		raw: true,
		attributes: [
			['sender_id', 's_id'],
			[sequelize.col('MessageRecipient.recipient_id'), 'r_id'],
			sequelize.col('User.name'),
			sequelize.col('User.avatar'),
			['create_date', 'time'],
			'content',
		],
		order: [['create_date', 'ASC']],
	});

	return toJSON(chatList);
}

/**
 * controllers for route
 */

function sortChatHistoryByRId(uid, msgList, chatList) {
	while (msgList.length) {
		const f_id =
			uid === msgList[0].s_id
				? msgList[0].r_id.toString()
				: msgList[0].s_id.toString();
		chatList[f_id].chatHistory.push(msgList.shift());
	}
	console.log('test sort history', chatList);
	return chatList;
}

const friend_chatHistory_get = async (req, res) => {
	const uid = req.user.id;
	const list = await findFChatHistoryById(uid);
	const chatList = await findAllFriendChatByUserId(uid);
	for (let key in chatList) {
		chatList[key].chatHistory = [];
	}
	const resList = sortChatHistoryByRId(uid, list, chatList);
	res.status(200).json(resList);
};
module.exports = {
	friend_chatHistory_get,
};
