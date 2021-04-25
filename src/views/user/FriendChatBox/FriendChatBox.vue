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
					<div class="chat-box-window" ref="chatBox">
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
							v-model="inputText"
							placeholder="请输入信息"
							id="input-frame"
							@keydown.enter="handleEnterClear"
							@keyup.enter="handleClickSendText"
						/>
						<!-- 表情按钮 -->
						<i class="el-icon-cherry" id="emoji-btn"></i>
						<!-- 发送按钮？需要吗？或者直接默认为enter发送 -->
						<i
							@click="handleClickSendText"
							class="el-icon-position"
							id="send-btn"
						></i>
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
	import { formatDate } from '@/utils/time';

	export default {
		components: { ChatMessage },
		data() {
			return {
				fId: '',

				friendList: [],
				searchResultList: [],
				searchId: '',

				icon_friend: require('@/assets/styles/common/img/user.png'),

				showAddFriend: false,
				selectFriendStatus: 'all',
				showRightDrawer: false,
				drawerInfo: undefined, //drawer展示的好友的id

				inputText: '',

				messageList: [],
			};
		},
		methods: {
			...mapGetters({
				getList: 'allFriends',
				getOnList: 'onFriends',
				getOffList: 'offFriends',
				getUserId: 'getUserId',
				getUserName: 'getUserName',
			}),
			...mapActions(['deleteFriendById', 'deleteFriendChatById']),

			// 滚动条到底部
			scrollToEnd() {
				this.$nextTick(() => {
					let box = this.$refs.chatBox;
					box.scrollTop = box.scrollHeight;
				});
			},
			// 发送好友请求
			sendAddRequest(id, text) {
				console.log('send request to', id, text);
				// fixme: request to backend send request
			},
			// 清除回车键默认事件
			handleEnterClear(e) {
				if (e.preventDefault) e.preventDefault();
				else window.event.value = false;
			},
			// 点击发送按钮的事件回调函数
			handleClickSendText() {
				if (this.inputText != '') {
					const text = {
						time: formatDate('MM/dd hh:mm:ss'),
						direction: 'right',
						avator: '',
						name: this.getUserName(),
						message: this.inputText,
					};
					this.inputText = '';
					// push text content into list
					this.messageList.push(text);
					this.scrollToEnd();

					this.sendAddRequest(this.getUserId(), text);
				}
			},
			//点击好友card，显示好友信息事件回调函数
			handleClickFriendCard(info) {
				this.drawerInfo = info;
				this.showRightDrawer = !this.showRightDrawer;
			},
		},
		mounted() {
			this.fId = this.$route.params.fId;
			console.log('fid', this.fId);
			this.friendList = this.getList();
			// 显示历史消息
			this.messageList = this.messageList.concat(testData[this.fId]);
			this.scrollToEnd();
		},
		watch: {
			//通过watch来监听路由变化
			$route: function() {
				console.log('watch', this.$route.params.fId);
				this.fId = this.$route.params.fId;
				this.messageList = testData[this.fId];
				this.scrollToEnd();
			},
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
