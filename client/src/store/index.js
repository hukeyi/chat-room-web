import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

const userModule = {
	state: {
		userInfo: { id: 'default', phone: 'xxxxxx', name: 'default', avatar: '' },
		friendList: [],
		friendChatList: {},
	},
	getters: {
		getUserId: (state) => state.userInfo.id,
		getUserName: (state) => state.userInfo.name,
		getUserPhone: (state) => state.userInfo.phone,
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
			return state.friendList.findIndex((item) => item.id == id);
		},
		/**
		 * 根据好友id查找与好友的聊天历史记录
		 * @param {*} state
		 * @param {*} id
		 * @returns
		 */
		getFriendChatHistoryById: (state) => (id) => {
			return state.friendChatList[id].chatHistory;
		},
		/**
		 * 返回全部好友私聊信息数组，不包括记录
		 */
		getFriendChatInfoList: (state, getters) => {
			const chatInfoList = [];
			for (let key in state.friendChatList) {
				const index = getters.getFriendIndexById(key);
				chatInfoList.push(state.friendList[index]);
			}
			return chatInfoList;
		},
	},
	mutations: {
		SET_USERID(state, id) {
			state.userInfo.id = id;
		},
		SET_USERNAME(state, name) {
			state.userInfo.name = name;
		},
		SET_USERPHONE(state, phone) {
			state.userInfo.phone = phone;
		},
		SET_USERAVATOR(state, avatar) {
			state.userInfo.avatar = avatar;
		},
		INIT_FRIENDLIST(state, friendList) {
			state.friendList = friendList;
		},
		INIT_FRIENDCHATLIST(state, chatList) {
			state.friendChatList = chatList;
		},
		REMOVE_FRIENDBYID(state, id) {
			const index = state.friendList.findIndex((item) => item.id == id);
			state.friendList.splice(index, 1);
		},
		REMOVE_FRIENDCHATBYID(state, id) {
			delete state.friendChatList[id];
		},
	},
	actions: {
		setUserId({ commit }, id) {
			commit('SET_USERID', id);
		},
		setUserName({ commit }, name) {
			commit('SET_USERNAME', name);
		},
		setUserPhone({ commit }, phone) {
			commit('SET_USERPHONE', phone);
		},
		setUserAvator({ commit }, avatar) {
			commit('SET_USERAVATOR', avatar);
		},
		setFriendListAll({ commit }, friendList) {
			commit('INIT_FRIENDLIST', friendList);
		},
		/**
		 * 初始化好友私聊列表
		 * @param {} param0
		 * @param {*} chatList
		 */
		setFriendChatListAll({ commit }, chatList) {
			commit('INIT_FRIENDCHATLIST', chatList);
		},
		/**
		 * 根据好友id删除好友d
		 * @param {*} state
		 * @param {*} id 要删除等好友id
		 * @returns 删除的好友信息对象和私聊列表；若id不存在，返回null
		 */
		deleteFriendById({ commit }, id) {
			commit('REMOVE_FRIENDBYID', id);
			commit('REMOVE_FRIENDCHATBYID', id);
		},
		/**
		 * 根据id删除对应好友私聊框
		 * @param {*} state
		 * @param {*} id 好友id
		 * @returns
		 */
		deleteFriendChatById({ commit }, id) {
			commit('REMOVE_FRIENDCHATBYID', id);
		},
		/**
		 * 用好友id查找，当前私聊列表中是否有该好友
		 * @param {*} state
		 * @param {*} id
		 * @return true: 是；false：否
		 */
		findFriendChatById({ getters }, id) {
			const index = getters.getFriendChatHistoryById(id);
			return index != undefined && index != [] && index != null;
		},
	},
};

const roomModule = {
	state: {
		roomList: [],
		roomChatList: {},
	},
	getters: {},
	mutations: {},
	actions: {},
};

const store = createStore({
	plugins: [createPersistedState({ storage: window.sessionStorage })],
	modules: { user: userModule, room: roomModule },
});

export default store;
