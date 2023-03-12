<template>
	<div class="signup">
		<!-- 手机号输入框 -->
		<div class="control block-cube block-input">
			<!-- add `autocomplete="new-password"` to remove Chrome's 
				weird !important css style(background) -->
			<!-- src: https://stackoverflow.com/questions/43783924/
				disable-google-chrome-autocomplete-autofill-suggestion -->
			<input
				v-model.number="v$.phone.$model"
				@keydown.enter="handleEnterClear"
				@keyup.enter="submitForm()"
				name="phone"
				type="text"
				placeholder="手机号"
				autocomplete="new-password"
				:class="{ 'error-prompt': v$.phone.$dirty && v$.phone.$error }"
			/>

			<!-- 效果 -->
			<div class="bg-top">
				<div class="bg-inner"></div>
			</div>
			<div class="bg-right">
				<div class="bg-inner"></div>
			</div>
			<div class="bg">
				<div class="bg-inner"></div>
			</div>
		</div>
		<!-- 表单验证错误信息 -->
		<!-- <div class="invalid-feedback" v-if="!v$.phone.required">
			Phone is required
		</div>
		<div class="invalid-feedback">
			{{ v$.phone.$error ? 'Invalid phone number' : '' }}
		</div> -->
		<!-- 昵称输入 -->
		<div class="control block-cube block-input">
			<!-- add `autocomplete="new-password"` to remove Chrome's 
				weird !important css style(background) -->
			<!-- src: https://stackoverflow.com/questions/43783924/
				disable-google-chrome-autocomplete-autofill-suggestion -->
			<input
				v-model.number="v$.username.$model"
				@keydown.enter="handleEnterClear"
				@keyup.enter="submitForm()"
				name="username"
				type="text"
				placeholder="昵称"
				autocomplete="new-password"
				:class="{
					'error-prompt': v$.username.$dirty && v$.username.$error,
				}"
			/>

			<!-- 效果 -->
			<div class="bg-top">
				<div class="bg-inner"></div>
			</div>
			<div class="bg-right">
				<div class="bg-inner"></div>
			</div>
			<div class="bg">
				<div class="bg-inner"></div>
			</div>
		</div>
		<!-- 密码输入框 -->
		<div class="control block-cube block-input">
			<input
				type="password"
				v-model="v$.password.$model"
				autocomplete="off"
				@keydown.enter="handleEnterClear"
				@keyup.enter="submitForm()"
				name="password"
				placeholder="密码"
				:class="{
					'error-prompt': v$.password.$dirty && v$.password.$error,
				}"
			/>
			<!-- 效果 -->
			<div class="bg-top">
				<div class="bg-inner"></div>
			</div>
			<div class="bg-right">
				<div class="bg-inner"></div>
			</div>
			<div class="bg">
				<div class="bg-inner"></div>
			</div>
		</div>
		<!-- 重复输入密码 -->
		<div class="control block-cube block-input">
			<input
				type="password"
				v-model="v$.password2.$model"
				autocomplete="off"
				@keydown.enter="handleEnterClear"
				@keyup.enter="submitForm()"
				name="password2"
				placeholder="确认密码"
				:class="{
					'error-prompt': v$.password2.$dirty && v$.password2.$error,
				}"
			/>
			<!-- 效果 -->
			<div class="bg-top">
				<div class="bg-inner"></div>
			</div>
			<div class="bg-right">
				<div class="bg-inner"></div>
			</div>
			<div class="bg">
				<div class="bg-inner"></div>
			</div>
		</div>
		<!-- 表单验证错误信息 -->
		<!-- <div class="invalid-feedback" v-if="!v$.password.required">
			Password is required
		</div> -->
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
	// validator for phone
	const validatePhone = (value) => /^1[3-9]\d{9}$/.test(value);

	export default {
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
				},
				password: {
					required,
					// todo: add more validator for pwd
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
					this.$message.error('手机号或密码格式错误！');
					return false;
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
		mounted() {},
	};
</script>

<style lang="scss" scoped>
	@import '@/assets/styles/login/login.scss';
</style>
