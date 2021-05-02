const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.js');

router.post('/', userController.user_register_post);
router.post('/:id', userController.user_login_post);

module.exports = router;
