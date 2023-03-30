/*
 * @Author: Hu Keyi
 * @Date: 2021-05-05 23:56:53
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2023-03-30 23:11:43
 */
import axios from '@/utils/axios.js';
import bcrypt from 'bcryptjs';

const saltRounds = parseInt(process.env.VUE_APP_SALT_ROUNDS);

const Register = async (data) => {
	// encode user's password for security
	const password = data.password || '';
	const hashedPassword = await bcrypt.hash(password, saltRounds);
	if (data.password != null) data.password = hashedPassword;

	return axios({
		url: '/api/user/register',
		data: data,
		method: 'post',
	});
};

const Login = async (data) => {
	// encode user's password for security
	const password = data.password || '';
	const hashedPassword = await bcrypt.hash(password, saltRounds);
	if (data.password != null) data.password = hashedPassword;

	return axios({
		url: '/api/user/login',
		data: data,
		method: 'post',
	});
};

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

const serverUrl =
	process.env.NODE_ENV != 'production'
		? process.env.VUE_APP_SERVER_URL_LOCAL
		: process.env.VUE_APP_SERVER_URL; // 后端服务器 host 地址
const UpdateAvatar = serverUrl + '/api/user/update/avatar';
const DownloadAvatar = (uid) => serverUrl + '/api/user/download/avatar/' + uid;

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
