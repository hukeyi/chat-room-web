<template>
	<div class="container">
		<!-- 最左侧边栏，频道选择 front ok; axios:? -->
		<aside class="left-sidebar-0">
			<ChannelSelector></ChannelSelector>
		</aside>
		<!-- 列表侧边栏 + 主界面，由路由切换界面 -->
		<router-view v-slot="{ Component }">
			<transition name="fade" mode="out-in">
				<component :is="Component" />
			</transition>
		</router-view>
	</div>
</template>

<script>
	import ChannelSelector from './components/ChannelSelector/index.vue';

	export default {
		components: { ChannelSelector },
		mounted() {
			if (!this.$socket.isOpen()) {
				this.$socket.open();
			}
		},
	};
</script>

<style lang="scss" scoped>
	@import '@/assets/styles/transition.scss';
	.container {
		@media (max-width: 900px) {
			.main-right-sidebar {
				display: none;
			}
			.left-sidebar-1 {
				display: none;
			}
		}
		overflow: hidden;
		height: 100%;
		color: $fontColorLight;

		.left-sidebar-0 {
			background-color: $themeColorDeep;
			width: 60px;

			position: absolute;
			padding-top: 5px;
		}

		:deep(.whole-area) {
			margin-left: 60px;
			height: 100%;
			.left-sidebar-1 {
				background-color: $themeColorMedium;
				width: 290px !important;
			}
			.main-box {
				padding: 0;
				background-color: $themeColorLight;
			}
		}
	}
</style>
