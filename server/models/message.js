/*
 * @Author: Hu Keyi
 * @Date: 2021-05-07 20:43:37
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-27 11:44:50
 */

/**
 * database相关model
 */
const db = require('./db.js');
const { Model, DataTypes, sequelize } = db;
const formateDate = require('../utils/time');

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
			get: function () {
				const formate = 'yy/MM/dd hh:mm:ss';
				const res = formateDate(formate, this.getDataValue('create_date'));
				console.log('\n⏰get create_date msg', res);
				return res;
			},
			set: function (value) {
				const formate = 'yy/MM/dd hh:mm:ss';
				const resDate = formateDate(formate, value);
				console.log('\n⏰set create_date msg', resDate);
				this.setDataValue('create_date', resDate);
			},
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
};
