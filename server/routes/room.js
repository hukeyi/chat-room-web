/*
 * @Author: Hu Keyi
 * @Date: 2021-05-06 20:20:16
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-06-01 14:01:28
 */
const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room.js');
const passport = require('../configs/passport.config.js');

router.get(
	'/list',
	passport.authenticate('jwt', { session: false }),
	roomController.room_list_get
);

router.get(
	'/chatList',
	passport.authenticate('jwt', { session: false }),
	roomController.room_chatList_get
);

router.post(
	'/add',
	passport.authenticate('jwt', { session: false }),
	roomController.room_add_post
);

router.post(
	'/del',
	passport.authenticate('jwt', { session: false }),
	roomController.room_delete_post
);

router.post(
	'/quit',
	passport.authenticate('jwt', { session: false }),
	roomController.room_quit_post
);

router.post(
	'/create',
	passport.authenticate('jwt', { session: false }),
	roomController.room_create_post
);

router.post(
	'/search',
	passport.authenticate('jwt', { session: false }),
	roomController.room_search_post
);

module.exports = router;
