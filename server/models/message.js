/*
 * @Author: Hu Keyi
 * @Date: 2021-05-07 20:43:37
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-07 23:47:26
 */

// 聊天消息相关model
// model/message.js
const message = {};

message.init = function (io) {
	io.on('connection', function (socket) {
		console.log('🎉a user connected');
		socket.on('chat message', function (msg) {
			io.emit('chat message', msg);
		});
		socket.on('disconnect', function () {
			console.log('user disconnected');
		});
	});
};

module.exports = message;
