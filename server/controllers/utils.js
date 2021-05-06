/*
 * @Author: Hu Keyi
 * @Date: 2021-05-06 22:27:18
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-06 22:49:23
 */
const jwt = require('jsonwebtoken');

// convert query result to json
function toJSON(queryRes) {
	return JSON.parse(JSON.stringify(queryRes));
}

// decode jwt token to json
function decodeToken(token) {
	// check if token remove the header 'Bearer'
	if (token.split(' ')[0] === 'Bearer' || token.split(' ').length !== 1) {
		token = token.split(' ')[1];
	}
	return jwt.verify(
		token,
		process.env.PASSPORT_JWT_SECRET,
		(error, decoded) => {
			if (error) {
				console.log(error);
				return error;
			}
			return decoded;
		}
	);
}

module.exports = {
	toJSON,
	decodeToken,
};
