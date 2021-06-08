/*
 * @Author: Hu Keyi
 * @Date: 2021-05-29 22:40:45
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-29 23:07:24
 */

const db = require('./db.js');
const { Model, DataTypes, sequelize } = db;

class Room extends Model {}

Room.init(
	{
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
		},
		name: {
			type: DataTypes.STRING(20),
			defaultValue: 'default room',
		},
		avatar: {
			type: DataTypes.STRING(200),
			defaultValue: '',
		},
		intro: {
			type: DataTypes.STRING(200),
		},
		is_private: {
			type: DataTypes.BOOLEAN,
			defaultValue: false, //默认开放
		},
		creator_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		create_date: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
		is_active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
	},
	{ sequelize, modelName: 'Room', tableName: 'room' }
);

module.exports = Room;
