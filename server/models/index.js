/*
 * @Author: Hu Keyi
 * @Date: 2021-05-19 17:00:28
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-19 17:24:32
 */

// Model的统一出口
// for config tables' associations

const User = require('./user.js');
const UserFriend = require('./user_friend.js');
const { Message } = require('./message.js');
const MessageRecipient = require('./message_recipient.js');

/**
 * for user_friend
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
 * for message
 */

Message.belongsToMany(User, {
	through: Message,
	foreignKey: 'sender_id',
});

/**
 * for message_recipient
 */

Message.hasOne(MessageRecipient);
MessageRecipient.belongsTo(Message, {
	foreignKey: 'message_id',
});

User.hasOne(MessageRecipient);
MessageRecipient.belongsTo(User, {
	foreignKey: 'recipient_id',
});
// todo: add foreign key for recipient_group_id

module.exports = {
	User,
	UserFriend,
	Message,
	MessageRecipient,
};
