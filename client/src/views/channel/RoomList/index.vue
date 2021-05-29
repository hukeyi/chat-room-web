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
					@click="handleClickSetBtn"
					:src="setting_icon"
					class="user-setting"
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
				userId: '',
				userName: '',
			};
		},
		methods: {
			...mapGetters({
				getUserId: 'getUserId',
				getUserName: 'getUserName',
			}),
			...mapMutations({
				// todo: delete room list item controller
			}),
			...mapActions({}),
			handleClickItem(item) {
				this.$router.push(`/channel/${this.getUserId()}/room/${item.id}`);
			},
			handleClickSetBtn() {
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
			const state = JSON.parse(sessionStorage.getItem('vuex'));
			this.userId = state.user.userInfo.id;
			this.userName = state.user.userInfo.name;
		},
	};
</script>

<style lang="scss" scoped>
	.room-chat-list {
		width: 100%;
		height: 100%;
		overflow: hidden;
		background-color: transparent;

		* {
			padding: 0;
			margin: 0;
		}

		color: $fontColorDeep;

		.room-chat-header {
			padding: 20px;
			border-bottom: 2px solid $themeColorDeep;
		}

		.chat-session-list {
			padding: 20px;

			:deep(.el-skeleton__item) {
				// fixme: delete me when the list is down
				background-color: $themeColorLight;
			}
		}

		.user-info-setting {
			padding: 20px;
			border-top: 2px solid $themeColorDeep;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.user-info {
				display: flex;
				justify-content: center;
				width: 50%;

				img {
					width: 40px;
					height: 40px;

					background-color: $emphasisColorA;
					border-radius: 50%;
				}
				.user-name-id {
					margin: auto;
					font-size: 12px;
					#user-name {
						color: $fontColorLight;
						font-weight: bolder;
					}
					#user-id {
						color: $fontColorDeep;
					}
				}
			}
			.user-setting {
				width: 20px;
				height: 20px;

				background-color: $emphasisColorA;
				border-radius: 50%;
			}
		}
	}
</style>
