const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// import api files
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');

// cors
const cors = require('cors');

const app = express();

// 后端设置跨域 cors
app.use(
	cors({
		origin: ['http://localhost:8080'],
		methods: ['GET', 'POST'],
		allowHeaders: ['Conten-Type', 'Authorization'],
	})
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 引进路由
app.use('/', indexRouter);
app.use('/api/user', usersRouter);

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
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
