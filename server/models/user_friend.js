/*
 * @Author: Hu Keyi
 * @Date: 2021-05-06 23:06:31
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-19 19:17:56
 */
const db = require('./db.js');
const { Model, DataTypes, sequelize } = db;

class UserFriend extends Model {}

UserFriend.init(
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
		friend_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: 'user',
				key: 'id',
			},
		},
		// todo: define status hash to string name
		status: {
			type: DataTypes.STRING(20),
			defaultValue: 'ok',
		},
		is_active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: 1,
		},
	},
	{ sequelize, modelName: 'UserFriend', tableName: 'user_friend' }
);

module.exports = UserFriend;
