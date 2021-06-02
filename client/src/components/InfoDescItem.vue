<template>
	<div class="info-desc-item">
		<el-row>
			<el-col class="label" :span="8">昵称</el-col>
			<el-col class="content" :span="8">{{ name }}</el-col>
		</el-row>
		<el-row>
			<el-col class="label" :span="8">手机号</el-col>
			<el-col class="content" :span="8">{{ phone }}</el-col>
		</el-row>
		<el-row>
			<el-col class="label" :span="8">性别</el-col>
			<el-col class="content" :span="8">{{ gender }}</el-col>
		</el-row>
		<el-row>
			<el-col class="label" :span="8">生日</el-col>
			<el-col class="content" :span="8">{{ birthDate }}</el-col>
		</el-row>
	</div>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: '用户信息',
			},
			name: {
				type: String,
				default: 'userA',
			},
			id: {
				type: Number,
				default: 0,
			},
			phone: {
				type: String,
				default: 'xxxxx',
			},
			gender: {
				type: String,
				default: '女',
			},
			birthDate: {
				type: String,
				default: '2000-01-01',
			},
		},
	};
</script>

<style lang="scss" scoped>
	.info-desc-item {
		font-size: 15px;
		.label {
			color: $emphasisColorA;
			font-weight: bold;
		}
		.content {
			font-weight: bolder;
		}
	}
</style>
