<template>
	<div class="user">
		<el-container class="main-area">
			<el-aside class="side-bar"></el-aside>
			<el-aside class="chat-list"></el-aside>
			<el-container>
				<el-header class="header-bar"></el-header>
				<el-main class="chat-place"></el-main>
			</el-container>
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

		.main-area {
			height: 100%;
			::v-deep .side-bar {
				background-color: red;
				width: 80px !important;
			}
			.chat-list {
				background-color: yellow;
			}
			.header-bar {
				background-color: green;
			}
			.chat-place {
				background-color: blue;
			}
		}
	}
</style>
