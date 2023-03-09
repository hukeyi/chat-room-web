/**
 * 导出【初始化并开启 socket-io server】的入口函数
 */
/*
 * @Author: Hu Keyi
 * @Date: 2021-05-07 20:33:37
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2023-03-04 11:27:55
 */

const cookieParser = require('cookie-parser');
const passportSocketIo = require('passport.socketio');
const onSocketConnection = require('../configs/socket.config');
const passport = require('./passport');
const { Server } = require('socket.io');

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
	const hosts = [process.env.CLIENT_URL];
	if (process.env.NODE_ENV != 'production') {
		hosts.push('http://localhost:8080');
	}
	/**
	 * 初始化 socket-io server
	 */
	// 跨域设置
	const io = new Server(server, {
		cors: {
			origin: hosts,
			methods: ['GET', 'POST', 'OPTIONS'],
			allowHeaders: ['Conten-Type', 'Authorization'],
			credentials: true,
		},
	});
	// socket.io 使用 passport 加密/身份验证
	// 每次连接 socket 前，先经由 passport 进行
	// 身份验证（用户是否登录）然后才连接 socket
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
	/**
	 * 开启 socket connection 监听
	 */
	onSocketConnection(io);
};
