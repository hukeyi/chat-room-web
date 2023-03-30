/*
 * @Author: Hu Keyi
 * @Date: 2021-05-05 17:10:56
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2023-03-30 21:04:12
 */
import axios from 'axios';
import store from '../store/index';

// 前后端规定的 code message 对照表
const statusHash = {
	200: '请求成功',
	401: '用户不存在或密码错误',
	402: '用户 token 未生效',
	403: '用户 token 已过期',
	404: '用户 token 未找到',
	405: '用户 token 被修改',
	406: '非法用户 token',
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
		// Before request is sent
		const userId = store.getters.getUserId;
		// todo: loading or not, add after
		if (localStorage.getItem(`token_${userId}`)) {
			// 获取登录时生成的 Bearer jsonwebtoken
			// 作为 authorization，维护登录状态
			config.headers.Authorization = localStorage.getItem(
				`token_${userId}`
			);
		}
		return config;
	},
	(error) => {
		// When request error
		// todo: set loading false
		return Promise.reject(error);
	}
);

// 响应拦截
service.interceptors.response.use(
	(response) => {
		// Any status code that lie within the range of 2xx cause this function to trigger
		// Do something with response data
		// todo: loading true
		if (!response.data) {
			// fixme: 会出现状态码 2xx，但 response 无 data 属性的情况吗？
			console.log(
				`Response succeed but reponse.data is ${response.data}`
			);
		}
		return response.data || {};
	},
	(error) => {
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		// Do something with response error
		let serverMsg, msg;
		if (error.response) {
			// The request was made and the server responded with a status code
			// that falls out of the range of 2xx
			serverMsg =
				error.response.data != null
					? error.response.data.message
					: undefined; // 服务器返回的错误信息
			msg = statusHash[Number(error.response.status || 500)]; // 状态码代表的错误信息
			console.log(
				'The request was made and the server responded with a status code'
			);
		} else if (error.request) {
			// The request was made but no response was received
			console.log('The request was made but no response was received');
		} else {
			// Something happened in setting up the request that triggered an Error
			console.log(
				'Something wrong happened in setting up the request',
				error.message
			);
		}
		console.log('❌ Axios response intercept', error.toJSON());
		// 如果服务器有返回错误信息，则用服务器的；
		// 如果无，则用状态码的；
		// 如果状态码特殊，则默认'服务器异常...'
		return Promise.reject(
			serverMsg ? serverMsg : msg ? msg : '服务器异常，请稍后'
		);
	}
);

export default service;
