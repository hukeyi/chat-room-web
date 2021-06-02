/*
 * @Author: Hu Keyi
 * @Date: 2021-05-29 15:42:29
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-06-02 20:21:44
 */

export const roomModule = {
	state: {
		roomList: [],
		roomChatList: {},
		noticeList: [],
	},
	getters: {
		/**
		 * get函数
		 */
		getRoomList: (state) => state.roomList,
		getRoomChatList: (state) => state.roomChatList,
		getMyRoomList: (state) => state.roomList.filter((item) => item.isAdmin),
		getMenuListAll: (state) => state.menuList,
		/**
		 * 查找对应ID的聊天室数组下标
		 */
		getRoomIndexById: (state) => (id) => {
			return state.roomList.findIndex((item) => item.id == id);
		},
		/**
		 * 根据id查找聊天室的info
		 */
		getRoomInfoById: (state, getters) => (id) => {
			const index = getters.getRoomIndexById(id);
			return state.roomList[index];
		},
		/**
		 * 根据id查找聊天室的chatHistory
		 */
		getRoomChatHistoryById: (state) => (id) => {
			return state.roomChatList[id].chatHistory;
		},
		/**
		 * 根据id查找聊天室的memberList
		 */
		getRoomMembersById: (state) => (id) => {
			return state.roomChatList[id].memberList;
		},
	},
	mutations: {
		/**
		 * 初始化
		 */
		INIT_ROOMLIST(state, roomList) {
			state.roomList = roomList;
		},
		INIT_ROOMCHATLIST(state, roomChatList) {
			state.roomChatList = roomChatList;
		},
		/**
		 * roomList 相关 mutations
		 */
		CLEAR_ROOMLIST(state) {
			state.roomList.splice(0, state.roomList.length);
		},
		REMOVE_ROOMBYID(state, id) {
			const index = state.roomList.findIndex((item) => item.id == id);
			state.roomList.splice(index, 1);
		},
		/**
		 * roomChatList 相关 mutations
		 */
		REMOVE_ROOMCHATBYID(state, id) {
			delete state.roomChatList[id];
		},
		INSERT_ROOMCHATMSG(state, { rid, msg }) {
			console.log('store insert roomChatList', state.roomChatList, rid, msg);
			state.roomChatList[rid].chatHistory.push(msg);
		},
	},
	actions: {
		/**
		 * 初始化
		 */
		setRoomList({ commit }, roomList) {
			commit('CLEAR_ROOMLIST');
			commit('INIT_ROOMLIST', roomList);
		},
		setRoomChatList({ commit }, roomChatList) {
			commit('INIT_ROOMCHATLIST', roomChatList);
		},
		/**
		 * roomList 相关 actions
		 */
		deleteRoomById({ commit, getters }, id) {
			console.log('before del', getters.getRoomList);
			commit('REMOVE_ROOMBYID', id);
			commit('REMOVE_ROOMCHATBYID', id);
		},
		clearRoomList({ commit }) {
			commit('CLEAR_ROOMLIST');
		},
		/**
		 * roomChatList 相关 actions
		 */
		addMsgToRoomChatList({ commit }, { rid, msg }) {
			commit('INSERT_ROOMCHATMSG', { rid, msg });
		},
		deleteRoomChatById({ commit }, id) {
			commit('REMOVE_ROOMCHATBYID', id);
		},
		/**
		 * 用room id查找，当前私聊列表中是否有该聊天室
		 */
		findRoomChatById({ getters }, id) {
			const index = getters.getRoomChatHistoryById(id);
			return index != undefined && index != [] && index != null;
		},
		getRoomAdminById({ getters }, rid) {
			const memberList = getters.getRoomMembersById(rid);
			const admins = memberList.filter((item) => item.isAdmin);
			return admins;
		},
	},
};
