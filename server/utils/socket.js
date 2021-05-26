/*
 * @Author: Hu Keyi
 * @Date: 2021-05-23 00:20:55
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-27 01:13:24
 */
// hash_key = user_id; hash_value = socket
// 同时，通过socketHash.keys()，可以发现用户的在线状态
// keys.includes(id) === true, 在线；否则离线
const socketMap = new Map();

const onSendFriendMsg = (socket) => {
	socket.on('private message', (targetId, msg) => {
		console.log('\n🌹received!', targetId, msg, socketMap.get(targetId));
		socket.to(socketMap.get(targetId)).emit('private message', socket.id, msg);
	});
};
const onDisconnect = (socket) => {
	socket.on('disconnect', function () {
		const userId = socket.request.user.id,
			socketId = socket.id;
		console.log('\n😈 Oops! User disconnected', userId, socketId);
		socketMap.delete(userId);
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

		socket.emit('private message', 1, 'can you get this');
		/**
		 * listeners
		 */
		onSendFriendMsg(socket);
		onDisconnect(socket);
	});
};
