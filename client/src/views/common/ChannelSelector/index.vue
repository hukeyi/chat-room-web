<template>
	<!-- 主页最左边栏界面 -->
	<div class="channel-selector">
		<!-- 用户主页 -->
		<SelectorItem
			:icon="icon_userhome"
			:link="getUserHomeUrl()"
		></SelectorItem>
		<!-- <hr width="60%" class="level-divider" /> -->
		<!-- 聊天室主页 -->
		<SelectorItem :icon="icon_room" :link="getRoomHomeUrl()"></SelectorItem>
		<!-- 用户个人信息页面 -->
		<SelectorItem
			:icon="icon_userInfo"
			:link="getSettingUrl()"
		></SelectorItem>
	</div>
</template>

<script>
	import SelectorItem from './ChannelSelectorItem';
	import { mapGetters } from 'vuex';
	export default {
		data() {
			return {
				icon_userhome: require('@/assets/styles/common/img/user.png'),
				icon_room: require('@/assets/styles/common/img/international.png'),
				icon_userInfo: require('@/assets/styles/common/img/setting.png'),
			};
		},
		components: {
			SelectorItem,
		},
		methods: {
			...mapGetters(['getUserId']),
			getUserHomeUrl() {
				return `user/${this.getUserId()}`;
			},
			getRoomHomeUrl() {
				return `group/${this.getUserId()}`;
			},
			getSettingUrl() {
				return `setting/${this.getUserId()}`;
			},
		},
	};
</script>

<style lang="scss" scoped>
	.channel-selector {
		width: 100%;
		height: 100%;
		background-color: transparent;

		.level-divider {
			margin: 0 auto;
			background-color: $themeColorMedium;
			height: 2px;
			border-radius: 2px;
			border-width: 0px;
		}
	}
</style>
