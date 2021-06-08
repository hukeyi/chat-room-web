const db = require('./db.js');
const { Model, DataTypes, sequelize } = db;

class User extends Model {}

User.init(
	{
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER.UNSIGNED,
		},
		name: {
			type: DataTypes.STRING(20),
			defaultValue: 'default',
		},
		phone: {
			type: DataTypes.STRING(20),
			allowNull: true,
			unique: true,
		},
		email: {
			type: DataTypes.STRING(50),
			allowNull: true,
			unique: true,
		},
		password: {
			type: DataTypes.STRING(100),
			allowNull: false,
			defaultValue:
				'$2a$08$dTEdR4KI6M.76QDJZPCm4OBIEHrNmIoCuKDg2.jd41LD1b4YNc6fa',
		},
		avatar: {
			type: DataTypes.STRING(200),
		},
		gender: {
			type: DataTypes.CHAR(1),
		},
		age: {
			type: DataTypes.TINYINT,
			defaultValue: 0,
		},
		birth_date: {
			type: DataTypes.DATEONLY,
		},
		status: {
			type: DataTypes.STRING(40),
			defaultValue: 'off',
		},
		create_date: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
		is_active: {
			type: DataTypes.TINYINT,
			defaultValue: 1,
		},
	},
	{ sequelize, modelName: 'User', tableName: 'user' }
);

module.exports = User;
