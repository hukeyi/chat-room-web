<template>
	<div class="info-list-item">
		<div class="info">
			<img :src="avatar" />
			<div class="name-id">
				<span id="name">{{ name }}</span>
				<span id="id"> #{{ id }}</span>
			</div>
			<div
				class="status"
				v-if="showStatus"
				:class="{ off: status === 'off', on: status === 'on' }"
			></div>
		</div>

		<el-dropdown v-if="showDropDown">
			<span class="el-dropdown-link">
				<i class="el-icon-arrow-down el-icon--right"></i>
			</span>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item
						v-for="(item, key) in authMenuList"
						:key="key"
						@click="item.handler(id, rId)"
						>{{ item.title }}</el-dropdown-item
					>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
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
				default: 1,
			},
			rId: {
				type: Number,
				default: 1,
			},
			showDropDown: {
				type: Boolean,
				default: true,
			},
			auth: {
				type: String,
				default: 'member',
			},
			status: {
				type: String,
				default: 'off',
			},
			showStatus: {
				type: Boolean,
				default: true,
			},
			menuList: {
				type: Array,
				default: () => [
					{
						title: 'default item',
						handler: function() {
							console.log('default handler');
						},
					},
				],
			},
		},
		computed: {
			authMenuList: function() {
				console.log('rid', this.rId, 'uid', this.id, 'auth', this.auth);
				return this.menuList.filter((item) => item.auth == this.auth);
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

			.status {
				width: 10px;
				height: 10px;
				align-self: center;

				border-radius: 50%;
			}

			.status.off {
				display: none;
			}
			.status.on {
				background-color: $emphasisColorB;
			}
		}
		.el-dropdown-link .el-icon-arrow-down {
			color: $fontColorLight;
		}
	}
</style>
