<template>
	<div class="friend-chat-box">
		<el-container class="main-area">
			<el-header class="main-header">
				<div class="main-header-title">
					<img :src="icon_friend" /><span style="margin: auto 10px;"
						># {{ $route.params.fId }}</span
					>
				</div>
			</el-header>
			<el-container>
				<el-main class="main-central">
					<div class="chat-box-window">
						<!-- fixme: 根据传来的聊天信息数组，用v-for渲染消息，
						消息用一个聊天消息小组件渲染 -->
						<ChatMessage
							v-for="item in messageList"
							:key="item.id"
							:direction="item.direction"
							:avator="item.avator ? item.avator : undefined"
							:name="item.name"
							:time="item.time"
							:message="item.message"
						></ChatMessage>
					</div>
					<div class="chat-box-input">
						<!-- 输入框 -->
						<el-input
							type="textarea"
							:autosize="{ minRows: 1, maxRows: 2 }"
							v-model="myInputMessage"
							placeholder="请输入信息"
							id="input-frame"
						/>
						<!-- 表情按钮 -->
						<i class="el-icon-cherry" id="emoji-btn"></i>
						<!-- 发送按钮？需要吗？或者直接默认为enter发送 -->
						<i class="el-icon-position" id="send-btn"></i>
					</div>
				</el-main>
				<el-aside class="main-right-sidebar"></el-aside>
			</el-container>
		</el-container>
	</div>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex';
	import ChatMessage from '@/components/ChatMessageItem.vue';
	import testData from './test-messages.json';

	export default {
		components: { ChatMessage },
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

				myInputMessage: '',

				messageList: testData,
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
					{ id: '3', name: 'hu', avator: '', status: 'on' },
					{ id: '4', name: 'wang', avator: '', status: 'off' },
					{ id: '5', name: 'qian', avator: '', status: 'on' },
				];
				return true;
			},
			// fixme
			searchFriendByName(name) {
				console.log('start search by name', name);

				// 1. request to backend find friend by name

				// 2. change searchResultList
				this.searchResultList = [
					{ id: '3', name: 'hu', avator: '', status: 'on' },
					{ id: '4', name: 'wang', avator: '', status: 'off' },
					{ id: '5', name: 'qian', avator: '', status: 'on' },
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
			this.friendList = this.getList();
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
