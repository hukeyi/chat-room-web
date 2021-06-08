<template>
	<div class="room-chat-list">
		<el-container style="width: 100%; height: 100%;">
			<!-- 头部标题：私信 -->
			<el-header class="room-chat-header">
				<span>聊天室列表</span>
				<span style="float: right;">+</span>
			</el-header>
			<!-- 主要：聊天室列表 -->
			<el-main class="chat-session-list">
				<div v-if="roomList.length">
					<ChatListItem
						v-for="item in roomList"
						:key="item.id"
						:id="item.id"
						:name="item.name"
						@click="handleClickItem(item)"
					></ChatListItem>
				</div>
				<div v-else>
					<el-empty
						:imageSize="100"
						description="暂时没有加入聊天室"
					></el-empty>
				</div>
			</el-main>
			<!-- 底部：用户个人信息 -->
			<el-footer class="user-info-setting">
				<div class="user-info">
					<img :src="user_avator" />
					<div class="user-name-id">
						<span id="user-name">{{ userName }}</span>
						<br />
						<span id="user-id">{{ userId }}</span>
					</div>
				</div>
				<img
					@click="handleClickLogout"
					:src="logout_icon"
					class="user-logout"
				/>
			</el-footer>
		</el-container>
	</div>
</template>

<script>
	import ChatListItem from './RoomChatItem';
	import { mapGetters, mapMutations, mapActions } from 'vuex';
	import userApi from '@/api/user.js';

	export default {
		components: { ChatListItem },
		props: {
			roomList: {
				type: Array,
				default: () => [],
			},
		},
		data() {
			return {
				user_avator: require('@/assets/styles/common/img/user.png'),
				setting_icon: require('@/assets/styles/common/img/international.png'),
				logout_icon: require('@/assets/styles/common/img/log-out.png'),

				userId: '',
				userName: '',
			};
		},
		methods: {
			...mapGetters({
				getUserId: 'getUserId',
				getUserName: 'getUserName',
				hasAvatar: 'hasAvatar',
			}),
			...mapMutations({
				// todo: delete room list item controller
			}),
			...mapActions({}),
			handleClickItem(item) {
				this.$router.push(`/channel/${this.getUserId()}/room/${item.id}`);
			},
			handleClickLogout() {
				// logout
				console.log('setting btn clicked');
				userApi
					.Logout()
					.then((res) => {
						console.log('logout vue', res);
						this.$socket.close();
						localStorage.clear();
						sessionStorage.clear();
						this.$router.push('/');
					})
					.catch((err) => {
						alert(err);
						console.log('logout vue', err);
					});
			},
		},
		mounted() {
			this.userId = this.getUserId();
			this.userName = this.getUserName();
			if (this.hasAvatar())
				this.user_avator = userApi.DownloadAvatar(this.userId);
		},
	};
</script>

<style lang="scss" scoped>
	@import '@/assets/styles/user/list.scss';
</style>
