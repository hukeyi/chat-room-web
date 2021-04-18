<template>
	<div class="entrance">
		<el-image id="chat-logo" :src="imgUrl">
			<template #placeholder>
				<div class="image-slot">加载中<span class="dot">...</span></div>
			</template>
		</el-image>
		<router-view />
	</div>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: require('@/assets/chat-logo-trans.png'),
			};
		},
	};
</script>

<style lang="scss" scoped>
	@import '@/assets/styles/login/login.scss';
</style>
