/*
 * @Author: Hu Keyi
 * @Date: 2021-05-26 21:55:15
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-26 22:05:23
 */

/**
 * database相关model
 */
const db = require('./db.js');
const { Model, DataTypes, sequelize } = db;

class Socket extends Model {}

Socket.init(
	{
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
		},
		user_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: 'user',
				key: 'id',
			},
		},
		socket: {
			type: DataTypes.JSON,
		},
	},
	{ sequelize, modelName: 'Socket', tableName: 'socket' }
);

module.exports = Socket;
