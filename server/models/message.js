/*
 * @Author: Hu Keyi
 * @Date: 2021-05-07 20:43:37
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-22 20:50:48
 */

// 聊天消息相关model
// model/message.js

/**
 * socket相关函数
 * @param {*} io
 */
const init = (io, socket) => {
	// todo: 私聊发送消息
	socket.on('private message', (otherSocketId, msg) => {
		console.log('\n🌹received!', otherSocketId, msg);
		// socket.to(otherSocketId).emit('private message', socket.id, msg);
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
			defaultValue: DataTypes.NOW,
		},
		is_active: {
			type: DataTypes.BOOLEAN,
			defaultValue: 1,
		},
	},
	{ sequelize, modelName: 'Message', tableName: 'message' }
);

module.exports = {
	Message,
	msgSocket: {
		init,
	},
};
