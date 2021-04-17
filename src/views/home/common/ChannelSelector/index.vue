<template>
	<!-- 主页最左边栏界面 -->
	<div class="channel-selector">
		<!-- 用户主页 -->
		<SelectorItem :icon="icon_userhome" link="home/me"></SelectorItem>
		<hr width="60%" class="level-divider" />
		<!-- 已加入频道主页 -->
		<SelectorItem></SelectorItem>
		<!-- 添加频道 -->
		<SelectorItem></SelectorItem>
		<!-- 探索公开频道 -->
		<SelectorItem :icon="icon_explore"></SelectorItem>
	</div>
</template>

<script>
	import SelectorItem from './ChannelSelectorItem';
	export default {
		data() {
			return {
				icon_userhome: require('@/assets/styles/common/img/search.png'),
				icon_explore: require('@/assets/styles/common/img/international.png'),
			};
		},
		components: {
			SelectorItem,
		},
	};
</script>

<style lang="scss" scoped>
	.channel-selector {
		width: 100%;
		height: 100%;
		background-color: transparent;

		.level-divider {
			margin: 0 auto;
			background-color: $themeColorMedium;
			height: 2px;
			border-radius: 2px;
			border-width: 0px;
		}
	}
</style>
