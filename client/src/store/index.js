import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

const userModule = {
	state: {
		userInfo: { id: 'test', name: 'test', avatar: '' },
		friendList: [],
		friendChatList: [],
	},
	getters: {
		getUserId: (state) => state.userInfo.id,
		getUserName: (state) => state.userInfo.name,
		getUserAvator: (state) => state.userInfo.avatar,
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
			state.userInfo.id = id;
		},
		SET_USERNAME(state, name) {
			state.userInfo.name = name;
		},
		SET_USERAVATOR(state, avatar) {
			state.userInfo.avatar = avatar;
		},
	},
	actions: {
		setUserId({ commit }, id) {
			commit('SET_USERID', id);
		},
		setUserName({ commit }, name) {
			commit('SET_USERNAME', name);
		},
		setUserAvator({ commit }, avatar) {
			commit('SET_USERAVATOR', avatar);
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
};

const msgModule = {
	state: {
		friendMsgList: {},
		roomMsgList: {},
	},
	getters: {
		getFMsgList: (state) => state.friendMsgList,
	},
	mutations: {
		PUSH_NEW_FMSG(state, f_id, history) {
			state.friendMsgList[f_id] = history ? history : [];
			// fixme: delete when finished
			console.log('test mutations push new fmsg', state.friendMsgList);
		},
	},
	actions: {
		updateFMsgList({ commit }, f_id, history) {
			commit('PUSH_NEW_FMSG', f_id, history);
		},
	},
};

const store = createStore({
	plugins: [createPersistedState({ storage: window.sessionStorage })],
	modules: { user: userModule, message: msgModule },
});

export default store;
