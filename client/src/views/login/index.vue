<template>
	<div class="entrance container">
		<div class="top"></div>
		<div class="bottom"></div>
		<div class="center">
			<router-view />
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {};
		},
		mounted() {},
	};
</script>

<style lang="scss" scoped>
	@import url('https://fonts.googleapis.com/css?family=Raleway:400,700');
	@import url('https://fonts.googleapis.com/css?family=Noto+Sans+SC');

	*,
	*:before,
	*:after {
		box-sizing: border-box;
		font-family: 'Raleway', 'Noto Sans SC', sans-serif;
	}

	body {
		min-height: 100vh;
	}
	// 关键帧动画：1）镜头打开效果 open；2）表单逐渐显示 show
	@keyframes open {
		from {
			transform-origin: 0 50%;
		}
		to {
			margin-left: 570px;
			transform-origin: -565px 50%;
		}
	}
	@keyframes show {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.container {
		position: absolute;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.top {
		&:before {
			transform: rotate(45deg);
			background: $fontColorMedium;
		}
		&:after {
			transform: rotate(135deg);
			background: $emphasisColorA;
		}
	}

	.bottom {
		&:before {
			transform: rotate(-45deg);
			background: $themeColorLight;
		}
		&:after {
			transform: rotate(-135deg);
			background: $emphasisColorB;
		}
	}

	.top,
	.bottom {
		&:before,
		&:after {
			content: '';
			display: block;
			position: absolute;

			width: 200vmax;
			height: 200vmax;
			top: 50%;
			left: 50%;
			margin-top: -100vmax;

			z-index: 10;
			opacity: 0.65;
			// 动画
			animation: open 1.5s cubic-bezier(0.445, 0.05, 0, 1);
			animation-fill-mode: forwards; // 动画停在 to
		}
	}
	.center {
		position: absolute;
		width: 400px;
		height: 400px;
		// 水平垂直居中
		top: 50%;
		left: 50%;
		margin-left: -200px;
		margin-top: -200px;
		padding: 30px;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		color: #333;
		// cubic-bezier 是曲线变化函数，用于产生丝滑的移动效果
		animation: show 2.5s cubic-bezier(0.445, 0.05, 0, 1);
		animation-fill-mode: forwards; // 停在 to
	}
</style>
