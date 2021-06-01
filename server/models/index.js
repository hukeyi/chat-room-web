/*
 * @Author: Hu Keyi
 * @Date: 2021-05-19 17:00:28
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-31 10:06:40
 */

// Model的统一出口
// for config tables' associations
const { $, sequelize } = require('./db');
const createTest = require('./create_test');
const User = require('./user.js');
const UserFriend = require('./user_friend.js');
const { Message } = require('./message.js');
const MessageRecipient = require('./message_recipient.js');
// const Socket = require('./socket');
const Room = require('./room');
const UserRoom = require('./user_room');

/**
 * Association configs
 */

/**
 * UserFriend
 */

User.belongsToMany(User, {
	as: 'user_n_m', // must be defined in self-associations
	through: UserFriend,
	foreignKey: 'user_id',
});
User.belongsToMany(User, {
	as: 'friend_n_m', // must be defined in self-associations
	through: UserFriend,
	foreignKey: 'friend_id',
});
User.hasMany(UserFriend, {
	foreignKey: 'user_id',
	as: 'user_1_n',
});
UserFriend.belongsTo(User, {
	foreignKey: 'user_id',
	as: 'user_1_n',
});
User.hasMany(UserFriend, {
	foreignKey: 'friend_id',
	as: 'friend_1_n',
});
UserFriend.belongsTo(User, {
	foreignKey: 'friend_id',
	as: 'friend_1_n',
});

/**
 * Room：一个用户可以创建多个聊天室；
 * 		一个聊天室只能有一个创建者
 */
User.hasMany(Room, {
	foreignKey: 'creator_id',
});
Room.belongsTo(User, {
	foreignKey: 'creator_id',
});

/**
 * UserRoom
 */
User.belongsToMany(Room, {
	as: 'user_room_n_m', // must be defined in self-associations
	through: UserRoom,
	foreignKey: 'user_id',
});
Room.belongsToMany(User, {
	as: 'room_user_n_m', // must be defined in self-associations
	through: UserRoom,
	foreignKey: 'room_id',
});
User.hasMany(UserRoom, {
	foreignKey: 'user_id',
	as: 'user_room_1_n',
});
UserRoom.belongsTo(User, {
	foreignKey: 'user_id',
	as: 'user_room_1_n',
});
Room.hasMany(UserRoom, {
	foreignKey: 'room_id',
	as: 'room_user_1_n',
});
UserRoom.belongsTo(Room, {
	foreignKey: 'room_id',
	as: 'room_user_1_n',
});
/**
 * Message
 */

User.hasMany(Message, {
	foreignKey: 'sender_id',
});
Message.belongsTo(User, {
	foreignKey: 'sender_id',
});

/**
 * MessageRecipient
 */

Message.hasOne(MessageRecipient, {
	foreignKey: 'message_id',
});
MessageRecipient.belongsTo(Message, {
	foreignKey: 'message_id',
});

User.hasMany(MessageRecipient, {
	foreignKey: 'recipient_id',
});
MessageRecipient.belongsTo(User, {
	foreignKey: 'recipient_id',
});
UserRoom.hasMany(MessageRecipient, {
	foreignKey: 'recipient_group_id',
});
MessageRecipient.belongsTo(UserRoom, {
	foreignKey: 'recipient_group_id',
});

/**
 * Socket
 */
// User.hasOne(Socket, {
// 	foreignKey: 'user_id',
// });
// Socket.belongsTo(User, {
// 	foreignKey: 'user_id',
// });

/**
 * 初始化 用户1和聊天室1，用于MessageRecipient表的区别
 */
async function InitUserAndRoom() {
	await User.create({
		name: 'null',
	});

	await Room.create({
		name: 'null',
		creator_id: 1,
	});
	return UserRoom.create({
		user_id: 1,
		room_id: 1,
		is_admin: true,
	});
}

/**
 * Sync tables
 */

sequelize
	.sync()
	.then(() => {
		console.log('\nAll tables sync success');
		// fixme: remember to delete this
		// createTest({ User, UserFriend, Message, MessageRecipient, Room, UserRoom });
	})
	.catch((err) => console.log('\nSome tables sync error', err));

module.exports = {
	User,
	UserFriend,
	Message,
	MessageRecipient,
	// Socket,
	Room,
	UserRoom,
	$,
	sequelize,
};
