<template>
	<div class="info-list-item">
		<div class="info">
			<img :src="avatar" />
			<div class="name-id">
				<span id="name">{{ name }}</span>
				<span id="id"> #{{ id }}</span>
			</div>
		</div>
		<span
			v-if="showStatus"
			class="status"
			:class="{ off: status === 'off', on: status === 'on' }"
		></span>
	</div>
</template>

<script>
	export default {
		props: {
			avatar: {
				type: String,
				default: require('@/assets/styles/common/img/user.png'),
			},
			name: {
				type: String,
				default: 'memberA',
			},
			id: {
				type: Number,
				default: 0,
			},
			status: {
				type: String,
				default: 'on',
			},
			showStatus: {
				type: Boolean,
				default: true,
			},
		},
	};
</script>

<style lang="scss" scoped>
	.info-list-item {
		height: auto;
		width: 85%;
		margin: 10px;
		padding: 10px !important;

		border-bottom: 1px solid $fontColorLight;

		background-color: $themeColorMedium;
		opacity: 0.9;

		display: flex;
		align-items: center;
		justify-content: space-between;

		.info {
			display: flex;
			justify-content: flex-start;
			width: 100%;

			img {
				width: 22px;
				height: 22px;

				background-color: $emphasisColorA;
				border-radius: 50%;
			}
			.name-id {
				margin: auto 10px;
				font-size: 12px;
				#name {
					color: $fontColorLight;
					font-weight: bolder;
				}
				#id {
					color: $fontColorDeep;
				}
			}
		}
		.status {
			width: 10px;
			height: 10px;

			background-color: $emphasisColorA;
			border-radius: 50%;
		}
		.status.off {
			background-color: $fontColorMedium;
		}
		.status.on {
			background-color: $emphasisColorB;
		}
	}
</style>
