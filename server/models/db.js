const config = require('../configs/db.config.js');
const Sequelize = require('sequelize');
const { Model, DataTypes, Op } = Sequelize;

const SALT_LENGTH = 8;
const sequelize = new Sequelize(
	config.database,
	config.username,
	config.password,
	{
		dialect: 'mysql',
		dialectOptions: {
			host: config.host,
			port: config.port,
			timezone: '+08:00', //时区
			insecureAuth: true,
			// define: {
			// 	timestamps: false,
			// },
		},
	}
);
//连接测试
sequelize
	.authenticate()
	.then(() => {
		console.log('\nmysql connection success');
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
