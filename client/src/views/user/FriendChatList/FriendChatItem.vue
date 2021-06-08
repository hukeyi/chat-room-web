<template>
	<div :class="['chat-list-item', $route.params.fId == id ? 'clicked' : '']">
		<img :src="avatar" />
		<div class="friend-info">
			<span id="friend-name">{{ name }}</span>
		</div>
	</div>
</template>

<script>
	import userApi from '@/api/user';

	export default {
		props: {
			showAvatar: {
				type: Boolean,
				default: false,
			},
			name: {
				type: String,
				default: 'friendA',
			},
			id: {
				type: Number,
			},
		},
		data() {
			return {
				avatar: require('@/assets/styles/common/img/user.png'),
			};
		},
		mounted() {
			if (this.showAvatar) {
				this.avatar = userApi.DownloadAvatar(this.id);
			}
		},
	};
</script>

<style lang="scss" scoped>
	.chat-list-item {
		height: 40px;
		width: 95%;

		display: flex;
		margin-bottom: 10px !important;
		padding-left: 5px !important;

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
	.clicked {
		border-color: $fontColorDeep;
	}
</style>
