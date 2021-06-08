/*
 * @Author: Hu Keyi
 * @Date: 2021-05-26 23:00:03
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-26 23:08:35
 */

const { Socket, $, sequelize } = require('../models/index.js');
const { toJSON } = require('./utils.js');

async function updateOrCreateSocket(userId, socket) {
	const socketJSON = toJSON(socket);
	const s = await Socket.findOne({
		where: { user_id: userId },
	});
	// socket存在，则更新；不存在，则创建新记录
	return s
		? Socket.update(
				{ socket: socketJSON },
				{
					where: { user_id: userId },
				}
		  )
		: Socket.create({
				user_id: userId,
				socket: socketJSON,
		  });
}

module.exports = { updateOrCreateSocket };
