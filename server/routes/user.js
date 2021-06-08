/*
 * @Author: Hu Keyi
 * @Date: 2021-05-05 23:42:19
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-06-03 00:13:51
 */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.js');
const passport = require('../configs/passport.config.js');

/**
 * 上传图片相关
 */
const multer = require('multer');
const fs = require('fs');

const upload = multer({
	dest: 'upload/', //上传文件存放路径
});

router.post('/register', userController.user_register_post);
router.post(
	'/login',
	passport.authenticate('local'),
	userController.user_login_post
);
router.get('/logout', (req, res) => {
	req.logout();
	res.status(200).clearCookie('express.sid').json({ msg: 'logout success' });
});

router.post(
	'/search',
	passport.authenticate('jwt', { session: false }),
	userController.user_search_post
);

router.post(
	'/update/password',
	passport.authenticate('jwt', { session: false }),
	userController.user_update_password_post
);

router.post(
	'/update/info',
	passport.authenticate('jwt', { session: false }),
	userController.user_update_info_post
);

router.post(
	'/update/avatar',
	upload.single('avatar'),
	userController.user_update_avatar_post
);

router.get('/download/avatar/:uid', function (req, res) {
	res.sendFile(
		process.cwd() + '/upload/avatar_user_' + req.params.uid + '.jpg'
	);
});

module.exports = router;
