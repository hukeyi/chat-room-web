/*
 * @Author: Hu Keyi
 * @Date: 2021-05-19 16:27:34
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-19 23:18:51
 */
const {
	Message,
	MessageRecipient,
	User,
	$,
	sequelize,
} = require('../models/index.js');
const { toJSON } = require('./utils.js');

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
	});

	return toJSON(chatList);
}

/**
 * controllers for route
 */
/**
 * "1": [
        {
        "s_id": "1",
        "r_id":"test",
        "name": "john",
        "avatar": "",
        "time": "21/04/24 12:01:09",
        "content": "hi, how are you",
    }
 */
const friend_chatHistory_get = async (req, res) => {
	const list = {};
	list['37'] = await findFChatHistoryById(req.user.id);
	console.log('list', list);
	res.status(200).json(list);
};
module.exports = {
	friend_chatHistory_get,
};
