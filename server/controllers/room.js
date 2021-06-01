/*
 * @Author: Hu Keyi
 * @Date: 2021-05-30 20:16:51
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-06-01 12:49:17
 */
const {
	Message,
	MessageRecipient,
	User,
	Room,
	UserRoom,
	sequelize,
	$,
} = require('../models/index');
const { toJSON } = require('./utils.js');

/**
 * api for database
 */

/**
 * 创建聊天室
 */

async function createRoom(creator_id, name, intro) {
	const room = await Room.create({
		intro,
		name,
		creator_id,
	});
	return UserRoom.create({
		user_id: creator_id,
		room_id: room.id,
		is_admin: true,
	});
}

/**
 * 根据id查找聊天室
 */

async function findRoomById(rid) {
	return Room.findOne({
		where: { id: rid },
		attributes: ['id', 'name', 'avatar', 'intro', 'create_date'],
	});
}

/**
 * 返回聊天室是否私密（用户加入是否需要审核）
 */

async function findRoomIsPrivate(rid) {
	const room = await Room.findOne({
		where: { id: rid },
		attributes: ['is_private'],
	});
	return room.is_private;
}

/**
 * 检查用户在聊天室的身份
 * @param {number} uid
 * @param {number} rid
 * @returns 'not member' 不属于聊天室; 'admin' 管理员; 'member' 普通成员
 */
async function checkUserAuth(uid, rid) {
	let right = await UserRoom.findOne({
		where: { user_id: uid, room_id: rid },
		attributes: ['is_admin', 'title'],
	});
	if (!right) {
		return 'not member';
	} else if (right.is_admin) {
		return 'admin';
	} else {
		return right.title;
	}
}

/**
 * 删除聊天室
 * 仅限管理员
 */

async function removeRoomById(uid, rid) {
	// check if user is admin
	const right = await checkUserAuth(uid, rid);
	console.log('room controller remove user right:', right);

	if (right == 'admin') {
		await UserRoom.destroy({
			where: { room_id: rid },
		});
		return Room.destroy({
			where: { id: rid },
		});
	}
	return Promise.reject('not authorized');
}

/**
 * 用户加入聊天室
 */

async function userAddRoomById(uid, rid) {
	return UserRoom.create({
		user_id: uid,
		room_id: rid,
		is_admin: false,
	});
}

/**
 * 查找用户加入的所有聊天室信息列表
 */

async function findAllRoomsByUserId(uid) {
	return UserRoom.findAll({
		where: { user_id: uid },
		include: [
			{
				attributes: [],
				model: Room,
				as: 'room_user_1_n',
			},
			{
				attributes: [],
				model: User,
				as: 'user_room_1_n',
			},
		],
		raw: true,
		attributes: [
			['room_id', 'id'],
			sequelize.col('room_user_1_n.name'),
			sequelize.col('room_user_1_n.avatar'),
			sequelize.col('room_user_1_n.intro'),
			sequelize.col('room_user_1_n.creator_id'),
			[sequelize.col('user_room_1_n.name'), 'creator_name'],
			['is_admin', 'isAdmin'],
		],
	});
}

/**
 * 查找用户加入的所有聊天室id列表
 */

async function findAllRoomIdsByUserId(uid) {
	const idList = toJSON(
		await UserRoom.findAll({
			where: { user_id: uid },
			include: [
				{
					attributes: [],
					model: Room,
					as: 'room_user_1_n',
				},
				{
					attributes: [],
					model: User,
					as: 'user_room_1_n',
				},
			],
			raw: true,
			attributes: [['room_id', 'id']],
		})
	);

	const res = [],
		len = idList.length;
	for (let i = 0; i < len; i++) {
		res.push(idList[i].id);
	}
	return res;
}

/**
 * 查找聊天室的所有成员信息列表
 */

async function findMemberListByRoomId(rid) {
	return UserRoom.findAll({
		where: { [$.and]: { room_id: rid }, [$.not]: { user_id: 1 } },
		include: [
			{
				attributes: [],
				model: User,
				as: 'user_room_1_n',
			},
		],
		raw: true,
		attributes: [
			['user_id', 'id'],
			sequelize.col('user_room_1_n.name'),
			sequelize.col('user_room_1_n.avatar'),
			sequelize.col('user_room_1_n.status'),
			'title',
			['is_admin', 'isAdmin'],
		],
	});
}

