/*
 * @Author: Hu Keyi
 * @Date: 2021-05-06 20:20:16
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-22 13:01:16
 */
const express = require('express');
const router = express.Router();
const friendController = require('../controllers/userFriend.js');
const passport = require('../configs/passport.config.js');

router.get(
	'/list',
	passport.authenticate('jwt', { session: false }),
	friendController.friend_list_get
);

router.post(
	'/add',
	passport.authenticate('jwt', { session: false }),
	friendController.friend_add_post
);

router.post(
	'/del',
	passport.authenticate('jwt', { session: false }),
	friendController.friend_delete_post
);

router.post(
	'/chat/start',
	passport.authenticate('jwt', { session: false }),
	friendController.friend_startChat_post
);

module.exports = router;
