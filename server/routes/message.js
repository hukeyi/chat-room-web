/*
 * @Author: Hu Keyi
 * @Date: 2021-05-19 21:11:00
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-22 13:19:48
 */
const express = require('express');
const router = express.Router();
const msgController = require('../controllers/message.js');
const passport = require('../configs/passport.config.js');

router.get(
	'/friend/all',
	passport.authenticate('jwt', { session: false }),
	msgController.friend_chatHistory_get
);

router.post(
	'/friend/send',
	passport.authenticate('jwt', { session: false }),
	msgController.friend_sendMsg_post
);

module.exports = router;
