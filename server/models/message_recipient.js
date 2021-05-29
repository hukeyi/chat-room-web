/*
 * @Author: Hu Keyi
 * @Date: 2021-05-07 20:43:37
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-30 00:30:16
 */

// 聊天消息接受者相关model
const db = require('./db.js');
const { Model, DataTypes, sequelize } = db;

class MessageRecipient extends Model {}

MessageRecipient.init(
	{
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
		},
		message_id: {
			allowNull: false,
			type: DataTypes.INTEGER.UNSIGNED,
			references: {
				model: 'message',
				key: 'id',
			},
		},
		recipient_id: {
			allowNull: false,
			type: DataTypes.INTEGER.UNSIGNED,
			defaultValue: 1,
			references: {
				model: 'user',
				key: 'id',
			},
		},
		recipient_group_id: {
			allowNull: false,
			type: DataTypes.INTEGER.UNSIGNED,
			defaultValue: 1,
			references: {
				model: 'user_room',
				key: 'id',
			},
		},
		is_receive: {
			type: DataTypes.BOOLEAN,
			defaultValue: 0,
		},
	},
	{ sequelize, modelName: 'MessageRecipient', tableName: 'message_recipient' }
);

module.exports = MessageRecipient;
