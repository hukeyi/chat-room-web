<template>
	<div class="user">
		<el-container class="whole-area">
			<!-- 最左侧边栏，频道选择 front ok; axios:? -->
			<el-aside class="left-sidebar-0">
				<ChannelSelector></ChannelSelector>
			</el-aside>
			<!-- 列表侧边栏 房间选择 -->
			<el-aside class="left-sidebar-1">
				<RoomList :roomList="roomList"></RoomList>
			</el-aside>
			<!-- 主界面 聊天界面 -->
			<el-main class="main-box">
				<RoomChatBox
					@refresh="initLists"
					@enterRoom="enterRoom"
					:roomList="roomList"
				></RoomChatBox>
			</el-main>
		</el-container>
	</div>
</template>

<script>
	import ChannelSelector from '../common/ChannelSelector/index.vue';
	import RoomList from './RoomList/index';
	import RoomChatBox from './RoomChatBox/index';
	import roomApi from '@/api/room.js';

	import { mapGetters, mapActions } from 'vuex';

	export default {
		components: { ChannelSelector, RoomList, RoomChatBox },
		data() {
			return {
				roomList: [],
			};
		},
		methods: {
			...mapActions(['setRoomList', 'setRoomChatList']),
			...mapGetters({
				getChatInfoList: 'getRoomChatList',
				getUserId: 'getUserId',
				getRoomList: 'getRoomList',
			}),
			async enterRoom(uid, rid) {
				console.log('enter room', uid, rid);
				await this.initLists();
				this.$router.push(`/channel/${uid}/room/${rid}`);
			},
			async initLists() {
				this.roomList = await roomApi.GetRoomListAll();
				console.log('roomList', this.roomList);
				this.setRoomList(this.roomList);
				const roomChatList = await roomApi.GetRoomChatListAll();
				console.log('roomChatList', roomChatList);
				this.setRoomChatList(roomChatList);
			},
			async initRoomList() {
				this.roomList = this.getRoomList();
			},
		},
		watch: {
			'$store.state.room.roomList': {
				handler() {
					console.log('store roomlist change');
					this.initRoomList();
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

<style lang="scss" scoped>
	.user {
		@media (max-width: 900px) {
			.main-right-sidebar {
				display: none;
			}
			.left-sidebar-1 {
				display: none;
			}
		}
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
				width: 240px !important;
			}
			.main-box {
				padding: 0;
				background-color: $themeColorLight;
			}
		}
	}
</style>
