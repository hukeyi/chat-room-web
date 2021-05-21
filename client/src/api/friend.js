/*
 * @Author: Hu Keyi
 * @Date: 2021-05-06 22:03:48
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-21 17:37:39
 */
import axios from '@/utils/axios.js';

const GetFriendListAll = () =>
	axios({
		url: '/api/friend/list',
		method: 'get',
	});

export default {
	GetFriendListAll,
	// GetFriendChatAll,
};
