/*
 * @Author: Hu Keyi
 * @Date: 2021-05-07 20:43:37
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-19 17:28:45
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
			type: DataTypes.INTEGER,
		},
		is_receive: {
			type: DataTypes.BOOLEAN,
		},
	},
	{ sequelize, modelName: 'MessageRecipient', tableName: 'message_recipient' }
);

MessageRecipient.sync()
	.then(() => console.log('MessageRecipient sync success'))
	.catch((err) => console.log('MessageRecipient sync error', err));

module.exports = MessageRecipient;
