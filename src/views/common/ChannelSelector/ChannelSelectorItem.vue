<template>
	<div class="channel-selector-item">
		<!-- 图标，可点击跳转界面 -->
		<img class="channel-icon" :src="icon" @click="handleClick" />
	</div>
</template>

<script>
	export default {
		props: {
			// 点击icon跳转的界面url
			link: {
				type: String,
				default: '',
			},
			// icon地址
			icon: {
				type: String,
				default: require('@/assets/styles/common/img/user.png'),
			},
		},
		methods: {
			handleClick() {
				console.log('selector item clickd', this.link);
				this.link && this.goPage(this.link);
			},
			goPage(url) {
				this.$router.push('/' + url);
			},
		},
	};
</script>

<style lang="scss" scoped>
	.channel-selector-item {
		position: relative;
		overflow: hidden;

		height: 60px;
		width: 100%;

		background-color: transparent;

		.channel-icon {
			width: 70%;
			height: 70%;
			border-radius: 50%;
			background-color: $fontColorDeep; // fixme: delete this when the icon decided

			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			margin: auto;
		}
	}
</style>
