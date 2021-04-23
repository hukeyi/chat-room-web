<template>
	<div class="friend-chat-box">
		<el-container class="main-area">
			<!-- 好友界面：头顶栏，选择好友状态分类 -->
			<el-header class="main-header">
				<div class="main-header-title">
					<img :src="icon_friend" /><span style="margin: auto 10px;">好友</span>
				</div>
				<el-divider
					class="main-header-divider"
					direction="vertical"
				></el-divider>
				<el-menu
					@select="handleSelectStatus"
					class="main-header-menu"
					mode="horizontal"
					:default-active="selectFriendStatus"
				>
					<el-menu-item index="all">全部</el-menu-item>
					<el-menu-item index="on">在线</el-menu-item>
					<el-menu-item index="off">离线</el-menu-item>
				</el-menu>
				<el-divider
					class="main-header-divider"
					direction="vertical"
				></el-divider>
				<el-button
					@click="handleClickAddFriend"
					size="medium"
					class="main-header-btn"
					:class="{ 'is-active': showAddFriend }"
					>添加朋友</el-button
				>
			</el-header>
			<!-- 添加好友；显示好友列表界面 -->
			<el-container>
				<el-main class="main-central">
					<!-- 添加好友+搜索好友 -->
					<div v-if="showAddFriend" class="add-friend">
						<InputItem
							itemStyle="
							padding: 20px !important; 
							width: 400px; 
							height: auto; 
							overflow: hidden;
							"
							inputStyle="float: left; width: 60%;"
							labelValue="您可以通过搜索好友ID来添加好友："
							placeholder="请输入用户ID"
							:clearable="true"
						>
							<el-button size="medium" class="add-friend-btn"
								>搜索好友</el-button
							>
						</InputItem>
					</div>
					<!-- 无好友 -->
					<div v-if="!showAddFriend && !friendList.length" class="no-friends">
						<el-empty
							description="暂时没有好友，赶快搜索好友开始聊天吧"
							:image-size="200"
						>
							<el-button
								size="medium"
								class="add-friend-btn"
								@click="handleClickAddFriend"
								>添加好友</el-button
							>
						</el-empty>
					</div>
					<!-- 所有好友信息列表 -->
					<div v-else-if="selectFriendStatus === 'all'" class="friend-list-all">
						<InfoCardItem
							v-for="item in friendList"
							:key="item.id"
							:name="item.name"
							:avator="item.avator ? item.avator : undefined"
							:id="item.id"
							:status="item.status"
							@click="handleClickFriendCard(item)"
						></InfoCardItem>
					</div>
					<!-- 在线好友信息列表 -->
					<div v-else-if="selectFriendStatus === 'on'" class="friend-list-on">
						<InfoCardItem
							v-for="item in getOnList()"
							:key="item.id"
							:name="item.name"
							:avator="item.avator ? item.avator : undefined"
							:id="item.id"
							:status="item.status"
							@click="handleClickFriendCard(item)"
						></InfoCardItem>
					</div>
					<!-- 离线好友信息列表 -->
					<div v-else-if="selectFriendStatus === 'off'" class="friend-list-off">
						<InfoCardItem
							v-for="item in getOffList()"
							:key="item.id"
							:name="item.name"
							:avator="item.avator ? item.avator : undefined"
							:id="item.id"
							:status="item.status"
							@click="handleClickFriendCard(item)"
						></InfoCardItem>
					</div>
					<!-- 好友信息边栏，点击某个好友的card，从右往左弹出指定好友的信息 -->
					<el-drawer
						custom-class="friend-info-drawer"
						:withHeader="false"
						v-model="showRightDrawer"
						direction="rtl"
						destroy-on-close
					>
						<el-row type="flex" justify="center"
							><img :src="drawerInfo.avator ? drawerInfo.avator : icon_friend"
						/></el-row>
						<el-row type="flex" justify="center">{{ drawerInfo.id }}</el-row>
						<el-row type="flex" justify="center">{{ drawerInfo.name }}</el-row>
						<el-row type="flex" justify="center">{{
							drawerInfo.status
						}}</el-row>
						<el-row class="btn-group" type="flex" justify="center">
							<el-button id="start-chat" size="medium">发起私聊</el-button>
							<el-button
								id="delete-friend"
								size="medium"
								@click="handleClickDeleteFriend(drawerInfo.id, drawerInfo.name)"
								>删除好友</el-button
							>
						</el-row>
					</el-drawer>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
	import InputItem from '@/components/InputItem.vue';
	import InfoCardItem from '@/components/InfoCardItem.vue';

	export default {
		components: { InputItem, InfoCardItem },
		data() {
			return {
				icon_friend: require('@/assets/styles/common/img/user.png'),
				showAddFriend: false,
				friendList: [
					{ id: '0', name: 'frank', avator: '', status: 'on' },
					{ id: '1', name: 'john', avator: '', status: 'off' },
					{ id: '2', name: 'mary', avator: '', status: 'on' },
				],
				selectFriendStatus: 'all', //默认全部

				showRightDrawer: false,
				drawerInfo: undefined, //drawer展示信息的好友的id

				showDialog: false,
			};
		},
		methods: {
			/**
			 * 获取在线好友列表
			 */
			getOnList() {
				return this.friendList.filter((item) => item.status === 'on');
			},
			/**
			 * 获取离线好友列表
			 */
			getOffList() {
				return this.friendList.filter((item) => item.status === 'off');
			},

			/**
			 * 删除好友
			 */
			deleteFriend(id) {
				console.log('start delete friend', id);
				// 1. close right drawer
				this.showRightDrawer = false;

				// 2. delete friendlist'id
				this.friendList.splice(
					this.friendList.findIndex((item) => item.id === id),
					1
				);

				// 3. delete 左边栏的私信中的friend chat item（如果有的话）
				// 通过触发事件"deleteChatItem"

				// 4. fixme: axios, request backend to delete friend-id in the database
			},
			/**
			 * 添加好友按钮的点击事件回调函数
			 */
			handleClickAddFriend() {
				this.showAddFriend = true;
				this.selectFriendStatus = '';
			},
			/**
			 * 好友界面头顶栏好友状态菜单选择事件回调函数
			 */
			handleSelectStatus(key) {
				//好友在线状态选择 header selector
				console.log('select status', key);
				this.selectFriendStatus = key;
				this.showAddFriend = false;
			},
			/**
			 * 点击好友card，显示好友信息事件回调函数
			 */
			handleClickFriendCard(item) {
				console.log('click friend card', item);
				this.drawerInfo = item; // 点击的朋友id
				this.showRightDrawer = !this.showRightDrawer;
			},
			/**
			 * 点击删除好友按钮的回调函数
			 */
			handleClickDeleteFriend(id, name) {
				console.log('click delete friend', id);

				this.$confirm(`是否确认删除好友${name}?`, '确认删除', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(() => {
						this.deleteFriend(id);
						this.$message({
							type: 'success',
							message: '删除成功!',
						});
					})
					.catch(() => {});
			},
		},
		mounted() {
			// get whole friend list
		},
	};
</script>

<style lang="scss" scoped>
	@media (max-width: 1200px) {
		.main-right-sidebar {
			display: none;
		}
	}
	@import '@/assets/styles/home/chat.scss';
</style>
