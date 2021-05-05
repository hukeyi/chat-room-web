/*
 * @Author: Hu Keyi
 * @Date: 2021-05-05 23:56:53
 * @Last Modified by:   Hu Keyi
 * @Last Modified time: 2021-05-05 23:56:53
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

export default {
	Register,
	Login,
	Logout,
};
