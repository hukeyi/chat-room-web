<template>
	<div class="room-chat-box">
		<el-container class="main-area">
			<el-header class="main-header"></el-header>
			<el-container>
				<el-main class="main-central"> </el-main>
				<el-aside class="main-right-sidebar"></el-aside>
			</el-container>
		</el-container>
	</div>
</template>

<script>
	export default {};
</script>

<style lang="scss" scoped>
	.room-chat-box {
		width: 100%;
		height: 100%;
		background-color: aqua;

		::v-deep .main-area {
			width: 100% !important;
			height: 100%;

			.main-header {
				background-color: orangered;
			}
			.main-central {
				background-color: olivedrab;
				min-width: 600px;
				padding: 0;
			}
			.main-right-sidebar {
				background-color: orange;
				width: 300px;
			}
		}
	}
</style>
