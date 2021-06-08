/*
 * @Author: Hu Keyi
 * @Date: 2021-05-06 23:06:31
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-29 23:10:17
 */
const db = require('./db.js');
const { Model, DataTypes, sequelize } = db;

class UserRoom extends Model {}

UserRoom.init(
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
		room_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: 'user',
				key: 'id',
			},
		},
		is_admin: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		// todo: define status hash to string name
		title: {
			type: DataTypes.STRING(20),
			defaultValue: 'member',
		},
		create_date: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
		is_active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
	},
	{ sequelize, modelName: 'UserRoom', tableName: 'user_room' }
);

module.exports = UserRoom;
