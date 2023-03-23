<template>
	<div class="login">
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
				name="username"
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
				登 录
			</div>
		</button>
		<p class="or-sign-in" @click="handleCreateAccount()">
			或者注册？
		</p>
	</div>
</template>

<script>
	import userApi from '@/api/user.js';
	import { mapGetters, mapActions, mapMutations } from 'vuex';
	// vuelidate: https://vuelidate-next.netlify.app/
	import { useVuelidate } from '@vuelidate/core';
	import { required } from '@vuelidate/validators';
	import { validatePhone, validatePassword } from '@/utils/validators';

	export default {
		setup() {
			return {
				v$: useVuelidate(),
			};
		},
		data() {
			return {
				phone: '',
				password: '',
				imgUrl: require('../../assets/chat-logo-trans.png'),
			};
		},
		validations() {
			return {
				phone: {
					required,
					validatePhone,
				},
				password: {
					required,
					validatePassword,
				},
			};
		},
		methods: {
			...mapGetters(['getUserId', 'getUserName']),
			...mapMutations({
				showLoader: 'showFullPageLoader',
				hideLoader: 'hideFullPageLoader',
			}),
			...mapActions(['setUserInfo']),
			async submitForm() {
				this.showLoader(); // start loading;

				const isFormCorrect = await this.v$.$validate();
				if (isFormCorrect) {
					const postData = {
						userId: this.phone,
						password: this.password,
					};
					try {
						let res = await userApi.Login(postData);
						const { id } = res.data;
						const { token } = res;
						this.setUserInfo(res.data);
						localStorage.setItem(`token_${id}`, token);
						this.$router.push(`/user/${id}`);
					} catch (err) {
						this.$message.error(err ? err : '系统繁忙，请稍后');
					} finally {
						this.hideLoader();
					}
				} else {
					this.$message.error('手机号或密码格式错误！');
					this.hideLoader();
				}
			},
			// to register page
			handleCreateAccount() {
				this.$router.push('/register');
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
