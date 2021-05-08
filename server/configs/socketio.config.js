/*
 * @Author: Hu Keyi
 * @Date: 2021-05-07 20:33:37
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-08 16:43:51
 */

const cookieParser = require('cookie-parser');
const passportSocketIo = require('passport.socketio');
// fixme: test! import model and use io to init them
const message = require('../models/message');

function onAuthorizeSuccess(data, accept) {
	console.log('successful connection to socket.io');
	accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
	if (error) throw new Error(message);
	console.log('failed connection to socket.io:', message);
	accept(null, false);
}

module.exports = function (server) {
	console.log('------>test socket io start<-------');
	const io = require('socket.io')(server);

	io.use(
		passportSocketIo.authorize({
			cookieParser: cookieParser,
			key: 'express.sid',
			secret: process.env.SESSION_SECRET,
			success: onAuthorizeSuccess,
			fail: onAuthorizeFail,
		})
	);

	// init socketio model here
	// e.g. message.js
	// message.init(io);
	// fixme: test client/server socket io connection
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
