/*
 * @Author: Hu Keyi
 * @Date: 2021-05-05 17:10:56
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2023-02-27 15:47:41
 */
import axios from 'axios';
import store from '../store/index';

// 前后端规定的code message 对照表
const statusHash = {
	200: '请求成功',
	401: '用户不存在或密码错误',
	402: 'token未生效',
	403: 'token已过期',
	404: 'token未找到',
	405: 'token被修改',
	406: '非法token',
	407: '非法请求',
	408: '重复提交',
	500: '系统繁忙，请稍后',
	501: '请求频繁，请稍后',
};

const service = axios.create({
	baseURL: '/',
	timeout: 10000,
	responseType: 'json',
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json;charset=UTF-8',
	},
});

// 请求拦截
service.interceptors.request.use(
	(config) => {
		const userId = store.getters.getUserId;
		// todo: loading or not, add after
		if (localStorage.getItem(`token_${userId}`)) {
			config.headers.Authorization = localStorage.getItem(
				`token_${userId}`
			);
		}
		return config;
	},
	(err) => {
		// todo: set loading false
		return Promise.reject(err);
	}
);

// 响应拦截
service.interceptors.response.use(
	(response) => {
		// only status 200 could reach here
		// todo: loading true
		return response.data;
	},
	(err) => {
		// catch status code except 200
		// fixme: is there always a response prop in err?
		let serverMsg;
		if (err.response.data) {
			serverMsg = err.response.data.message || err.response.data;
		}
		console.log('❌ axios response intercept\n', err);
		const msg = statusHash[Number(err.response.status)];
		return Promise.reject(
			serverMsg ? serverMsg : msg ? msg : '服务器异常，请稍后'
		);
	}
);

export default service;
