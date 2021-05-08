/*
 * @Author: Hu Keyi
 * @Date: 2021-05-05 23:42:19
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-08 23:24:17
 */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.js');
const passport = require('../configs/passport.config.js');

router.post('/register', userController.user_register_post);
router.post(
	'/login',
	passport.authenticate('local'),
	userController.user_login_post
);
// todo: complete /logout
router.get('/logout', (req, res) => {
	req.logout();
	res.status(200).clearCookie('express.sid').json({ msg: 'logout success' });
});

router.get(
	'/testjwt',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		res.json({
			message: 'test jwt',
		});
	}
);

module.exports = router;
