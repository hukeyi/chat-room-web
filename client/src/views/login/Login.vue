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
	import userApi from '@/api/user.js';
	import { mapGetters, mapActions } from 'vuex';
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
			...mapGetters(['getUserId', 'getUserName']),
			...mapActions(['setUserId', 'setUserName']),
			handleClickLogin() {
				console.log('login btn clicked'); //fixme

				userApi
					.Login(this.userId, this.password)
					.then((res) => {
						console.log(res);
						this.setUserId(res.id);
						this.setUserName(res.name);
						this.$router.push(`/user/${res.id}`);
					})
					.catch((err) => {
						console.log(err);
					});
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
			},
			handleInputPassword(input) {
				this.password = input;
			},
		},
		mounted() {},
	};
</script>

<style lang="scss" scoped>
	@import '@/assets/styles/login/login.scss';
</style>
