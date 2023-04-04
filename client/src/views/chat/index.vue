<template>
	<el-container class="whole-area">
		<!-- 列表侧边栏 朋友选择 -->
		<el-aside class="left-sidebar-1">
			<FriendChatList :chatInfoList="chatInfoList"></FriendChatList>
		</el-aside>
		<!-- 主界面 好友界面 这里有嵌套路由 -->
		<el-main class="main-box">
			<FriendBox
				@startChat="startChat"
				:friendList="friendList"
			></FriendBox>
		</el-main>
	</el-container>
</template>

<script>
	import FriendChatList from './FriendAside/index';
	import FriendBox from './FriendMain/index';
	import { mapGetters, mapActions } from 'vuex';

	import friendApi from '@/api/friend.js';
	import MsgApi from '@/api/message';

	export default {
		components: { FriendChatList, FriendBox },
		data() {
			return {
				chatInfoList: [],
				friendList: [],
				// chatList: {},
			};
		},
		methods: {
			...mapActions(['setFriendChatListAll', 'setFriendListAll']),
			...mapGetters({
				getChatInfoList: 'getFriendChatInfoList',
				getUserId: 'getUserId',
				getFriendList: 'allFriends',
			}),
			async startChat(uid, fid) {
				console.log('start chat', uid, fid);
				await this.initLists();
				this.$router.push(`/user/${uid}/friend/${fid}`);
			},
			async initLists() {
				try {
					this.friendList = await friendApi.GetFriendListAll();
					this.setFriendListAll(this.friendList);
					const chatList = await MsgApi.GetFriendChatAll();
					this.setFriendChatListAll(chatList);
					this.chatInfoList = this.getChatInfoList();
				} catch (err) {
					console.log('user/index.vue init err', err);
				}
			},
			async initFriendList() {
				this.friendList = this.getFriendList();
			},
		},
		watch: {
			friendList: {
				//watch friendlist, sync chatlist
				handler() {
					this.chatInfoList = this.getChatInfoList();
				},
				deep: true,
			},
			'$store.state.user.friendList': {
				handler() {
					console.log('store friendlist change');
					this.initFriendList();
				},
				deep: true,
			},
		},
		mounted() {
			this.initLists();
			if (!this.$socket.isOpen()) {
				this.$socket.open();
			}
		},
	};
</script>

<style lang="scss" scoped></style>
