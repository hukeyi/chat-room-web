/*
 * @Author: Hu Keyi
 * @Date: 2021-05-07 20:33:37
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-09 20:21:30
 */

const cookieParser = require('cookie-parser');
const passportSocketIo = require('passport.socketio');
// fixme: 分离代码test
// const message = require('../models/message');
const passport = require('../configs/passport.config');

function onAuthorizeSuccess(data, accept) {
	console.log('successful connection to socket.io');
	accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
	if (error) throw new Error(message);
	console.log('failed connection to socket.io:', message);
	accept(null, false);
}

module.exports = function (server, store) {
	const io = require('socket.io')(server, {
		cors: {
			origin: ['http://localhost:8080'],
			methods: ['GET', 'POST', 'OPTIONS'],
			allowHeaders: ['Conten-Type', 'Authorization'],
			credentials: true,
		},
	});

	io.use(
		passportSocketIo.authorize({
			passport: passport,
			cookieParser: cookieParser,
			key: 'express.sid',
			secret: process.env.SESSION_SECRET,
			store: store,
			success: onAuthorizeSuccess,
			fail: onAuthorizeFail,
		})
	);
	// fixme: 分离不同部分的socket代码
	// e.g. message.js
	// message.init(io);
	io.on('connection', function (socket) {
		console.log('🎉 Yeah! User connected');
		// fixme: logout cannot trigger 'disconnect'
		// it'll be trigger after logout and refresh page
		socket.on('disconnect', function () {
			console.log('😈 Oops! User disconnected');
		});
	});
};
