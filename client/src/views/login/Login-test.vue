<template>
	<div class="signin">
		<div class="container">
			<div class="top"></div>
			<div class="bottom"></div>
			<div class="center">
				<SignInForm></SignInForm>
			</div>
		</div>
	</div>
</template>

<script>
	import SignInForm from './Login-test-form.vue';
	import userApi from '@/api/user.js';
	import { mapGetters, mapActions } from 'vuex';
	export default {
		components: { SignInForm },
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
	@import url('https://fonts.googleapis.com/css?family=Raleway:400,700');

	*,
	*:before,
	*:after {
		box-sizing: border-box;
	}

	body {
		min-height: 100vh;
		font-family: 'Raleway', sans-serif;
	}

	.container {
		position: absolute;
		width: 100%;
		height: 100%;
		overflow: hidden;

		&:hover,
		&:active {
			.top,
			.bottom {
				&:before,
				&:after {
					margin-left: 260px;
					transform-origin: -255px 50%;
					transition-delay: 0s;
				}
			}

			.center {
				opacity: 1;
				transition-delay: 0.2s;
			}
		}
	}

	.top,
	.bottom {
		&:before,
		&:after {
			content: '';
			display: block;
			position: absolute;
			width: 200vmax;
			height: 200vmax;
			top: 50%;
			left: 50%;
			margin-top: -100vmax;
			transform-origin: 0 50%;
			transition: all 0.5s cubic-bezier(0.445, 0.05, 0, 1);
			z-index: 10;
			opacity: 0.65;
			transition-delay: 0.2s;
		}
	}

	.top {
		&:before {
			transform: rotate(45deg);
			background: $fontColorMedium;
		}
		&:after {
			transform: rotate(135deg);
			background: $emphasisColorA;
		}
	}

	.bottom {
		&:before {
			transform: rotate(-45deg);
			background: $themeColorLight;
		}
		&:after {
			transform: rotate(-135deg);
			background: $emphasisColorB;
		}
	}

	.center {
		position: absolute;
		width: 400px;
		height: 400px;
		// 水平垂直居中
		top: 50%;
		left: 50%;
		margin-left: -200px;
		margin-top: -200px;
		padding: 30px;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		opacity: 0;
		color: #333;

		// cubic-bezier 是曲线变化函数，用于产生丝滑的移动效果
		transition: all 0.5s cubic-bezier(0.445, 0.05, 0, 1);
		transition-delay: 0s;
	}
</style>
