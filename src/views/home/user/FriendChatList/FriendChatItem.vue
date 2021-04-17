<template>
	<div class="chat-list-item">
		<img :src="avator" />
		<div class="friend-info">
			<span id="friend-name">{{ name }}</span>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			avator: {
				type: String,
				default: require('@/assets/styles/common/img/user.png'),
			},
			name: {
				type: String,
				default: 'friendA',
			},
		},
	};
</script>

<style lang="scss" scoped>
	.chat-list-item {
		height: 40px;
		width: 95%;

		display: flex;
		margin-bottom: 10px !important;

		align-items: center;
		justify-content: flex-start;

		background-color: $themeColorLight;
		border: 5px solid $themeColorLight;
		border-radius: 10px;

		img {
			width: 30px;
			height: 30px;

			background-color: $emphasisColorA;
			border-radius: 50%;
		}

		.friend-info {
			padding: 10px;
			.friend-name {
				color: $fontColorLight;
				font-size: 14px;
			}
		}
	}
</style>
