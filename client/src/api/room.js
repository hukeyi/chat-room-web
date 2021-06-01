/*
 * @Author: Hu Keyi
 * @Date: 2021-05-06 22:03:48
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-31 14:46:21
 */
import axios from '@/utils/axios.js';

const GetRoomListAll = () =>
	axios({
		url: '/api/room/list',
		method: 'get',
	});

const GetRoomChatListAll = () =>
	axios({
		url: '/api/room/chatList',
		method: 'get',
	});

const PostAddRoom = (data) => {
	axios({
		url: '/api/room/add',
		method: 'post',
		data: data,
	});
};

const PostDeleteRoom = (data) =>
	axios({
		url: '/api/room/del',
		method: 'post',
		data: data,
	});

const PostSearchRooms = (data) =>
	axios({
		url: '/api/room/search',
		method: 'post',
		data: data,
	});

const PostCreateRoom = (data) =>
	axios({
		url: '/api/room/create',
		method: 'post',
		data: data,
	});

export default {
	GetRoomListAll,
	PostDeleteRoom,
	PostSearchRooms,
	PostCreateRoom,
	GetRoomChatListAll,
	PostAddRoom,
};
