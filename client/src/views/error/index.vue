<template>
	<div class="error-page">
		<h1 class="error-code">
			{{ code && code !== '' ? code : defaultCode }}
		</h1>
		<p class="error-msg">{{ getErrorMsg(code) }}</p>
		<el-button v-if="code[0] != '5'" class="error-btn" @click="toLogin"
			>返回登录页</el-button
		>
		<p class="error-msg" v-else>努力检修中，请稍后再试。</p>
	</div>
</template>

<script>
	/*
	 * @Author: Hu Keyi
	 * @Date: 2021-05-05 22:20:43
	 * @Last Modified by: Hu Keyi
	 * @Last Modified time: 2023-03-22 18:54:38
	 */
	export default {
		props: ['code'],
		data() {
			return {
				defaultCode: '404',
				msgHash: {
					404: '抱歉，页面未找到 :(',
					403: '抱歉，您没有访问此页面的权限 :(',
					500: '抱歉，服务器异常 :(',
				},
			};
		},
		methods: {
			getErrorMsg(code) {
				const theCode = code && code !== '' ? code : this.defaultCode;
				const msg = this.msgHash[Number(theCode)];
				return msg ? msg : '服务器异常';
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
		height: 100%;
		width: 100%;
		* {
			margin: 0;
		}

		// background-color: $themeColorLight;
		color: $fontColorDeep;
		text-align: center;

		.error-code {
			padding-top: 3rem;
			font-size: 12rem;
		}
		.error-msg {
			padding: 2rem;
			padding-top: 0;
			color: $fontColorDeep;
			font-weight: 400;
			font-size: 1.5rem;
		}
		.error-btn {
			background-color: $emphasisColorA;
			border-color: $emphasisColorA;
			color: $fontColorLight;
			font-size: 1.5rem;
			font-weight: 300;

			&:active,
			&:hover {
				background-color: $fontColorLight;
				border-color: $fontColorLight;
				color: $emphasisColorA;
			}
		}
	}
</style>
