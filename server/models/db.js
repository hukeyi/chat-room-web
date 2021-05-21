const config = require('../configs/db.config.js');
const Sequelize = require('sequelize');
const { Model, DataTypes, Op } = Sequelize;

const SALT_LENGTH = 8;
const sequelize = new Sequelize(
	config.database,
	config.username,
	config.password,
	{
		host: config.host,
		port: config.port,
		dialect: 'mysql',
		timezone: '+08:00', //时区
		define: {
			timestamps: false,
		},
	}
);
//连接测试
sequelize
	.authenticate()
	.then(() => {
		console.log('mysql connection success');
	})
	.catch((err) => {
		throw new Error(err);
	});

module.exports = {
	sequelize,
	Model,
	DataTypes,
	SALT_LENGTH,
	$: Op,
};
