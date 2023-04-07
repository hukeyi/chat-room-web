/**
 * Api for OpenAI model
 */
const express = require('express');
const router = express.Router();
const axios = require('axios');

const gpt_proxy_server_url = process.env.GPT_PROXY_SERVER_URL;

const gpt_chat_friend_post = async (req, res) => {
	if (!req.body && !req.body.prompt) {
		return res.status(400).json({
			message: 'Missing prompt. ',
		});
	}
	try {
		const prompt = req.body.prompt;
		const postData = {
			prompt,
		};
		const post_url = gpt_proxy_server_url + '/chat/friend';
		const response = await axios.post(post_url, postData);

		return res.status(200).json(response.data);
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: '服务器异常，请稍后',
		});
	}
};

// use: `POST xxxxxx.xxx/api/gpt/friend`
router.post('/friend', gpt_chat_friend_post);

module.exports = router;
