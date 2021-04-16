<template>
	<div class="user">
		<el-container class="whole-area">
			<!-- 最左侧边栏，频道选择 -->
			<el-aside class="left-sidebar-0"></el-aside>
			<!-- 列表侧边栏 朋友/房间选择 -->
			<el-aside class="left-sidebar-1">
				<router-view name="leftSidebar1" />
			</el-aside>
			<!-- 主界面 好友/聊天界面 -->
			<el-main class="main-box">
				<router-view name="mainCentral" />
			</el-main>
		</el-container>
	</div>
</template>

<script>
	export default {};
</script>

<style lang="scss" scoped>
	.user {
		overflow: hidden;
		height: 100%;

		::v-deep .whole-area {
			height: 100%;
			.left-sidebar-0 {
				background-color: red;
				width: 80px !important;
			}
			.left-sidebar-1 {
				background-color: yellow;
				width: 240px !important;
			}
			.main-box {
				padding: 0;
			}
		}
	}
</style>
