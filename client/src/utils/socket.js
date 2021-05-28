/*
 * @Author: Hu Keyi
 * @Date: 2021-05-22 23:39:12
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-28 23:34:45
 */

import { io } from 'socket.io-client';
import store from '../store/index';
import friendApi from '../api/friend';

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
		/**
		 * 挂载监听
		 */
		/**
		 * 监听连接和断连
		 */
		this.onConnect();
		this.onDisconnect();
		/**
		 * 监听好友私聊
		 */
		this.listener('private message', async (fid, msg) => {
			console.log('store in socket.js', store.getters.allFriendChatList);
			console.log('receive!', fid, msg);
			await store.dispatch('addMsgToFriendChatList', { fid, msg });
		});
		/**
		 * 监听好友申请请求
		 */
		this.listener('add friend request', async (friendInfo, msg) => {
			console.log('get friend request!', friendInfo, msg);
			const detail = {
				id: friendInfo.id,
				name: friendInfo.name,
				avatar: friendInfo.avatar,
				gender: friendInfo.gender,
				age: friendInfo.age,
				birth_date: friendInfo.birth_date,
			};
			const notice = {
				title: '新好友申请',
				type: 'apply',
				content: `${friendInfo.name} 想要和你成为朋友！`,
				detail: detail,
			};
			await store.dispatch('addNoticeList', notice);
		});
		/**
		 * 监听好友申请响应
		 */
		this.listener('add friend response', async (friendInfo, res) => {
			console.log('get friend response!', friendInfo, res);
			const result = res
				? `${friendInfo.name}同意了你的好友请求！`
				: `${friendInfo.name}拒绝了你的好友请求。`;
			const notice = {
				type: 'apply_result',
				title: '好友申请结果',
				content: result,
			};
			// if (res) {
			// 	// 如果同意，更新好友列表
			// 	const friendList = await friendApi.GetFriendListAll();
			// 	await store.dispatch('setFriendListAll', friendList);
			// }
			await store.dispatch('addNoticeList', notice);
		});
		/**
		 * 监听服务器要求更新好友列表
		 */
		this.listener('update friend list', async () => {
			// store.dispatch('setFriendListAll', await friendApi.GetFriendListAll());
			const friendList = await friendApi.GetFriendListAll();
			await store.dispatch('setFriendListAll', friendList);
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
	 * @param {array} args 参数数组：把所有参数放在一个数组里
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
			});
		}
	}
	/**
	 * 监听断开连接
	 */
	onDisconnect() {
		if (this.socket) {
			this.socket.on('disconnect', () => {
				console.log('disconnect!');
			});
		}
	}
}
