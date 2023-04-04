<template>
	<div class="login">
		<!-- 手机号输入框 -->
		<!-- add `autocomplete="new-password"` to remove Chrome's 
				weird !important css style(background) -->
		<!-- src: https://stackoverflow.com/questions/43783924/
				disable-google-chrome-autocomplete-autofill-suggestion -->
		<cubic-input
			name="username"
			placeholder="手机号"
			:vModel="v$.phone"
			:isSubmit="isSubmit"
			errorPrompt="请输入格式正确的手机号码"
			@submit="submitForm()"
			@update="updatePhone"
		></cubic-input>

		<!-- 密码输入框 -->
		<cubic-input
			name="password"
			type="password"
			placeholder="密码"
			:vModel="v$.password"
			:isSubmit="isSubmit"
			errorPrompt="6～20位数字/字母/下划线"
			@submit="submitForm()"
			@update="updatePassword"
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
				登 录
			</div>
		</button>
		<p class="switch-link" @click="handleCreateAccount()">
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

	import CubicInput from '@/views/components/CubicInputItem.vue';

	export default {
		components: { CubicInput },
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
			updatePhone(value) {
				this.phone = value;
			},
			updatePassword(value) {
				this.password = value;
			},
			async submitForm() {
				console.log(`phone: ${this.phone}, password: ${this.password}`);

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
	@import '@/assets/styles/login/index.scss';
	@import '@/assets/styles/login/cube.scss';
	// 动画
	@import '@/assets/styles/transition.scss';
</style>
