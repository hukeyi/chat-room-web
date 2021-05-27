<template>
	<div class="user">
		<el-container class="whole-area">
			<!-- 最左侧边栏，频道选择 front ok; axios:? -->
			<el-aside class="left-sidebar-0">
				<ChannelSelector></ChannelSelector>
			</el-aside>
			<!-- 列表侧边栏 朋友选择 -->
			<el-aside class="left-sidebar-1">
				<FriendChatList :chatInfoList="chatInfoList"></FriendChatList>
			</el-aside>
			<!-- 主界面 好友界面 这里有嵌套路由 -->
			<el-main class="main-box">
				<FriendBox
					@startChat="startChat"
					:friendList="friendList"
					:chatList="chatList"
				></FriendBox>
			</el-main>
		</el-container>
	</div>
</template>

<script>
	import ChannelSelector from '../common/ChannelSelector/index.vue';
	import FriendChatList from './FriendChatList/index';
	import FriendBox from './FriendChatBox/index';
	import { mapGetters, mapActions } from 'vuex';

	import friendApi from '@/api/friend.js';
	import MsgApi from '@/api/message';

	export default {
		components: { ChannelSelector, FriendChatList, FriendBox },
		data() {
			return {
				chatInfoList: [],
				friendList: [],
				chatList: {},
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
				this.$router.push(`/user/${uid}/${fid}`);
			},
			async initLists() {
				try {
					this.friendList = await friendApi.GetFriendListAll();
					this.setFriendListAll(this.friendList);
					this.chatList = await MsgApi.GetFriendChatAll();
					this.setFriendChatListAll(this.chatList);
					this.chatInfoList = this.getChatInfoList();
				} catch (err) {
					console.log('user/index.vue init err', err);
				}
			},
			async initListsFromStore() {
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
					this.initListsFromStore();
				},
				deep: true,
			},
		},
		mounted() {
			this.initLists();
			this.$socket.open();
		},
	};
</script>

<style lang="scss" scoped>
	.user {
		overflow: hidden;
		height: 100%;
		color: $fontColorLight;

		:deep(.whole-area) {
			height: 100%;
			.left-sidebar-0 {
				background-color: $themeColorDeep;
				width: 60px !important;
			}
			.left-sidebar-1 {
				background-color: $themeColorMedium;
				width: 290px !important;
			}
			.main-box {
				padding: 0;
				background-color: $themeColorLight;
			}
		}
	}
</style>
