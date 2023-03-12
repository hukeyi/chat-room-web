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
	*,
	::after,
	::before {
		box-sizing: border-box;
		font-weight: 300;
	}

	// $bg_body: #212121;
	$bg_body: $themeColorDeep;
	$bg_gradient: linear-gradient(
		90deg,
		$emphasisColorA 0%,
		$emphasisColorA 37%,
		$fontColorDeep 94%
	);

	* {
		// background-color: $bg_body;
		color: #fff;
		// font-family: monospace, serif;
		letter-spacing: 0.05em;
	}

	h1 {
		font-size: 23px;
	}

	.signup {
		width: 300px;
		padding: 64px 15px 24px;
		margin: 0 auto;
		.control {
			margin: 0 0 24px;
			input {
				width: 100%;
				padding: 14px 16px;
				border: 0;
				background: transparent;
				color: #fff;
				// font-family: monospace, serif;
				letter-spacing: 0.05em;
				font-size: 16px;
				&:hover,
				&:focus {
					outline: none;
					border: 0;
				}
			}
		}
		// 输入框格式错误显示红色点线
		.error-prompt {
			text-decoration: underline dashed rgb(255, 0, 89) 2.5px;
		}
		.btn {
			// margin: 0 0 24px;
			width: 100%;
			display: block;
			padding: 14px 16px;
			background: transparent;
			outline: none;
			border: 0;
			color: #fff;
			letter-spacing: 0.1em;
			font-weight: bold;
			font-size: 16px;
		}
		.or-sign-in {
			text-decoration: underline $fontColorLight 1.5px;
			text-align: center;
			&:hover {
				cursor: pointer;
			}
		}
	}

	.block-cube {
		position: relative;
		.bg-top {
			position: absolute;
			height: 10px;
			background: rgb(2, 0, 36);
			background: $bg_gradient;
			bottom: 100%;
			left: 5px;
			right: -5px;
			transform: skew(-45deg, 0);
			margin: 0;
			.bg-inner {
				bottom: 0;
			}
		}
		.bg {
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			background: rgb(2, 0, 36);
			background: $bg_gradient;
		}
		.bg-right {
			position: absolute;
			background: rgb(2, 0, 36);
			background: $fontColorDeep;
			top: -5px;
			z-index: 0;
			bottom: 5px;
			width: 10px;
			left: 100%;
			transform: skew(0, -45deg);
			.bg-inner {
				left: 0;
			}
		}
		.bg {
			.bg-inner {
				transition: all 0.2s ease-in-out;
			}
		}
		.bg-inner {
			background: $bg_body;
			position: absolute;
			left: 2px;
			top: 2px;
			right: 2px;
			bottom: 2px;
		}
		.text {
			position: relative;
			z-index: 2;
		}
		&.block-input {
			input {
				position: relative;
				z-index: 2;
				&:focus ~ .bg-right .bg-inner,
				&:focus ~ .bg-top .bg-inner,
				&:focus ~ .bg-inner .bg-inner {
					top: 100%;
					background: rgba(255, 255, 255, 0.5);
				}
			}
			.bg-top,
			.bg-right,
			.bg {
				background: rgba(255, 255, 255, 0.5);
				transition: background 0.2s ease-in-out;
			}
			.bg-right,
			.bg-top {
				.bg-inner {
					transition: all 0.2s ease-in-out;
				}
			}
			&:focus,
			&:hover {
				.bg-top,
				.bg-right,
				.bg {
					background: rgba(255, 255, 255, 0.8);
				}
			}
		}
		// State hover, focus
		&.block-cube-hover:focus,
		&.block-cube-hover:hover {
			.bg {
				.bg-inner {
					top: 100%;
				}
			}
		}
	}
</style>
