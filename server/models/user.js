const db = require('./db.js');
const { Model, DataTypes, sequelize } = db;

class User extends Model {}

User.init(
	{
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		name: {
			type: DataTypes.STRING(20),
		},
		phone: {
			type: DataTypes.STRING(20),
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
	},
	{ sequelize, modelName: 'User', tableName: 'user' }
);
User.sync()
	.then(() => console.log('User sync success'))
	.catch((err) => console.log('User sync error', err));

module.exports = User;
