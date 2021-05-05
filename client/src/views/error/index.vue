<template>
	<div class="error-page">
		{{ code && code !== '' ? code : defaultCode }}
		{{ getErrorMsg(code) }}
	</div>
</template>

<script>
	/*
	 * @Author: Hu Keyi
	 * @Date: 2021-05-05 22:20:43
	 * @Last Modified by: Hu Keyi
	 * @Last Modified time: 2021-05-05 22:25:52
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
