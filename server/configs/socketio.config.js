/*
 * @Author: Hu Keyi
 * @Date: 2021-05-07 20:33:37
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-27 18:30:08
 */

const cookieParser = require('cookie-parser');
const passportSocketIo = require('passport.socketio');
const initSocket = require('../utils/socket');
const passport = require('../configs/passport.config');

function onAuthorizeSuccess(data, accept) {
	console.log('\nsuccessful connection to socket.io');
	accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
	if (error) throw new Error(message);
	console.log('\nfailed connection to socket.io:', message);
	accept(null, false);
}

module.exports = function (server, store) {
	const io = require('socket.io')(server, {
		cors: {
			origin: [process.env.CLIENT_URL],
			methods: ['GET', 'POST', 'OPTIONS'],
			allowHeaders: ['Conten-Type', 'Authorization'],
			credentials: true,
		},
	});

	io.use(
		passportSocketIo.authorize({
			passport: passport,
			cookieParser: cookieParser,
			key: process.env.COOKIE_NAME,
			secret: process.env.SESSION_SECRET,
			store: store,
			success: onAuthorizeSuccess,
			fail: onAuthorizeFail,
		})
	);
	initSocket(io);
};
