const dotenv = require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const app = express();

// fixme: delete =======
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
	cors: {
		origin: ['http://localhost:8080'],
		methods: ['GET', 'POST', 'OPTIONS'],
		allowHeaders: ['Conten-Type', 'Authorization'],
		credentials: true,
	},
});
const passportSocketIo = require('passport.socketio');
// ===================

// passport config
const passport = require('./configs/passport.config.js');
const session = require('express-session');
// connect-mysql config
const MysqlStore = require('express-mysql-session')(session);
const dbConfig = require('./configs/db.config');
const storeOptions = {
	host: dbConfig.host,
	user: dbConfig.username,
	password: dbConfig.password,
	database: dbConfig.database,
	port: dbConfig.port,
};
const store = new MysqlStore(storeOptions);

// import api files
const usersRouter = require('./routes/user');
const friendsRouter = require('./routes/userFriend');
// 后端设置跨域 cors
app.use(
	cors({
		origin: ['http://localhost:8080'],
		methods: ['GET', 'POST', 'OPTIONS'],
		allowHeaders: ['Conten-Type', 'Authorization'],
	})
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session and passport setting
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: true,
		saveUninitialized: true,
		cookie: { secure: false },
		store: store,
		key: 'express.sid',
	})
);
app.use(passport.initialize());
app.use(passport.session());
console.log('app.js', passport._key);

// fixme: ===================
function onAuthorizeSuccess(data, accept) {
	console.log('successful connection to socket.io');

	accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
	if (error) throw new Error(message);
	console.log('failed connection to socket.io:', message);
	accept(null, false);
}

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

io.on('connection', (socket) => {
	console.log('🎉user connected');

	socket.on('disconnect', () => {
		console.log('A user has disconnected');
	});
});
// ==========================

// 引进路由
app.use('/api/user', usersRouter);
app.use('/api/friend', friendsRouter);

// 错误网络代码处理：
// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.sendStatus(err.status || 500);
});

// module.exports = app;
http.listen(process.env.PORT || 3000, () => {
	console.log('Listening on port ' + (process.env.PORT || 3000));
});
