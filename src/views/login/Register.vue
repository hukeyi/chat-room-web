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
				console.log('input id', input); //fixme
			},
			handleInputUsername(input) {
				this.username = input;
				console.log('input username', input); //fixme
			},
			handleInputPassword(input) {
				this.password = input;
				console.log('input password', input); //fixme
			},
			handleClickRegister() {
				console.log('register btn clicked'); //fixme

				// 传后端 axios.post
			},
		},
		mounted() {},
	};
</script>

<style lang="scss" scoped>
	.register {
		overflow: hidden;
		text-align: center;
		padding: 0px 30% 100px;

		.sign-in-link {
			margin-top: 10px;
			display: inline-block;
			text-decoration: underline;
			color: rgb(255, 255, 255);
			font-size: 12px;
		}

		.el-button {
			width: 250px;
			border-radius: 25px;
			color: #fff;
			background-color: #262626;
		}

		.el-input {
			width: 250px;
			margin-bottom: 20px;
		}
	}
</style>
