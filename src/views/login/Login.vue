<template>
	<div class="signin">
		<inputItem
			labelValue="电子邮箱或电话号码"
			placeholder="email or phone"
			@onInput="handleInputUsername"
		></inputItem>
		<inputItem
			labelValue="密码"
			placeholder="8+ characters"
			@onInput="handleInputPassword"
		></inputItem>

		<el-button @click="handleClickLogin" size="small">登录</el-button>
		<div style="margin-top: 10px;">
			<p class="sign-in-link" @click="handleCreateAcc">创建账号</p>
			<span style="color: #fff"> | </span>
			<p class="sign-in-link">忘记密码</p>
		</div>
	</div>
</template>

<script>
	import InputItem from '../../components/InputItem.vue';
	export default {
		components: { InputItem },
		data() {
			return {
				userId: '',
				password: '',
				imgUrl: require('../../assets/chat-logo-trans.png'),
			};
		},
		methods: {
			handleClickLogin() {
				console.log('login btn clicked'); //fixme

				// 传后端验证用户名和密码

				// 进入用户主页
				this.$router.push('/me');
			},
			handleCreateAcc() {
				// change views
				this.$router.push('/register');
			},
			handleChangePass() {
				// change views
			},
			handleInputUsername(input) {
				this.userId = input;
				console.log('input username:', this.userId); //fixme
			},
			handleInputPassword(input) {
				this.password = input;
				console.log('input password:', this.password); //fixme
			},
		},
		mounted() {},
	};
</script>

<style lang="scss" scoped>
	@import '@/assets/styles/login/login.scss';
</style>
