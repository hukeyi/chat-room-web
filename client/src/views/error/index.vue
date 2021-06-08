<template>
	<div class="error-page">
		{{ code && code !== '' ? code : defaultCode }}
		{{ getErrorMsg(code) }}
		<br />
		<el-button @click="toLogin">回到登录页</el-button>
	</div>
</template>

<script>
	/*
	 * @Author: Hu Keyi
	 * @Date: 2021-05-05 22:20:43
	 * @Last Modified by: Hu Keyi
	 * @Last Modified time: 2021-05-27 00:14:50
	 */
	export default {
		props: ['code'],
		data() {
			return {
				defaultCode: '404',
				msgHash: {
					404: 'Not Found',
					403: 'Not authorized',
					500: 'Server Error',
				},
			};
		},
		methods: {
			getErrorMsg(code) {
				const theCode = code && code !== '' ? code : this.defaultCode;
				const msg = this.msgHash[Number(theCode)];
				return msg ? msg : 'Something went wrong';
			},
			toLogin() {
				this.$router.push('/');
			},
		},
		mounted() {},
	};
</script>

<style lang="scss" scope>
	.error-page {
		color: $fontColorLight;
		margin: 25px;
		font-size: 20px;
	}
</style>
