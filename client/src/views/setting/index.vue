<template>
	<div class="setting">
		<el-container class="whole-area">
			<!-- 最左侧边栏，频道选择 -->
			<el-aside class="left-sidebar-0">
				<ChannelSelector></ChannelSelector>
			</el-aside>
			<!-- 主界面 好友界面 这里有嵌套路由 -->
			<el-main class="main-box">
				<UserSetting></UserSetting>
			</el-main>
		</el-container>
	</div>
</template>

<script>
	import ChannelSelector from '../components/ChannelSelector/index.vue';
	import UserSetting from './UserInfoSetting';

	export default {
		components: { ChannelSelector, UserSetting },
		data() {
			return {};
		},
		methods: {},
		mounted() {
			if (!this.$socket.isOpen()) {
				this.$socket.open();
			}
		},
	};
</script>

<style lang="scss" scoped>
	.setting {
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
				width: 290px !important;
			}
			.main-box {
				padding: 0;
				background-color: $themeColorLight;
			}
		}
	}
</style>
