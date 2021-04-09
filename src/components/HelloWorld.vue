<template>
	<div class="hello">
		<h1>{{ msg }}</h1>
		<form>
			<input type="text" name="username" v-model="userName" /> <br />
			<input type="text" name="age" v-model="age" /> <br />
			<a href="javascript:;" @click="addUser">提交</a>
		</form>
	</div>
</template>

<script>
	export default {
		name: 'HelloWorld',
		props: {
			msg: String,
		},
		data() {
			return {
				userName: '',
				age: '',
			};
		},
		methods: {
			addUser() {
				var name = this.userName;
				var age = this.age;
				this.$http
					.post(
						'/api/user/addUser',
						{
							username: name,
							age: age,
						},
						{}
					)
					.then((response) => {
						console.log(response);
					});
			},
		},
		mounted() {
			// console.log(this.$router);
			// console.log(this.$store);
		},
	};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	h3 {
		margin: 40px 0 0;
	}
	ul {
		list-style-type: none;
		padding: 0;
	}
	li {
		display: inline-block;
		margin: 0 10px;
	}
	a {
		color: #42b983;
	}
</style>
