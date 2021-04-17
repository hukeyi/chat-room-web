<template>
	<div class="friend-chat-box">
		<el-container class="main-area">
			<el-header class="main-header">
				<div class="main-header-title">
					<img :src="icon_friend" /><span style="margin: auto 10px;">好友</span>
					<el-divider
						style="color: $fontColorDeep;"
						direction="vertical"
					></el-divider>
				</div>
				<el-menu class="main-header-menu" mode="horizontal">
					<el-menu-item index="2">全部</el-menu-item>
					<el-menu-item index="3">在线</el-menu-item>
					<el-menu-item index="4">离线</el-menu-item>
				</el-menu>
			</el-header>
			<el-container>
				<el-main class="main-central">friend main central</el-main>
				<el-aside class="main-right-sidebar"
					>friend main right-sidebar</el-aside
				>
			</el-container>
		</el-container>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				icon_friend: require('@/assets/styles/common/img/user.png'),
			};
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
				justify-content: space-around;

				padding: 0;
				border-bottom: 2px solid $themeColorDeep;

				* {
					font-weight: bolder;
				}

				.main-header-title {
					display: flex;
					align-items: center;
					width: 120px;
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
					width: 100%;
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
			}
			.main-central {
				background-color: transparent;
				min-width: 600px;
				padding: 0;
			}
			.main-right-sidebar {
				background-color: $themeColorMedium;
				width: 300px;
			}
		}
	}
</style>
