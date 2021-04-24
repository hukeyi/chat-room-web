import { createStore } from 'vuex';

const store = createStore({
	state: {
		user: { id: 'test', name: 'testName', avator: '' },
		friendList: [
			{ id: '0', name: 'frank', avator: '', status: 'on' },
			{ id: '1', name: 'john', avator: '', status: 'off' },
			{ id: '2', name: 'mary', avator: '', status: 'on' },
		],
		friendChatList: [
			{ id: '1', name: 'john', avator: '', status: 'off' },
			{ id: '2', name: 'mary', avator: '', status: 'on' },
		],
	},
	getters: {
		getUserId: (state) => state.user.id,
		getUserName: (state) => state.user.name,
		getUserAvator: (state) => state.user.avator,
		/**
		 * 返回全部好友私聊列表
		 * @param {*} state
		 * @returns
		 */
		allFriendChatList: (state) => state.friendChatList,
		/**
		 * 返回全部好友列表
		 * @param {*} state
		 * @returns
		 */
		allFriends: (state) => state.friendList,
		/**
		 * 返回在线好友列表
		 * @param {*} state
		 * @returns
		 */
		onFriends(state) {
			return state.friendList.filter((item) => item.status === 'on');
		},
		/**
		 * 返回离线好友列表
		 * @param {*} state
		 * @returns
		 */
		offFriends(state) {
			return state.friendList.filter((item) => item.status === 'off');
		},
		/**
		 * 查找对应好友ID的好友数组下标
		 * @param {*} state
		 * @param {*} id
		 * @returns
		 */
		getFriendIndexById: (state) => (id) => {
			return state.friendList.findIndex((item) => item.id === id);
		},
		/**
		 * 查找对应好友ID的好友私聊数组下标
		 * @param {*} state
		 * @param {*} id
		 * @returns
		 */
		getFriendChatIndexById: (state) => (id) => {
			return state.friendChatList.findIndex((item) => item.id === id);
		},
	},
	mutations: {
		SET_USERID(state, id) {
			state.user.id = id;
		},
		SET_USERNAME(state, name) {
			state.user.name = name;
		},
		SET_USERAVATOR(state, avator) {
			state.user.avator = avator;
		},
	},
	actions: {
		setUserId({ commit }, id) {
			commit('SET_USERID', id);
		},
		setUserName({ commit }, name) {
			commit('SET_USERNAME', name);
		},
		setUserAvator({ commit }, avator) {
			commit('SET_USERAVATOR', avator);
		},
		/**
		 * 根据好友id删除好友
		 * @param {*} state
		 * @param {*} id 要删除等好友id
		 * @returns 删除的好友信息对象；若id不存在，返回null
		 */
		deleteFriendById({ getters, state }, id) {
			const index = getters.getFriendIndexById(id);
			console.log('firendlist', id, index, state.friendList[index]);

			return index !== -1 ? state.friendList.splice(index, 1) : null;
		},
		/**
		 * 根据id删除对应好友私聊框
		 * @param {*} state
		 * @param {*} id 好友id
		 * @returns
		 */
		deleteFriendChatById({ getters, state }, id) {
			const index = getters.getFriendChatIndexById(id);
			console.log('friendChatList', id, index, state.friendChatList[index]);
			return index !== -1 ? state.friendChatList.splice(index, 1) : null;
		},
		/**
		 * 用好友id查找，当前私聊列表中是否有该好友
		 * @param {*} state
		 * @param {*} id
		 * @return true: 是；false：否
		 */
		findFriendChatById({ getters }, id) {
			const index = getters.getFriendChatIndexById(id);
			return index !== -1;
		},
	},
	modules: {},
});

export default store;
