<template>
	<el-container class="whole-area">
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
</template>

<script>
	import RoomList from './RoomAside/index';
	import RoomChatBox from './RoomMain/index';
	import roomApi from '@/api/room.js';

	import { mapGetters, mapActions } from 'vuex';

	export default {
		components: { RoomList, RoomChatBox },
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
				this.$router.push(`/group/${uid}/room/${rid}`);
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

<style lang="scss" scoped></style>
