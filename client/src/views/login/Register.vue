<template>
	<div class="register">
		<inputItem
			labelValue="电子邮箱或电话号码"
			placeholder="email or phone"
			@onInput="handleInputID"
		></inputItem>
		<inputItem
			labelValue="用户名"
			placeholder="2+ characters"
			@onInput="handleInputUsername"
		></inputItem>
		<inputItem
			labelValue="密码"
			placeholder="8+ characters"
			@onInput="handleInputPassword"
		></inputItem>
		<el-button @click="handleClickRegister" size="small">注册</el-button>
		<br />
		<p class="sign-in-link" @click="handleBackToLogin">
			已有账号？
		</p>
	</div>
</template>

<script>
	import InputItem from '../../components/InputItem.vue';
	import userApi from '@/api/user.js';
	export default {
		components: { InputItem },
		data() {
			return {
				userID: '',
				username: '',
				password: '',
				imgUrl: require('../../assets/chat-logo-trans.png'),
			};
		},
		methods: {
			handleBackToLogin() {
				// change views
				this.$router.push('/login');
			},
			handleInputID(input) {
				this.userID = input;
			},
			handleInputUsername(input) {
				this.username = input;
			},
			handleInputPassword(input) {
				this.password = input;
			},
			handleClickRegister() {
				console.log('register btn clicked'); //fixme

				const postData = {
					phone: this.userID,
					name: this.username,
					password: this.password,
				};

				const checkIfInput = async (data) => {
					console.log(data);
					Object.values(data).every((item) => item !== '' && item != undefined);
				};
				// 传后端 axios.post
				checkIfInput(postData)
					.then(() => {
						userApi
							.Register(postData)
							.then((res) => {
								console.log(res);
								if (res.data.id) {
									alert('register success!');
									res.data.id && this.$router.push('/login');
								} else {
									alert(res.data.errorMsg);
								}
							})
							.catch((err) => {
								console.log(err);
							});
					})
					.catch((err) => {
						console.log('post new user', err);
					});
			},
		},
		mounted() {},
	};
</script>

<style lang="scss" scoped>
	@import '@/assets/styles/login/login.scss';
</style>
