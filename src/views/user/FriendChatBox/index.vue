<template>
	<!-- 好友界面-主窗口路由：1）好友信息界面；2）好友私聊窗口 -->
	<router-view></router-view>
</template>

<script>
	export default {};
</script>

<style lang="scss" scoped>
	@media (max-width: 1200px) {
		.main-right-sidebar {
			display: none;
		}
	}
	@import '@/assets/styles/user/chat.scss';
</style>
