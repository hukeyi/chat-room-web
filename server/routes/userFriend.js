/*
 * @Author: Hu Keyi
 * @Date: 2021-05-06 20:20:16
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-08 23:11:52
 */
const express = require('express');
const router = express.Router();
const friendController = require('../controllers/userFriend.js');
const passport = require('../configs/passport.config.js');

router.post('/add', friendController.friend_add_post);
router.get(
	'/list',
	passport.authenticate('jwt', { session: false }),
	friendController.friend_list_get
);

module.exports = router;
