/*
 * @Author: Hu Keyi
 * @Date: 2021-05-20 12:19:14
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-30 00:30:02
 */
// create test data
const { $ } = require('./db');

module.exports = async function (models) {
	const { User, UserFriend, Message, MessageRecipient, Room, UserRoom } =
		models;
	const bcrypt = require('bcryptjs');
	const SALT_LENGTH = 8;
	const { toJSON } = require('../controllers/utils');

	const createTestUser = async (name, phone, password) => {
		const hash = await bcrypt.hash(password, SALT_LENGTH);
		return User.create({
			phone: phone,
			name: name,
			password: hash,
		});
	};
	const createTestRoom = async (name, creator_id, intro) => {
		const room = await Room.create({
			intro: intro,
			name: name,
			creator_id: creator_id,
		});
		return UserRoom.create({
			user_id: creator_id,
			room_id: room.id,
			is_admin: true,
		});
	};

	// 根据手机号，建立双向朋友关系
	const createTestUserFriend = async (u_id, f_id) => {
		const ids = await User.findAll({
			where: { phone: [u_id, f_id] },
			attributes: ['id'],
		});

		const id0 = ids[0].id,
			id1 = ids[1].id;

		return UserFriend.bulkCreate(
			[
				{ user_id: id0, friend_id: id1 },
				{ user_id: id1, friend_id: id0 },
			],
			{ validate: true }
		);
	};

	const createTestMessage = async (s_id, r_id, content, date) => {
		const ids = await User.findAll({
			where: { phone: [s_id, r_id] },
			attributes: ['id', 'phone'],
		});

		const [sid, rid] =
			ids[0].phone === s_id ? [ids[0].id, ids[1].id] : [ids[1].id, ids[0].id];

		const msgRes = await Message.create({
			sender_id: sid,
			content: content,
			create_date: date ? date : Date.now(),
		});

		await UserFriend.update(
			{ status: 'chat' },
			{
				where: {
					[$.or]: [
						{ user_id: sid, friend_id: rid },
						{ user_id: rid, friend_id: sid },
					],
				},
			}
		);

		return MessageRecipient.create({
			message_id: msgRes.id,
			recipient_id: rid,
			recipient_group_id: 1,
		});
	};
	/**
	 * test data for User
	 */
	await createTestUser('null', '', '');
	await createTestUser('test01', '13300000001', 'test');
	await createTestUser('test02', '13300000002', 'test');
	await createTestUser('test03', '13300000003', 'test');
	await createTestUser('test04', '13300000004', 'test');
	await createTestUser('test05', '13300000005', 'test');
	await createTestUser('test06', '13300000006', 'test');

	/**
	 * test data for Room and UserRoom
	 */
	await createTestRoom('null', 1, '');
	await createTestRoom('test-room1', 1, 'for test use');
	await createTestRoom('test-room2', 2, 'for test use');
	await createTestRoom('test-room3', 3, 'for test use');
	await createTestRoom('test-room4', 4, 'for test use');
	await createTestRoom('test-room5', 5, 'for test use');

	/**
	 * test data for user_friend
	 */
	await createTestUserFriend('13300000001', '13300000002');
	await createTestUserFriend('13300000001', '13300000003');
	await createTestUserFriend('13300000001', '13300000004');
	await createTestUserFriend('13300000001', '13300000006');
	await createTestUserFriend('13300000002', '13300000003');
	await createTestUserFriend('13300000002', '13300000004');
	await createTestUserFriend('13300000003', '13300000006');
	await createTestUserFriend('13300000005', '13300000006');

	/**
	 * test data for message
	 */
	await createTestMessage('13300000001', '13300000002', 'hi', undefined);
	await createTestMessage(
		'13300000002',
		'13300000001',
		'hello back',
		undefined
	);
	await createTestMessage(
		'13300000001',
		'13300000002',
		'how are you',
		undefined
	);
	await createTestMessage('13300000002', '13300000001', 'not bad', undefined);
	await createTestMessage('13300000001', '13300000004', 'hey you', undefined);
	await createTestMessage(
		'13300000001',
		'13300000004',
		'did you have a nice day',
		undefined
	);
	await createTestMessage(
		'13300000004',
		'13300000001',
		'nah, just fine',
		undefined
	);
	await createTestMessage('13300000001', '13300000004', 'ok', undefined);
	await createTestMessage(
		'13300000001',
		'13300000004',
		'wish you luck',
		undefined
	);
	await createTestMessage('13300000004', '13300000001', 'thanks', undefined);
};
