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
			<!-- 表单格式提示 -->
			<transition name="fade" mode="out-in">
				<div
					v-if="v$.phone.$dirty && v$.phone.$error"
					class="input-prompt"
				>
					请输入格式正确的手机号码
				</div>
			</transition>

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

		<!-- 昵称输入 -->
		<div class="control block-cube block-input">
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
			<!-- 表单格式提示 -->
			<transition name="fade" mode="out-in">
				<div
					v-if="v$.username.$dirty && v$.username.$error"
					class="input-prompt"
				>
					3~16位字符/数字
				</div>
			</transition>

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
			<transition name="fade" mode="out-in">
				<div
					v-if="v$.password.$dirty && v$.password.$error"
					class="input-prompt"
				>
					6～20位数字/字母/下划线
				</div>
			</transition>
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
			<transition name="fade" mode="out-in">
				<div
					v-if="v$.password2.$dirty && v$.password2.$error"
					class="input-prompt"
				>
					两次密码输入不一致
				</div>
			</transition>
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
