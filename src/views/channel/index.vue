<template>
	<div class="user">
		<el-container class="whole-area">
			<!-- 最左侧边栏，频道选择 front ok; axios:? -->
			<el-aside class="left-sidebar-0">
				<ChannelSelector></ChannelSelector>
			</el-aside>
			<!-- 列表侧边栏 房间选择 -->
			<el-aside class="left-sidebar-1">
				<RoomList></RoomList>
			</el-aside>
			<!-- 主界面 聊天界面 -->
			<el-main class="main-box">
				<RoomChatBox></RoomChatBox>
			</el-main>
		</el-container>
	</div>
</template>

<script>
	import ChannelSelector from '../common/ChannelSelector/index.vue';
	import RoomList from './RoomList/index';
	import RoomChatBox from './RoomChatBox/index';
	export default {
		components: { ChannelSelector, RoomList, RoomChatBox },
		data() {},
		methods: {},
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
				width: 240px !important;
			}
			.main-box {
				padding: 0;
				background-color: $themeColorLight;
			}
		}
	}
</style>
