<template>
	<div class="register">
		<el-form
			:model="ruleForm"
			status-icon
			:rules="rules"
			ref="ruleForm"
			label-width="100px"
			class="demo-ruleForm"
			:hide-required-asterisk="true"
		>
			<el-form-item label="手机号" prop="phone">
				<el-input v-model.number="ruleForm.phone"></el-input>
			</el-form-item>
			<el-form-item label="昵称" prop="username">
				<el-input v-model.number="ruleForm.username"></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input
					type="password"
					v-model="ruleForm.password"
					autocomplete="off"
				></el-input>
			</el-form-item>
			<el-form-item label="确认密码" prop="checkPass">
				<el-input
					type="password"
					v-model="ruleForm.checkPass"
					autocomplete="off"
				></el-input>
			</el-form-item>

			<el-form-item>
				<el-button
					class="register"
					type="primary"
					@click="submitForm('ruleForm')"
					>注册</el-button
				>
			</el-form-item>
			<el-form-item>
				<p class="sign-in-link" @click="handleBackToLogin">
					已有账号？
				</p>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import userApi from '@/api/user.js';
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
			const validateUsername = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请设置您的昵称'));
				} else {
					callback();
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
			const validatePass2 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.ruleForm.password) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				ruleForm: {
					phone: '',
					username: '',
					password: '',
					checkPass: '',
				},
				rules: {
					phone: [{ validator: validatePhone, trigger: 'blur' }],
					username: [
						{ validator: validateUsername, trigger: 'blur' },
					],
					password: [{ validator: validatePass, trigger: 'blur' }],
					checkPass: [{ validator: validatePass2, trigger: 'blur' }],
				},
				imgUrl: require('../../assets/chat-logo-trans.png'),
			};
		},
		methods: {
			handleBackToLogin() {
				// change views
				this.$router.push('/login');
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						const postData = {
							userId: this.ruleForm.phone,
							name: this.ruleForm.username,
							password: this.ruleForm.password,
						};
						userApi
							.Register(postData)
							.then((res) => {
								console.log(res);
								if (res.data && res.data.id) {
									this.$message({
										type: 'success',
										message: '注册成功！',
									});
									res.data.id && this.$router.push('/login');
								} else if (res.data) {
									this.$message.error(res.data.errorMsg);
								} else {
									// if res.data == null
									this.$message.error(
										`服务器返回数据格式错误：${res.data}`
									);
								}
							})
							.catch((err) => {
								this.$message.error('服务器错误');
								console.log(err);
							});
					} else {
						console.log('error submit');
						return false;
					}
				});
			},
		},
		mounted() {},
	};
</script>

<style lang="scss" scoped>
	@import '@/assets/styles/login/login.scss';
</style>
