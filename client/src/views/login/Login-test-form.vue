<template>
	<div class="signin">
		<div class="control block-cube block-input">
			<input name="username" type="text" placeholder="Phone" />
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
		<div class="control block-cube block-input">
			<input name="password" type="password" placeholder="Password" />
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
		<button class="btn block-cube block-cube-hover">
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
				Log In
			</div>
		</button>
	</div>
</template>

<script>
	import userApi from '@/api/user.js';
	import { mapGetters, mapActions } from 'vuex';
	export default {
		data() {
			const validatePhone = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入手机号'));
				} else {
					const res = /^1[3-9]\d{9}$/.test(value);
					if (!res) {
						callback(new Error('请输入有效手机号'));
					} else {
						callback();
					}
				}
			};
			const validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				} else {
					if (this.ruleForm.checkPass !== '') {
						this.$refs.ruleForm.validateField('checkPass');
					}
					callback();
				}
			};
			return {
				ruleForm: {
					phone: '',
					password: '',
				},
				rules: {
					phone: [{ validator: validatePhone, trigger: 'blur' }],
					password: [{ validator: validatePass, trigger: 'blur' }],
				},
				imgUrl: require('../../assets/chat-logo-trans.png'),
			};
		},
		methods: {
			...mapGetters(['getUserId', 'getUserName']),
			...mapActions([
				'setUserId',
				'setUserName',
				'setUserPhone',
				'setUserInfo',
			]),
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						const postData = {
							userId: this.ruleForm.phone,
							password: this.ruleForm.password,
						};
						userApi
							.Login(postData)
							.then((res) => {
								const { id } = res.data;
								const { token } = res;
								this.setUserInfo(res.data);
								// this.setUserId(id);
								// this.setUserName(name);
								// this.setUserPhone(phone);

								// todo: provide a choice that whether or not remember this account
								// if it checked, store the info in localstorage
								// otherwise in sesssionstorage
								// remember to change the store location in vuex
								localStorage.setItem(`token_${id}`, token);
								this.$router.push(`/user/${id}`);
							})
							.catch((err) => {
								// and control the content, only display string type
								this.$message.error(err);
							});
					} else {
						console.log('error submit');
						return false;
					}
				});
			},
			handleCreateAcc() {
				// change views
				this.$router.push('/register');
			},
			handleChangePass() {
				alert('Not completed');
			},
			// 清除回车键默认事件
			handleEnterClear(e) {
				if (e.preventDefault) e.preventDefault();
				else window.event.value = false;
			},
		},
		mounted() {
			// 响应enter键
			// window.addEventListener('keyup', (event) => {
			// 	if (event.key === 'Enter') {
			// 		this.submitForm('ruleForm');
			// 	}
			// });
		},
	};
</script>

<style lang="scss" scoped>
	*,
	::after,
	::before {
		box-sizing: border-box;
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
		font-family: monospace, serif;
		letter-spacing: 0.05em;
	}

	h1 {
		font-size: 23px;
	}

	.signin {
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
				font-family: monospace, serif;
				letter-spacing: 0.05em;
				font-size: 16px;
				&:hover,
				&:focus {
					outline: none;
					border: 0;
				}
			}
		}
		.btn {
			width: 100%;
			display: block;
			padding: 14px 16px;
			background: transparent;
			outline: none;
			border: 0;
			color: #fff;
			letter-spacing: 0.1em;
			font-weight: bold;
			font-family: monospace;
			font-size: 16px;
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
