<template>
	<div class="entrance">
		<el-image id="chat-logo" :src="imgUrl">
			<template #placeholder>
				<div class="image-slot">加载中<span class="dot">...</span></div>
			</template>
		</el-image>
		<router-view />
	</div>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: require('../../assets/chat-logo-trans.png'),
			};
		},
	};
</script>

<style lang="scss" scoped>
	.entrance {
		overflow: hidden;
		text-align: center;
		padding-top: 100px;

		::v-deep #chat-logo {
			width: 300px;
			height: 252px;
			margin-bottom: 20px;
			margin-left: 35px;
		}

		.image-slot {
			width: 300px;
			height: 252px;
			margin-bottom: 20px;
			margin-left: 35px;
		}
	}
</style>
