/**
 * Request for GPT-model's response
 */
import axios from '@/utils/axios.js';

/**
 * 发送请求
 * @param {*} data { prompt: 'abc'}
 * @return {Object} { output: 'def', totalTokens: 'yy'}
 */
const FriendChat = async (data) => {
	const prompt = data.prompt || '';

	return axios({
		url: '/api/gpt/friend',
		data: { prompt },
		method: 'post',
	});
};

export default {
	FriendChat,
};
