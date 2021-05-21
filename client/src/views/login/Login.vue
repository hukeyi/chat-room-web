<template>
	<div class="signin">
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
			<el-form-item label="密码" prop="password">
				<el-input
					type="password"
					v-model="ruleForm.password"
					autocomplete="off"
				></el-input>
			</el-form-item>

			<el-form-item>
				<el-button class="signin" type="primary" @click="submitForm('ruleForm')"
					>登录</el-button
				>
			</el-form-item>
			<el-form-item>
				<p class="sign-in-link" @click="handleCreateAcc">创建账号</p>
				<span style="color: #fff"> | </span>
				<p @click="handleChangePass" class="sign-in-link">忘记密码</p>
			</el-form-item>
		</el-form>
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
			...mapActions(['setUserId', 'setUserName', 'setUserPhone']),
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
								console.log('user api login:', res.data);
								const { id, name, phone } = res.data;
								const { token } = res;
								this.setUserId(id);
								this.setUserName(name);
								this.setUserPhone(phone);

								// todo: provide a choice that whether or not remember this account
								// if it checked, store the info in localstorage
								// otherwise in sesssionstorage
								// remember to change the store location in vuex
								localStorage.setItem('token', token);
								// fixme: need store authenicated status in vuex?
								this.$router.push(`/user/${id}`);
							})
							.catch((err) => {
								// todo: change alert to a element ui message box
								// and control the content, only display string type
								alert(err);
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
		},
		mounted() {
			// 响应enter键
			window.addEventListener('keyup', (event) => {
				if (event.key === 'Enter') {
					this.submitForm('ruleForm');
				}
			});
		},
	};
</script>

<style lang="scss" scoped>
	@import '@/assets/styles/login/login.scss';
</style>
