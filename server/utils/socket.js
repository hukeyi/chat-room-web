/*
 * @Author: Hu Keyi
 * @Date: 2021-05-23 00:20:55
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-23 00:47:54
 */

const onSendFriendMsg = (socket) => {
	socket.on('private message', (otherSocketId, msg) => {
		console.log('\n🌹received!', otherSocketId, msg);
		// socket.to(otherSocketId).emit('private message', socket.id, msg);
	});
};
const onDisconnect = (socket) => {
	socket.on('disconnect', function () {
		console.log('\n😈 Oops! User disconnected');
	});
};

module.exports = function (io) {
	io.on('connection', function (socket) {
		console.log('\n🎉 Yeah! User connected');

		/**
		 * listeners
		 */
		onSendFriendMsg(socket);
		onDisconnect(socket);
	});
};
