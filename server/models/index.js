/*
 * @Author: Hu Keyi
 * @Date: 2021-05-19 17:00:28
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-19 19:20:43
 */

// Model的统一出口
// for config tables' associations
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
	as: 'user', // must be defined in self-associations
	through: UserFriend,
	foreignKey: 'user_id',
});
User.belongsToMany(User, {
	as: 'friend', // must be defined in self-associations
	through: UserFriend,
	foreignKey: 'friend_id',
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

User.sync()
	.then(() => console.log('User sync success'))
	.catch((err) => console.log('User sync error', err));

UserFriend.sync()
	.then(() => console.log('UserFriend sync success'))
	.catch((err) => console.log('UserFriend sync error', err));

Message.sync()
	.then(() => console.log('Message sync success'))
	.catch((err) => console.log('Message sync error', err));

MessageRecipient.sync()
	.then(() => console.log('MessageRecipient sync success'))
	.catch((err) => console.log('MessageRecipient sync error', err));

module.exports = {
	User,
	UserFriend,
	Message,
	MessageRecipient,
};
