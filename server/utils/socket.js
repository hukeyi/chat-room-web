/*
 * @Author: Hu Keyi
 * @Date: 2021-05-23 00:20:55
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-06-01 21:22:16
 */

/**
 * database controller
 */
const { updateAddFriend } = require('../controllers/userFriend');
const {
	updateMsgToFriend,
	updateMsgToRoom,
	updateNoticeToRoom,
} = require('../controllers/message');
const {
	findAdminIdByRoomId,
	findRoomIsPrivate,
	findAllRoomIdsByUserId,
	findLatestMsgByRoomId,
} = require('../controllers/room');

// key = user_id; value = socket
const socketMap = new Map();
let roomSet = null;

const getTimeStamp = (time) => {
	return Date.parse(new Date(time));
};

const getRoomName = (rid) => {
	return 'room_' + rid;
};

const onSendFriendMsg = (socket) => {
	// 好友私聊
	socket.on('private message', async (targetId, msg) => {
		console.log(
			'\n🌹received!',
			targetId,
			msg,
			socketMap.get(Number(targetId))
		);
		const s_id = socket.request.user.id;
		await updateMsgToFriend(s_id, targetId, msg.content, msg.time);
		socket
			.to(socketMap.get(Number(targetId)))
			.emit('private message', String(s_id), msg);
	});
};
const onDisconnect = (socket) => {
	// 断开连接
	socket.on('disconnect', function () {
		const userId = socket.request.user.id,
			socketId = socket.id;
		console.log('\n😈 Oops! User disconnected', userId, socketId);
		socketMap.delete(userId);
	});
};
const onSendNotice = (socket) => {
	/**
	 * 好友申请
	 */

	// 朋友申请
	socket.on('add friend request', (targetId, msg) => {
		console.log('\n👬friend please', targetId, msg, socketMap.get(targetId));
		socket
			.to(socketMap.get(targetId))
			.emit('add friend request', socket.request.user, msg);
	});

	// 回应申请
	socket.on('add friend response', async (targetId, res) => {
		console.log(
			"\n👌let's be friend",
			socket.request.user.id,
			targetId,
			socket.id,
			res
		);
		// notify proposer
		socket
			.to(socketMap.get(targetId))
			.emit('add friend response', socket.request.user, res);
		// insert new record to userfriend
		if (res) {
			// accept
			await updateAddFriend(targetId, socket.request.user.id);
			socket.to(socketMap.get(targetId)).emit('update friend list');
			socket.emit('update friend list');
		}
	});

	/**
	 * 聊天室申请
	 */

	// 加入聊天室申请
	socket.on('add room request', async (targetId, msg) => {
		const isPrivate = await findRoomIsPrivate(targetId);
		console.log('add room is private', isPrivate);
		if (isPrivate) {
			const adminId = await findAdminIdByRoomId(targetId);
			console.log('\n👬add room please', targetId, msg, socketMap.get(adminId));
			const info = { user: socket.request.user, rId: targetId };
			socket.to(socketMap.get(adminId)).emit('add room request', info, msg);
		} else {
			// todo: alert admin for new member
			socket.emit('add room directly', targetId);
		}
	});

	// 回应申请
	socket.on('add room response', async (targetId, res) => {
		console.log('add room response', targetId, msg);
	});
};

const onRoomChat = async (io, socket) => {
	/**
	 * 加入聊天室
	 */

	socket.on('enter room', async (rid, uid, latestMsgTime) => {
		console.log(
			'\n💬 enter room#',
			rid,
			'userid',
			uid,
			'room before',
			socket.room
		);

		const room_name = 'room_' + rid;
		const room_before = socket.room;
		if (roomSet.has(room_name)) {
			socket.join(room_name);
			socket.room = room_name;

			const msg = {
				s_id: 1,
				r_id: 1,
				time: Date.now(),
				avatar: '',
				name: '',
				type: 'notice',
			};

			if (room_before && room_before !== room_name) {
				msg.content = `${socket.request.user.name} 离开聊天室`;
				await updateNoticeToRoom(msg.s_id, msg.r_id, msg.content, msg.time);
				const leave_id = room_before.split('_')[1];
				io.to(room_before).emit('group message', leave_id, msg);
			}
			msg.content = `${socket.request.user.name} 进入聊天室`;
			await updateNoticeToRoom(msg.s_id, msg.r_id, msg.content, msg.time);
			io.to(room_name).emit('group message', rid, msg);
		}
	});

	/**
	 * 聊天室群聊
	 */
	socket.on('group message', async (rid, msg) => {
		console.log('\n🌹receive group msg!', rid, msg, getRoomName(rid));
		const s_id = socket.request.user.id;
		await updateMsgToRoom(Number(s_id), Number(rid), msg.content, msg.time);
		socket.to(getRoomName(rid)).emit('group message', rid, msg);
	});
};

module.exports = function (io) {
	io.on('connection', async function (socket) {
		/**
		 * 初始化socket映射表和room集合
		 */

		const userId = socket.request.user.id,
			socketId = socket.id;
		console.log('\n🎉 Yeah! User connected', userId, socketId);
		socketMap.set(userId, socketId);
		console.log('socketMap', socketMap);

		const roomIdList = await findAllRoomIdsByUserId(userId);
		roomSet = new Set(roomIdList.map((item) => 'room_' + item));
		console.log('roomSet', roomSet);

		/**
		 * 挂载监听
		 */

		onSendFriendMsg(socket);
		onDisconnect(socket);
		onSendNotice(socket);
		onRoomChat(io, socket);
	});
};
