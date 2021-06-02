<template>
	<div class="info-list-item">
		<div class="info">
			<img :src="info.avatar" />
			<div class="name-id">
				<span id="name">{{ info.name }}</span>
				<span id="id"> #{{ info.id }}</span>
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
						@click="item.handler(info.id, rId)"
						>{{ item.title }}</el-dropdown-item
					>
				</el-dropdown-menu>
			</template>
		</el-dropdown>

		<el-dialog
			title="成员个人信息"
			v-model="menuList[2].show"
			width="30%"
			:before-close="handleClosePop"
			:modal="true"
			:append-to-body="true"
			:show-close="false"
		>
			<InfoDesciption
				:name="info.name"
				:phone="info.phone"
				:gender="info.gender"
				:birthDate="info.birthDate"
			></InfoDesciption>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="menuList[2].show = false">关 闭</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
	import roomApi from '@/api/room';
	import InfoDesciption from './InfoDescItem';

	export default {
		components: { InfoDesciption },
		data() {
			return {
				status: 'on',
				menuList: [
					{
						auth: 'admin',
						title: '移除该成员',
						handler: async function(uId, rId) {
							console.log('remove member', uId);
							await roomApi.PostDeleteMember({ uId, rId });
						},
					},
					{
						auth: 'admin',
						title: '设为管理员',
						handler: function(uId, rId) {
							console.log('set user', uId, rId, 'admin');
						},
					},
					{
						auth: 'member',
						title: '查看个人信息',
						show: false,
						handler: function(uId, rId) {
							console.log('show user', uId, rId, 'info');
							this.show = true;
						},
					},
				],
			};
		},
		props: {
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
			showStatus: {
				type: Boolean,
				default: true,
			},
			info: {
				type: Object,
				default: null,
			},
		},
		computed: {
			authMenuList: function() {
				return this.auth === 'admin'
					? this.menuList
					: this.menuList.filter((item) => item.auth == this.auth);
			},
		},
		methods: {
			handleShowMemberInfo() {
				console.log('handle show member info');
				this.showMemberInfo = true;
			},
			handleClosePop(done) {
				this.$confirm('确认关闭？')
					.then(() => {
						done();
					})
					.catch(() => {});
			},
		},
		mounted() {
			this.status = this.info.isAdmin ? 'on' : 'off';
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
