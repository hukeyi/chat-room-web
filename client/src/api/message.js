import axios from '@/utils/axios.js';

const GetFriendChatAll = () =>
	axios({
		url: '/api/msg/friend/all',
		method: 'get',
	});

export default {
	GetFriendChatAll,
};
