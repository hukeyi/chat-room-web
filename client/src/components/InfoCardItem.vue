<template>
	<div class="info-card-item">
		<div class="info">
			<img :src="avatar" />
			<div class="name-id">
				<span id="name">{{ name }}</span>
				<br />
				<span id="id">#{{ id }}</span>
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
				default: 'friendA',
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
	.info-card-item {
		height: auto;
		width: 300px;
		margin: 10px;
		padding: 10px !important;

		// border: 2px solid $themeColorDeep;
		border-radius: 5px;

		background-color: $themeColorMedium;
		opacity: 0.9;

		display: flex;
		align-items: center;
		justify-content: space-between;

		.info {
			display: flex;
			justify-content: flex-start;
			width: 40%;

			img {
				width: 40px;
				height: 40px;

				background-color: $emphasisColorA;
				border-radius: 50%;
			}
			.name-id {
				margin: auto;
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
