/*
 * @Author: Hu Keyi
 * @Date: 2021-05-07 20:43:37
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-19 19:18:07
 */

// 聊天消息相关model
// model/message.js

/**
 * socket相关函数
 * @param {*} io
 */
const init = function (io) {
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

/**
 * database相关model
 */
const db = require('./db.js');
const { Model, DataTypes, sequelize } = db;

class Message extends Model {}

Message.init(
	{
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
		},
		sender_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: 'user',
				key: 'id',
			},
		},
		type: {
			type: DataTypes.STRING(20),
		},
		content: {
			type: DataTypes.TEXT,
		},
		parent_message_id: {
			type: DataTypes.INTEGER.UNSIGNED,
		},
		create_date: {
			type: DataTypes.DATE,
		},
		is_active: {
			type: DataTypes.BOOLEAN,
		},
	},
	{ sequelize, modelName: 'Message', tableName: 'message' }
);

module.exports = {
	Message,
	socket: {
		init,
	},
};
