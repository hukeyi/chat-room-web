// sql语句
let sqlMap = {
	user: {
		add: 'insert into user(id, name, age) values (0, ?, ?)',
	},
};

module.exports = sqlMap;
