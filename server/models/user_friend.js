/*
 * @Author: Hu Keyi
 * @Date: 2021-05-06 23:06:31
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-19 17:30:47
 */
const db = require('./db.js');
const { Model, DataTypes, sequelize } = db;
const User = require('./user.js');

class UserFriend extends Model {}

UserFriend.init(
	{
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: 'id',
			},
		},
		friend_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
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

UserFriend.sync()
	.then(() => console.log('UserFriend sync success'))
	.catch((err) => console.log('UserFriend sync error', err));

module.exports = UserFriend;
