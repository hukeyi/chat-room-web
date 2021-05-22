/*
 * @Author: Hu Keyi
 * @Date: 2021-05-19 17:00:28
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-20 16:23:58
 */

// Model的统一出口
// for config tables' associations
const { $, sequelize } = require('./db');
const createTest = require('./create_test');
const User = require('./user.js');
const UserFriend = require('./user_friend.js');
const { Message } = require('./message.js');
const MessageRecipient = require('./message_recipient.js');

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

User.hasOne(MessageRecipient, {
	foreignKey: 'recipient_id',
});
MessageRecipient.belongsTo(User, {
	foreignKey: 'recipient_id',
});
// todo: add foreign key for recipient_group_id

/**
 * Sync tables
 */

sequelize
	.sync()
	.then(() => {
		console.log('\nAll tables sync success');
		// fixme: remember to delete this
		// createTest({ User, UserFriend, Message, MessageRecipient });
	})
	.catch((err) => console.log('\nSome tables sync error', err));

module.exports = {
	User,
	UserFriend,
	Message,
	MessageRecipient,
	$,
	sequelize,
};
