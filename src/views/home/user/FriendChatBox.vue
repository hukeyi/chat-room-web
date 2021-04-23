<template>
	<div class="friend-chat-box">
		<el-container class="main-area">
			<el-header class="main-header">
				<div class="main-header-title">
					<img :src="icon_friend" /><span style="margin: auto 10px;">好友</span>
				</div>
				<el-divider
					class="main-header-divider"
					direction="vertical"
				></el-divider>
				<el-menu
					@select="handleSelectStatus"
					class="main-header-menu"
					mode="horizontal"
				>
					<el-menu-item index="all">全部</el-menu-item>
					<el-menu-item index="on">在线</el-menu-item>
					<el-menu-item index="off">离线</el-menu-item>
				</el-menu>
				<el-divider
					class="main-header-divider"
					direction="vertical"
				></el-divider>
				<el-button
					@click="handleClickAddFriend"
					size="medium"
					class="main-header-btn"
					>添加朋友</el-button
				>
			</el-header>
			<el-container>
				<el-main class="main-central">
					<!-- 添加好友+搜索好友 -->
					<div v-if="showAddFriend" class="add-friend">
						<InputItem
							itemStyle="
							padding: 20px !important; 
							width: 400px; 
							height: auto; 
							overflow: hidden;
							"
							inputStyle="float: left; width: 60%;"
							labelValue="您可以通过搜索好友ID来添加好友："
							placeholder="请输入用户ID"
							:clearable="true"
						>
							<el-button size="medium" class="add-friend-btn"
								>搜索好友</el-button
							>
						</InputItem>
					</div>
					<!-- 所有好友信息列表 -->
					<div v-if="selectFriendStatus === 'all'" class="friend-list-all">
						<InfoCardItem
							v-for="item in friendList"
							:key="item.id"
							:name="item.name"
							:avator="item.avator ? item.avator : undefined"
							:id="item.id"
						></InfoCardItem>
					</div>
					<!-- 在线好友信息列表 -->
					<div v-if="selectFriendStatus === 'on'" class="friend-list-on">
						<InfoCardItem
							v-for="item in getOnList()"
							:key="item.id"
							:name="item.name"
							:avator="item.avator ? item.avator : undefined"
							:id="item.id"
						></InfoCardItem>
					</div>
					<!-- 离线好友信息列表 -->
					<div v-if="selectFriendStatus === 'off'" class="friend-list-off">
						<InfoCardItem
							v-for="item in getOffList()"
							:key="item.id"
							:name="item.name"
							:avator="item.avator ? item.avator : undefined"
							:id="item.id"
						></InfoCardItem>
					</div>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
	import InputItem from '@/components/InputItem.vue';
	import InfoCardItem from '@/components/InfoCardItem.vue';

	export default {
		components: { InputItem, InfoCardItem },
		data() {
			return {
				icon_friend: require('@/assets/styles/common/img/user.png'),
				showAddFriend: false,
				friendList: [
					{ id: '0', name: 'frank', avator: '', status: 'on' },
					{ id: '1', name: 'john', avator: '', status: 'off' },
					{ id: '2', name: 'mary', avator: '', status: 'on' },
				],
				selectFriendStatus: '',
			};
		},
		methods: {
			getOnList() {
				return this.friendList.filter((item) => item.status === 'on');
			},
			getOffList() {
				return this.friendList.filter((item) => item.status === 'off');
			},
			handleClickAddFriend() {
				this.showAddFriend = true;
				this.selectFriendStatus = '';
			},
			handleSelectStatus(key) {
				//好友在线状态选择 header selector
				console.log('select status', key);
				this.selectFriendStatus = key;
				this.showAddFriend = false;
			},
		},
		mounted() {
			// get whole friend list
		},
	};
</script>

<style lang="scss" scoped>
	@media (max-width: 1200px) {
		.main-right-sidebar {
			display: none;
		}
	}
	.friend-chat-box {
		width: 100%;
		height: 100%;
		background-color: transparent;
		overflow: hidden;

		::v-deep .main-area {
			width: 100% !important;
			height: 100%;

			* {
				padding: 0;
			}

			.main-header {
				display: flex;
				align-items: center;
				justify-content: flex-start;

				padding: 0;
				border-bottom: 2px solid $themeColorDeep;

				* {
					font-weight: bolder;
				}

				*.main-header-divider {
					background-color: $themeColorMedium;
				}

				.main-header-title {
					display: flex;
					align-items: center;
					width: auto;
					font-size: 14px;
					padding-left: 20px;

					img {
						width: 25px;
						height: 25px;
						border-radius: 50%;
						background-color: $fontColorDeep;
						margin-right: 5px;
					}
				}

				.main-header-menu {
					width: auto;
					background-color: transparent;
					border: transparent;

					.el-menu-item {
						margin: auto 20px;
						color: $fontColorDeep;
					}
					.el-menu-item:hover {
						background-color: transparent;
						color: $fontColorDeep;
					}
					.el-menu-item.is-active {
						color: $fontColorLight;
						background-color: transparent;
						border-bottom: 2px solid $fontColorDeep;
					}
				}

				.main-header-btn {
					background-color: $emphasisColorA;
					border: 0px;

					font-size: 14px;
					width: 75px;
					height: 15px !important;

					color: $fontColorLight;
					opacity: 0.75;
				}
			}
			.main-central {
				background-color: transparent;
				min-width: 600px;
				padding: 20px;

				.add-friend {
					border-bottom: 1px solid $themeColorDeep;

					.add-friend-btn {
						float: left;
						margin-left: 10px;

						border: 0;
						width: 80px;
						height: 40px;

						background-color: $emphasisColorA;
						color: $fontColorDeep;
					}
				}
			}
			.main-right-sidebar {
				background-color: $themeColorMedium;
				width: 300px;
			}
		}
	}
</style>
