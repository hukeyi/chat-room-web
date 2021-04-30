var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	res.send('Hello World');
});

router.post('/test', function (req, res, next) {
	// res.render('index', { title: 'Test Nodemon' });
	res.json({ name: 'test' });
});

module.exports = router;
