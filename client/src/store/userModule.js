import userApi from '@/api/user';

export const userModule = {
	state: {
		userInfo: {
			id: 'default',
			phone: 'xxxxxx',
			name: 'default',
			avatar: '',
			email: '',
			gender: '',
			birthDate: '',
		},
		friendList: [],
		friendChatList: {},
		noticeList: [],
	},
	getters: {
		/**
		 * get函数
		 */
		getUserId: (state) => state.userInfo.id,
		getUserName: (state) => state.userInfo.name,
		getUserPhone: (state) => state.userInfo.phone,
		hasAvatar: (state) => state.userInfo.avatar && state.userInfo.avatar != '',
		getUserAvatar: (state) => userApi.DownloadAvatar(state.userInfo.id),
		getUserInfo: (state) => state.userInfo,
		getNoticeList: (state) => state.noticeList,
		getNewNotice: (state) => state.noticeList[state.noticeList.length - 1],

		/**
		 * friendList 相关 getters
		 */

		/**
		 * 返回全部好友列表
		 */
		allFriends: (state) => state.friendList,
		/**
		 * 返回在线好友列表
		 */
		onFriends(state) {
			return state.friendList.filter((item) => item.status === 'on');
		},
		/**
		 * 返回离线好友列表
		 */
		offFriends(state) {
			return state.friendList.filter((item) => item.status === 'off');
		},
		/**
		 * 查找对应好友ID的好友数组下标
		 */
		getFriendIndexById: (state) => (id) => {
			return state.friendList.findIndex((item) => item.id == id);
		},

		/**
		 * friendChatList 相关 getters
		 */

		/**
		 * 返回全部好友私聊列表
		 */
		allFriendChatList: (state) => state.friendChatList,
		/**
		 * 根据好友id查找与好友的聊天历史记录
		 */
		getFriendChatHistoryById: (state) => (id) => {
			return state.friendChatList[id].chatHistory;
		},
		getFriendNameById: (state) => (id) => {
			return state.friendChatList[id].name;
		},
		getFriendAvatarById: (state) => (id) => {
			return state.friendChatList[id].avatar;
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
		/**
		 * userInfo 相关 mutations
		 */
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
		SET_USERINFO(state, info) {
			state.userInfo = info;
		},
		/**
		 * notice 相关 mutations
		 */
		SET_NOTICELIST(state, noticeList) {
			state.userInfo.noticeList = noticeList;
		},
		DELETE_NOTICEBYINDEX(state, index) {
			state.noticeList.splice(index, 1);
		},
		DELETE_NEWNOTICE(state) {
			state.noticeList.pop();
		},
		INSERT_NOTICELIST(state, notice) {
			state.noticeList.push(notice);
		},
		/**
		 * friendList 相关 mutations
		 */
		INIT_FRIENDLIST(state, friendList) {
			state.friendList = friendList;
		},
		CLEAR_FRIENDLIST(state) {
			state.friendList.splice(0, state.friendList.length);
		},
		REMOVE_FRIENDBYID(state, id) {
			const index = state.friendList.findIndex((item) => item.id == id);
			state.friendList.splice(index, 1);
		},
		/**
		 * friendChatList 相关 mutations
		 */
		INIT_FRIENDCHATLIST(state, chatList) {
			state.friendChatList = chatList;
		},
		REMOVE_FRIENDCHATBYID(state, id) {
			delete state.friendChatList[id];
		},
		INSERT_FRIENDCHATMSG(state, { fid, msg }) {
			console.log('store insert list', state.friendChatList, fid, msg);
			state.friendChatList[fid].chatHistory.push(msg);
		},
		async getAvatarById(state, id) {
			const url = userApi.DownloadAvatar(id);
			console.log('mutations get', url, id);
			return url;
		},
	},
	actions: {
		/**
		 * userInfo 相关 actions
		 */
		setUserId({ commit }, id) {
			commit('SET_USERID', id);
		},
		setUserName({ commit }, name) {
			commit('SET_USERNAME', name);
		},
		setUserPhone({ commit }, phone) {
			commit('SET_USERPHONE', phone);
		},
		setUserAvatar({ commit }, avatar) {
			commit('SET_USERAVATOR', avatar);
		},
		setUserInfo({ commit }, info) {
			commit('SET_USERINFO', info);
		},
		/**
		 * friendList 相关 actions
		 */
		setFriendListAll({ commit }, friendList) {
			commit('CLEAR_FRIENDLIST');
			commit('INIT_FRIENDLIST', friendList);
		},
		deleteFriendById({ commit }, id) {
			commit('REMOVE_FRIENDBYID', id);
			commit('REMOVE_FRIENDCHATBYID', id);
		},
		clearFriendList({ commit }) {
			commit('CLEAR_FRIENDLIST');
		},
		/**
		 * notice 相关 actions
		 */
		setNoticeList({ commit }, noticeList) {
			commit('SET_NOTICELIST', noticeList);
		},
		deleteNoticeByIndex({ commit }, index) {
			commit('DELETE_NOTICEBYINDEX', index);
		},
		deleteNewNotice({ commit }) {
			commit('DELETE_NEWNOTICE');
		},
		addNoticeList({ commit }, notice) {
			commit('INSERT_NOTICELIST', notice);
		},
		/**
		 * friendChatList 相关 actions
		 */
		setFriendChatListAll({ commit }, chatList) {
			commit('INIT_FRIENDCHATLIST', chatList);
		},
		addMsgToFriendChatList({ commit }, { fid, msg }) {
			commit('INSERT_FRIENDCHATMSG', { fid, msg });
		},
		deleteFriendChatById({ commit }, id) {
			commit('REMOVE_FRIENDCHATBYID', id);
		},

		/**
		 * 用好友id查找，当前私聊列表中是否有该好友
		 */
		findFriendChatById({ getters }, id) {
			const index = getters.getFriendChatHistoryById(id);
			return index != undefined && index != [] && index != null;
		},
	},
};
