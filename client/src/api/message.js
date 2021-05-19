import axios from '@/utils/axios.js';

const GetFChatHistoryAll = () =>
	axios({
		url: '/api/msg/all',
		method: 'get',
	});

export default {
	GetFChatHistoryAll,
};