/**
 * 返回聊天室成员user_room.id列表
 */

async function findMemberIdListByRoomId(rid) {
	const idList = toJSON(
		await UserRoom.findAll({
			where: { room_id: rid },
			include: [
				{
					attributes: [],
					model: User,
					as: 'user_room_1_n',
				},
			],
			raw: true,
			attributes: ['id'],
		})
	);
	const res = [],
		len = idList.length;
	for (let i = 0; i < len; i++) {
		res.push(idList[i].id);
	}
	return res;
}

/**
 * 返回聊天室的管理员id
 */
async function findAdminIdByRoomId(rid) {
	const res = await UserRoom.findOne({
		where: { room_id: rid, is_admin: true },
		attributes: ['user_id'],
	});
	return res.user_id;
}

/**
 * 返回聊天室的聊天记录
 */

async function findChatHistoryByRoomId(rid) {
	const idList = toJSON(await findMemberIdListByRoomId(rid));
	console.log('find chat list, idList: ', idList);
	const chatList = await Message.findAll({
		where: {
			[$.or]: [
				{ sender_id: idList },
				{ '$MessageRecipient.recipient_group_id$': idList },
			],
			[$.and]: { '$MessageRecipient.recipient_id$': 1 },
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
			sequelize.col('User.name'),
			sequelize.col('User.avatar'),
			['create_date', 'time'],
			'content',
		],
		order: [['create_date', 'ASC']],
	});

	const len = chatList.length;
	for (let i = 0; i < len; i++) {
		chatList[i]['r_id'] = rid;
	}

	return toJSON(chatList);
}

/**
 * 返回用户加入的所有聊天室对应的成员信息列表和聊天记录
 */

async function findChatListByRoomId(rid) {
	try {
		const memberList = await findMemberListByRoomId(rid);
		const chatHistory = toJSON(await findChatHistoryByRoomId(rid));
		return { memberList, chatHistory };
	} catch (err) {
		console.log('room chatList get', err);
		return err;
	}
}

/**
 * controller for router
 */

const room_delete_post = async (req, res) => {
	try {
		await removeRoomById(req.user.id, req.body.rId);
		res.sendStatus(200);
	} catch (err) {
		console.log('room del post', err);
		res.status(500).json(err);
	}
};

const room_add_post = async (req, res) => {
	try {
		await userAddRoomById(req.user.id, req.body.rId);
		res.sendStatus(200);
	} catch (err) {
		console.log('room add post', err);
		res.status(500).json(err);
	}
};

const room_create_post = async (req, res) => {
	try {
		const room = await createRoom(req.user.id, req.body.name, req.body.intro);
		res.status(200).json({ id: room.room_id });
	} catch (err) {
		console.log('room create post', err);
		res.status(500).json(err);
	}
};

const room_list_get = async (req, res) => {
	try {
		const roomList = await findAllRoomsByUserId(req.user.id);
		res.status(200).json(roomList);
	} catch (err) {
		console.log('room list get', err);
		res.status(500).json(err);
	}
};

// 返回的是，一个用户加入的所有聊天室的成员列表和聊天记录
const room_chatList_get = async (req, res) => {
	try {
		const roomIdList = await findAllRoomIdsByUserId(req.user.id);
		console.log('roomIdList:', roomIdList);

		const len = roomIdList.length;
		const chatList = {};
		for (let i = 0; i < len; i++) {
			const rid = roomIdList[i];
			chatList[rid] = await findChatListByRoomId(rid);
		}
		res.status(200).json(chatList);
	} catch (err) {
		console.log('room chatList get', err);
		res.status(500).json(err);
	}
};

const room_search_post = async (req, res) => {
	try {
		const room = await findRoomById(req.body.rId);
		res.status(200).json(toJSON(room));
	} catch (err) {
		console.log('room search post', err);
		res.status(500).send(err);
	}
};

module.exports = {
	room_delete_post, //ok
	room_add_post, //ok
	room_create_post, //ok
	room_list_get, //ok
	room_chatList_get, //ok
	room_search_post, //ok

	findAdminIdByRoomId,
	findRoomIsPrivate,
};
