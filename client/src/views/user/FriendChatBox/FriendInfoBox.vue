<template>
	<div class="friend-info-box">
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
							labelValue="您可以通过搜索好友ID或昵称来添加好友："
							placeholder="请输入用户ID或昵称"
							:clearable="true"
							@onInput="handleInputId"
						>
							<el-button
								@click="handleClickSearchFriend"
								size="medium"
								class="add-friend-btn"
								>搜索好友</el-button
							>
						</InputItem>
					</div>
					<!-- 无好友 -->
					<div v-else-if="!friendList.length" class="no-friends">
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
							:avatar="item.avatar ? item.avatar : undefined"
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
							:avatar="item.avatar ? item.avatar : undefined"
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
							:avatar="item.avatar ? item.avatar : undefined"
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
							><img :src="drawerInfo.avatar ? drawerInfo.avatar : icon_friend"
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
					<!-- 根据id搜索的好友列表 -->
					<div v-if="showAddFriend" class="add-friend-result">
						<!-- <template > -->
						<div
							class="add-friend-result-item"
							v-for="item in searchResultList"
							:key="item.id"
						>
							<InfoCardItem
								:name="item.name"
								:avatar="item.avatar ? item.avatar : undefined"
								:id="item.id"
								:status="item.status"
							></InfoCardItem>
							<el-button @click="handleClickSend(item)">发送好友申请</el-button>
						</div>
						<!-- </template> -->
					</div>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
	import InputItem from '@/components/InputItem.vue';
	import InfoCardItem from '@/components/InfoCardItem.vue';
	import { mapGetters, mapActions } from 'vuex';
	import friendApi from '@/api/friend.js';

	export default {
		components: { InputItem, InfoCardItem },
		data() {
			return {
				friendList: [],
				searchResultList: [],
				searchId: '',

				icon_friend: require('@/assets/styles/common/img/user.png'),

				showAddFriend: false,
				selectFriendStatus: 'all',
				showRightDrawer: false,
				drawerInfo: undefined, //drawer展示的好友的id
			};
		},
		methods: {
			...mapGetters({
				getList: 'allFriends',
				getOnList: 'onFriends',
				getOffList: 'offFriends',
			}),
			...mapActions(['deleteFriendById', 'deleteFriendChatById']),

			//删除好友
			deleteFriend(id) {
				console.log('start delete friend', id);
				// 1. close right drawer
				this.showRightDrawer = false;

				// 2. delete friendlist'id
				this.deleteFriendById(id);

				// 3. delete 左边栏的私信中的friend chat item（如果有的话）
				this.deleteFriendChatById(id);

				// 4. fixme: axios, request backend to delete friend-id in the database
			},
			// 判断一个字符串是否可能是id
			canBeID(str) {
				console.log('is id', str);
				return true;
				// 1. is all number

				// 2. is within the id length limits
			},
			// fixme
			searchFriendById(id) {
				console.log('start search by id', id);

				// 1. request to backend find friend by id

				// 2. change searchResultList
				this.searchResultList = [
					{ id: 3, name: 'hu', avatar: '', status: 'on' },
					{ id: 4, name: 'wang', avatar: '', status: 'off' },
					{ id: 5, name: 'qian', avatar: '', status: 'on' },
				];
				return true;
			},
			// fixme
			searchFriendByName(name) {
				console.log('start search by name', name);

				// 1. request to backend find friend by name

				// 2. change searchResultList
				this.searchResultList = [
					{ id: 3, name: 'hu', avatar: '', status: 'on' },
					{ id: 4, name: 'wang', avatar: '', status: 'off' },
					{ id: 5, name: 'qian', avatar: '', status: 'on' },
				];
				return true;
			},
			// 发送好友请求
			sendAddRequest(id) {
				console.log('send request to', id);
				// fixme: request to backend send request
			},
			//添加好友按钮的点击事件回调函数
			handleClickAddFriend() {
				this.showAddFriend = true;
				this.selectFriendStatus = '';
			},
			//好友界面头顶栏好友状态菜单选择事件回调函数
			handleSelectStatus(key) {
				this.selectFriendStatus = key;
				this.showAddFriend = false;
			},

			//点击好友card，显示好友信息事件回调函数
			handleClickFriendCard(info) {
				this.drawerInfo = info;
				this.showRightDrawer = !this.showRightDrawer;
			},
			//点击删除好友按钮的回调函数
			handleClickDeleteFriend(id, name) {
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
					.catch((err) => {
						console.log('cancel delete friend', id, err);
					});
			},
			// 搜索好友输入框的input回调函数
			handleInputId(id) {
				this.searchId = id;
			},
			// 搜索好友按钮点击事件的回调函数
			handleClickSearchFriend() {
				console.log('click search', this.searchId);
				const id = this.searchId;
				// 判断是否可能为id
				// 1. 是，先搜id，若无搜name
				// 2. 否，只搜name
				if (this.canBeID(id)) {
					if (!this.searchFriendById(id)) {
						this.searchFriendByName(id);
					}
				} else {
					this.searchFriendByName(id);
				}
			},
			// 发送好友请求按钮的回调函数
			handleClickSend(item) {
				this.$confirm(`是否向 ${item.name} 发送好友申请?`, '', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(() => {
						this.sendAddRequest(item.id);
						this.$message({
							type: 'success',
							message: '发送成功!',
						});
					})
					.catch((err) => {
						console.log('cancel send request', item.id, err);
					});
			},
		},
		mounted() {
			friendApi
				.GetFriendListAll()
				.then((res) => {
					console.log('get friend list', res);
					this.friendList = res;
				})
				.catch((err) => {
					console.log('error friend list', err);
				});
		},
	};
</script>

<style lang="scss" scoped>
	@media (max-width: 1200px) {
		.main-right-sidebar {
			display: none;
		}
	}
	@import '@/assets/styles/user/chat.scss';
</style>
