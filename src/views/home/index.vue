<template>
	<div class="user">
		<el-container class="whole-area">
			<el-aside class="left-sidebar-0"></el-aside>
			<el-aside class="left-sidebar-1">
				<router-view name="leftSidebar1" />
			</el-aside>
			<el-container class="main-area">
				<el-header class="main-header"></el-header>
				<el-container>
					<el-main class="main-central">
						<router-view name="mainCentral" />
					</el-main>
					<el-aside class="main-right-sidebar"></el-aside>
				</el-container>
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
			.main-header {
				background-color: green;
			}
			.main-central {
				background-color: blue;
				min-width: 600px;
				padding: 0;
			}
			.main-right-sidebar {
				background-color: purple;
				width: 300px;
			}
		}
	}
</style>
