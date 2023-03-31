/*
 * @Author: Hu Keyi
 * @Date: 2021-05-05 17:10:56
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2023-03-30 21:05:44
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
	405: '请求类型不支持',
	406: '非法用户 token',
	407: '非法请求',
	408: '重复提交',
	500: '系统繁忙，请稍后',
	501: '请求频繁，请稍后',
	502: '服务器错误，请稍后·',
};
const serverUrl = process.env.NODE_ENV != 'production'? process.env.VUE_APP_SERVER_URL_LOCAL: process.env.VUE_APP_SERVER_URL;
const service = axios.create({
	baseURL: serverUrl + '/',
	// baseURL: '/',
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
		return Promise.reject(error);
	}
);

// 响应拦截
service.interceptors.response.use(
	(response) => {
		// Any status code that lie within the range of 2xx cause this function to trigger
		// Do something with response data
		if (!response.data) {
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
			if (error.response.data) serverMsg = error.response.data.message; // 服务器返回的错误信息
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
