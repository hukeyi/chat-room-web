/*
 * @Author: Hu Keyi
 * @Date: 2021-05-09 20:18:09
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2023-03-11 14:39:54
 */

/**
 * utils config
 */

// [dotenv override](https://github.com/motdotla/dotenv#what-happens-to-environment-variables-that-were-already-set)
const dotenv = require('dotenv').config({ override: true });
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
const passport = require('./utils/passport.js');
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
const roomRouter = require('./routes/room');
/**
 * Middleware
 * [Using middleware](https://expressjs.com/en/guide/using-middleware.html#middleware.application)
 */
/**
 * CORS
 */
app.use(
	cors({
		origin: true,
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
		cookie: { secure: false }, // `secure: false` -> no need for https
		store: store,
		name: process.env.COOKIE_NAME, // name for the cookie to be stored in user's browser
	})
);

app.use(passport.initialize());
app.use(passport.session()); // alias for `passport.authenticate('session')`

/**
 * Routers
 */
app.use('/api/user', usersRouter);
app.use('/api/friend', friendsRouter);
app.use('/api/msg', messagesRouter);
app.use('/api/room', roomRouter);

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
	// print error message
	console.log('😈 Oops! Something went wrong.  \n', err);
	// render the error page
	return res.sendStatus(err.status || 500);
});

module.exports = { app, store };
