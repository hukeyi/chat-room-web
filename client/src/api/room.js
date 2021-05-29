/*
 * @Author: Hu Keyi
 * @Date: 2021-05-06 22:03:48
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-29 17:29:59
 */
import axios from '@/utils/axios.js';

const GetRoomListAll = () =>
	axios({
		url: '/api/room/list',
		method: 'get',
	});

const PostDeleteRoom = (data) =>
	axios({
		url: '/api/room/del',
		method: 'post',
		data: data,
	});

const SearchRooms = (data) =>
	axios({
		url: '/api/room/search',
		method: 'post',
		data: data,
	});

export default {
	GetRoomListAll,
	PostDeleteRoom,
	SearchRooms,
};
