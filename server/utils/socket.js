/*
 * @Author: Hu Keyi
 * @Date: 2021-05-23 00:20:55
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-28 00:41:54
 */

/**
 * database controller
 */
const { updateAddFriend } = require('../controllers/userFriend');

// hash_key = user_id; hash_value = socket
// 同时，通过socketHash.keys()，可以发现用户的在线状态
// keys.includes(id) === true, 在线；否则离线
const socketMap = new Map();

const onSendFriendMsg = (socket) => {
	// 好友私聊
	socket.on('private message', (targetId, msg) => {
		console.log('\n🌹received!', targetId, msg, socketMap.get(targetId));
		socket.to(socketMap.get(targetId)).emit('private message', socket.id, msg);
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
		console.log("\n👌let's be friend", socket.request.user.id, targetId, res);
		// insert new record to userfriend
		if (res) {
			await updateAddFriend(targetId, socket.request.user.id);
			socket.to(socket.id).emit('update friend list');
		}
		// notify proposer
		socket
			.to(socketMap.get(targetId))
			.emit('add friend response', socket.request.user, res);
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
		 * listeners
		 */
		onSendFriendMsg(socket);
		onDisconnect(socket);
		onSendNotice(socket);
	});
};
