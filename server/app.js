/*
 * @Author: Hu Keyi
 * @Date: 2021-05-09 20:18:09
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-22 17:26:42
 */

/**
 * utils config
 */
const dotenv = require('dotenv').config();
const path = require('path');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

/**
 * express config
 */
const express = require('express');
const app = express();

/**
 * passport config
 */
const passport = require('./configs/passport.config.js');
const session = require('express-session');

/**
 * mysql store config
 */
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

/**
 * routers config
 */
const usersRouter = require('./routes/user');
const friendsRouter = require('./routes/userFriend');
const messagesRouter = require('./routes/message');
/**
 * Middleware
 */

/**
 * CORS
 */
app.use(
	cors({
		origin: [process.env.CLIENT_URL],
		methods: ['GET', 'POST', 'OPTIONS'],
		allowHeaders: ['Conten-Type', 'Authorization'],
	})
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Init session and passport
 */
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

/**
 * Routers
 */
app.use('/api/user', usersRouter);
app.use('/api/friend', friendsRouter);
app.use('/api/msg', messagesRouter);

/**
 * Error handler
 */
app.use(function (req, res, next) {
	next(createError(404));
});
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.sendStatus(err.status || 500);
});

module.exports = { app, store };
