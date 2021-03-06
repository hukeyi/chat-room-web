/*
 * @Author: Hu Keyi
 * @Date: 2021-05-06 22:03:48
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-22 09:30:08
 */
import axios from '@/utils/axios.js';

const GetFriendListAll = () =>
	axios({
		url: '/api/friend/list',
		method: 'get',
	});

const PostDeleteFriend = (data) =>
	axios({
		url: '/api/friend/del',
		method: 'post',
		data: data,
	});

const PostChatWithFriend = (data) =>
	axios({
		url: '/api/friend/chat/start',
		method: 'post',
		data: data,
	});

export default {
	GetFriendListAll,
	PostDeleteFriend,
	PostChatWithFriend,
};
