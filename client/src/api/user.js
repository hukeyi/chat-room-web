/*
 * @Author: Hu Keyi
 * @Date: 2021-05-05 23:56:53
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2023-02-26 19:42:52
 */
import axios from '@/utils/axios.js';

const Register = (data) =>
	axios({
		url: '/api/user/register',
		data: data,
		method: 'post',
	});

const Login = (data) =>
	axios({
		url: '/api/user/login',
		data: data,
		method: 'post',
	});

const Logout = () =>
	axios({
		url: '/api/user/logout',
		method: 'get',
	});

const SearchUsers = (data) =>
	axios({
		url: '/api/user/search',
		method: 'post',
		data: data,
	});

const UpdatePass = (data) => {
	axios({
		url: '/api/user/update/password',
		method: 'post',
		data: data,
	});
};

const UpdateInfo = (data) => {
	axios({
		url: '/api/user/update/info',
		method: 'post',
		data: data,
	});
};

const server_url =
	process.env.SERVER_URL_RENDER != ''
		? process.env.SERVER_URL_RENDER
		: process.env.SERVER_URL;
const UpdateAvatar = server_url + '/api/user/update/avatar';
const DownloadAvatar = (uid) =>
	process.env.SERVER_URL + '/api/user/download/avatar/' + uid;

export default {
	Register,
	Login,
	Logout,
	SearchUsers,
	UpdatePass,
	UpdateInfo,
	UpdateAvatar,
	DownloadAvatar,
};
