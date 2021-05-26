/*
 * @Author: Hu Keyi
 * @Date: 2021-05-22 23:39:12
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-27 00:51:08
 */

import { io } from 'socket.io-client';

export class Socket {
	constructor() {
		this.socket = null;
	}
	/**
	 * 开启socket
	 */
	open() {
		this.socket = io(process.env.VUE_APP_SERVER_URL, {
			withCredentials: true,
			transports: ['websocket'],
		});
		this.onConnect();
		this.onDisconnect();
		this.listener('private message', (fid, msg) => {
			console.log('receive!', fid, msg);
		});
	}
	/**
	 * 断开连接
	 */
	close() {
		this.socket.disconnect();
	}
	/**
	 * 自定义事件监听器
	 * @param {string} eventName 监听事件名称
	 * @param {function} handler 事件回调函数
	 */
	listener(eventName, handler) {
		if (this.socket) {
			this.socket.on(eventName, handler);
		}
	}
	/**
	 * 自定义事件触发器
	 * @param {string} eventName 触发事件名称
	 * @param {array} args 参数数组
	 */
	emitter(eventName, args) {
		if (this.socket) {
			this.socket.emit(eventName, ...args);
		}
	}
	/**
	 * 监听socket连接
	 */
	onConnect() {
		if (this.socket) {
			this.socket.on('connect', () => {
				console.log(this.socket.id, 'connect!');
				console.log('socket: ', this.socket);
			});
		}
	}
	/**
	 * 监听断开连接
	 */
	onDisconnect() {
		if (this.socket) {
			this.socket.on('disconnect', () => {
				console.log(this.socket.id, 'disconnect!');
			});
		}
	}
}
