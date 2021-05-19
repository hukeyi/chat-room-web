/*
 * @Author: Hu Keyi
 * @Date: 2021-05-06 22:03:48
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-19 12:11:27
 */
import axios from '@/utils/axios.js';

const GetFriendListAll = () =>
	axios({
		url: '/api/friend/list',
		method: 'get',
	});

const GetFriendChatAll = () =>
	axios({
		url: '/api/friend/chatlist',
		method: 'get',
	});

export default {
	GetFriendListAll,
	GetFriendChatAll,
};
