<template>
	<div class="login">
		<img id="chat-logo" src="../../assets/chat-logo-trans.png" />
		<div id="input-id">
			<label style="font-weight:900; color: #fff;">USERNAME: </label>
			<el-input
				size="small"
				clearable
				placeholder="Phone or C-Number"
				v-model="user_id"
			/>
			<label style="font-weight:900; color: #fff;">PASSWORD: </label
			><el-input
				size="small"
				clearable
				placeholder="8+ characters"
				show-password
				v-model="password"
			/>
			<el-button size="small">Log In</el-button>
			<p id="sign-in-link">
				<el-link>Create an Account</el-link>
				<span style="color: #fff"> | </span>
				<el-link>Forget Password</el-link>
			</p>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				user_id: '',
				password: '',
			};
		},
		methods: {},
		mounted() {},
	};
</script>

<style lang="scss" scoped>
	.login {
		overflow: hidden;
		// position: relative;
		margin: 0;
		text-align: center;
		padding: 100px 30% 100px;

		background-color: black;

		.el-link {
			text-decoration: underline;
			color: rgb(255, 255, 255);
		}

		#chat-logo {
			width: 300px;
			margin-bottom: 20px;
			margin-left: 35px;
		}
		.el-divider {
			width: auto;
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

			.el-input__inner {
				border-radius: 25px;
			}
		}
	}
</style>
