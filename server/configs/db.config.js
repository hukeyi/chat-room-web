// 数据库连接配置
module.exports = {
	// host: 'localhost',
	host: process.env.MYSQL_HOST,
	username: process.env.MYSQL_USER,
	// password: 'hky1024@', // ? 这个 password 是数据库 testdocker 的还是 user root 的？
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DB,
	port: process.env.MYSQL_PORT,
};
