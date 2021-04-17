<template>
	<div class="friend-chat-list">
		<el-container style="width: 100%; height: 100%;">
			<el-header class="friend-chat-header">
				<span>私信</span>
				<span style="float: right;">+</span>
			</el-header>
			<el-main class="chat-session-list">
				<ChatListItem
					v-for="item in chatList"
					:key="item.id"
					:name="item.name"
				></ChatListItem>
				<!-- <el-skeleton :rows="10" /> -->
			</el-main>
			<el-footer class="user-info-setting">
				<div class="user-info">
					<img :src="user_avator" />
					<div class="user-name-id">
						<span id="user-name">username</span>
						<br />
						<span id="user-id">userid</span>
					</div>
				</div>
				<img :src="setting_icon" class="user-setting" />
			</el-footer>
		</el-container>
	</div>
</template>

<script>
	import ChatListItem from './FriendChatItem';
	export default {
		components: { ChatListItem },
		data() {
			return {
				user_avator: require('@/assets/styles/common/img/user.png'),
				setting_icon: require('@/assets/styles/common/img/international.png'),
				chatList: [
					{ id: '1', name: 'friend-1', avator: '' },
					{ id: '2', name: 'friend-2', avator: '' },
				],
			};
		},
	};
</script>

<style lang="scss" scoped>
	.friend-chat-list {
		width: 100%;
		height: 100%;
		overflow: hidden;
		background-color: transparent;

		* {
			padding: 0;
			margin: 0;
		}

		color: $fontColorDeep;

		.friend-chat-header {
			padding: 20px;
			border-bottom: 2px solid $themeColorDeep;
		}

		.chat-session-list {
			padding: 20px;

			::v-deep .el-skeleton__item {
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
