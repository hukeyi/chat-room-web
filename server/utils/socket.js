/*
 * @Author: Hu Keyi
 * @Date: 2021-05-23 00:20:55
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-28 23:29:07
 */

/**
 * database controller
 */
const { updateAddFriend } = require('../controllers/userFriend');
const { updateMsgToFriend } = require('../controllers/message');

// hash_key = user_id; hash_value = socket
// 同时，通过socketHash.keys()，可以发现用户的在线状态
// keys.includes(id) === true, 在线；否则离线
const socketMap = new Map();

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
};

module.exports = function (io) {
	io.on('connection', function (socket) {
		// 维护socketHash表，用userid映射socketId
		const userId = socket.request.user.id,
			socketId = socket.id;
		console.log('\n🎉 Yeah! User connected', userId, socketId);
		socketMap.set(userId, socketId);
		console.log(socketMap);
		/**
		 * 挂载监听
		 */
		onSendFriendMsg(socket);
		onDisconnect(socket);
		onSendNotice(socket);
	});
};
