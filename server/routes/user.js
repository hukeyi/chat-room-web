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
router.get('/logout', (req, res) => {
	req.logout();
	res.status(200).clearCookie('express.sid');
	res.json({ msg: 'logout success' });
});

module.exports = router;
