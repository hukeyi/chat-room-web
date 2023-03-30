<template>
	<div class="signup">
		<!-- 手机号输入框 -->
		<cubic-input
			name="phone"
			placeholder="手机号"
			:vModel="v$.phone"
			:isSubmit="true"
			errorPrompt="请输入格式正确的手机号码"
			@submit="submitForm()"
			@update="updatePhone"
		></cubic-input>

		<!-- 昵称输入 -->
		<cubic-input
			name="username"
			placeholder="昵称"
			:vModel="v$.username"
			:isSubmit="true"
			errorPrompt="3~16位字符/数字"
			@submit="submitForm()"
			@update="updateUsername"
		></cubic-input>

		<!-- 密码输入框 -->
		<cubic-input
			name="password"
			type="password"
			placeholder="密码"
			:vModel="v$.password"
			:isSubmit="true"
			errorPrompt="6～20位数字/字母/下划线"
			@submit="submitForm()"
			@update="updatePassword"
		></cubic-input>

		<!-- 重复输入密码 -->
		<cubic-input
			name="password2"
			type="password"
			placeholder="再次输入密码"
			:vModel="v$.password2"
			:isSubmit="true"
			errorPrompt="两次密码输入不一致"
			@submit="submitForm()"
			@update="updatePassword2"
		></cubic-input>

		<button @click="submitForm()" class="btn block-cube block-cube-hover">
			<div class="bg-top">
				<div class="bg-inner"></div>
			</div>
			<div class="bg-right">
				<div class="bg-inner"></div>
			</div>
			<div class="bg">
				<div class="bg-inner"></div>
			</div>
			<div class="text">
				注 册
			</div>
		</button>

		<p class="or-sign-in" @click="handleBackToLogin()">
			已有账号？
		</p>
	</div>
</template>

<script>
	import userApi from '@/api/user.js';
	import { mapGetters, mapActions } from 'vuex';
	// vuelidate: https://vuelidate-next.netlify.app/
	import { useVuelidate } from '@vuelidate/core';
	import { required, sameAs } from '@vuelidate/validators';
	import {
		validatePhone,
		validatePassword,
		validateUsername,
	} from '@/utils/validators';
	import CubicInput from './CubicInputComponent.vue';

	export default {
		components: {
			CubicInput,
		},
		setup() {
			return {
				v$: useVuelidate(),
			};
		},
		data() {
			return {
				phone: '',
				username: '',
				password: '',
				password2: '',
				imgUrl: require('../../assets/chat-logo-trans.png'),
			};
		},
		validations() {
			return {
				phone: {
					required,
					validatePhone,
				},
				username: {
					required,
					validateUsername,
				},
				password: {
					required,
					validatePassword,
				},
				password2: {
					required,
					sameAsPassword: sameAs(this.password),
				},
			};
		},
		methods: {
			...mapGetters(['getUserId', 'getUserName']),
			...mapActions(['setUserInfo']),
			updatePhone(value) {
				this.phone = value;
			},
			updateUsername(value) {
				this.username = value;
			},
			updatePassword(value) {
				this.password = value;
			},
			updatePassword2(value) {
				this.password2 = value;
			},
			async submitForm() {
				const isFormCorrect = await this.v$.$validate();
				if (isFormCorrect) {
					const postData = {
						userId: this.phone,
						name: this.username,
						password: this.password,
					};
					try {
						let res = await userApi.Register(postData);
						console.log(res);
						if (res && res.data && res.data.id) {
							this.$message({
								type: 'success',
								message: '注册成功！',
							});
							res.data.id && this.$router.push('/login');
						} else if (res && res.data) {
							this.$message.error(res.data.errorMsg);
						} else {
							this.$message.error(
								`服务器返回数据格式错误：${res.data || res}`
							);
						}
					} catch (err) {
						this.$message.error('服务器错误');
						console.log(err);
					}
				} else {
					// this.$message.error('手机号或密码格式错误！');
				}
			},
			// to login page
			handleBackToLogin() {
				this.$router.push('/login');
			},
			// 清除回车键默认事件
			handleEnterClear(e) {
				if (e.preventDefault) e.preventDefault();
				else window.event.value = false;
			},
		},
	};
</script>

<style lang="scss" scoped>
	@import '@/assets/styles/login/login.scss';
	@import '@/assets/styles/transition.scss';
</style>
