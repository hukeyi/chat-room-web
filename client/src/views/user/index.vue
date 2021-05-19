<template>
	<div class="user">
		<el-container class="whole-area">
			<!-- 最左侧边栏，频道选择 front ok; axios:? -->
			<el-aside class="left-sidebar-0">
				<ChannelSelector></ChannelSelector>
			</el-aside>
			<!-- 列表侧边栏 朋友选择 -->
			<el-aside class="left-sidebar-1">
				<FriendChatList></FriendChatList>
			</el-aside>
			<!-- 主界面 好友界面 这里有嵌套路由 -->
			<el-main class="main-box">
				<FriendBox></FriendBox>
			</el-main>
		</el-container>
	</div>
</template>

<script>
	import ChannelSelector from '../common/ChannelSelector/index.vue';
	import FriendChatList from './FriendChatList/index';
	import FriendBox from './FriendChatBox/index';
	// import { io } from 'socket.io-client';

	export default {
		components: { ChannelSelector, FriendChatList, FriendBox },
		// sockets: {
		// 	connect() {
		// 		console.log('client socket connect');
		// 	},
		// },
		mounted() {
			// fixme: test socket.io connection
			// let socket = io('http://localhost:3000', {
			// 	withCredentials: true,
			// 	transports: ['websocket'],
			// });
			// socket.on('connect', () => {
			// 	console.log('connect!');
			// });
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
