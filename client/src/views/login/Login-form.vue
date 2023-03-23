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
				:class="{
					'error-prompt':
						isSubmit && v$.phone.$dirty && v$.phone.$error,
				}"
			/>
			<!-- 表单格式提示 -->
			<transition name="fade" mode="out-in">
				<div
					v-if="isSubmit && v$.phone.$dirty && v$.phone.$error"
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
					'error-prompt':
						isSubmit && v$.password.$dirty && v$.password.$error,
				}"
			/>
			<!-- 表单格式提示 -->
			<transition name="fade" mode="out-in">
				<div
					v-if="isSubmit && v$.password.$dirty && v$.password.$error"
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
				isSubmit: false,
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
				const isFormCorrect = await this.v$.$validate();
				if (isFormCorrect) {
					this.showLoader(); // start loading;
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
					this.isSubmit = false;
				} else {
					this.isSubmit = true;
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
	};
</script>

<style lang="scss" scoped>
	@import '@/assets/styles/login/login.scss';
	@import '@/assets/styles/transition.scss';
</style>
