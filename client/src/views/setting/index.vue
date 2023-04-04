<template>
	<el-container class="whole-area">
		<!-- 主界面 好友界面 这里有嵌套路由 -->
		<el-main class="main-box">
			<UserSetting></UserSetting>
		</el-main>
	</el-container>
</template>

<script>
	import UserSetting from './UserInfoSetting';

	export default {
		components: { UserSetting },
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

<style lang="scss" scoped></style>
