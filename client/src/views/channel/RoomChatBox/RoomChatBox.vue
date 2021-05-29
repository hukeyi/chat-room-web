<template>
	<div class="room-chat-box">
		<el-container class="main-area">
			<el-header class="main-header">
				<div class="main-header-title">
					<img :src="icon_room" /><span style="margin: auto 10px;"
						># {{ roomInfo.name }}</span
					>
				</div>
			</el-header>
			<el-container>
				<el-main class="main-central">
					<div class="chat-box-window" ref="chatBox">
						<ChatMessage
							v-for="(item, key) in messageList"
							:key="key"
							:direction="item.s_id == rId ? 'left' : 'right'"
							:avatar="item.avatar ? item.avatar : undefined"
							:name="item.name"
							:time="toDate(item.time)"
							:message="item.content"
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
	import { formatDate } from '@/utils/time';

	export default {
		components: { ChatMessage },
		data() {
			return {
				rId: '',
				roomInfo: '',
				icon_room: require('@/assets/styles/common/img/user.png'),

				inputText: '',
				messageList: [],
			};
		},
		methods: {
			...mapGetters({
				getUserId: 'getUserId',
				getRoomInfo: 'getRoomInfoById',
				getHistory: 'getRoomChatHistoryById',
				getMemberList: 'getRoomMembersById',
			}),
			...mapActions(['deleteRoomById']),
			// 格式化时间日期
			// 同一天：只显示时间
			// 同一年：只显示月日+时间
			toDate(time) {
				const now = new Date();
				const then = new Date(time);
				let formation =
					now.getFullYear() !== then.getFullYear()
						? 'yy/MM/dd hh:mm:ss'
						: now.toDateString() !== then.toDateString()
						? 'MM/dd hh:mm:ss'
						: 'hh:mm:ss';
				return formatDate(formation, then);
			},
			// 滚动条到底部
			scrollToEnd() {
				this.$nextTick(() => {
					let box = this.$refs.chatBox;
					box.scrollTop = box.scrollHeight;
				});
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
						s_id: this.getUserId(),
						r_id: this.rId,
						time: Date.now(),
						avatar: '',
						name: this.getUserName(),
						content: this.inputText,
					};
					this.$socket.emitter('group message', [this.rId, text]);
					this.inputText = '';
					this.messageList.push(text);
					this.scrollToEnd();
				}
			},
			refreshView() {
				this.rId = this.$route.params.rId;
				this.roomInfo = this.getRoomInfo()(this.rId);
				console.log(this.roomInfo, 'get room info');
				// 显示历史消息
				this.messageList = this.getHistory()(this.rId);
				this.scrollToEnd();
			},
			refreshMsg() {
				this.messageList = this.getHistory()(this.rId);
				this.scrollToEnd();
			},
		},
		mounted() {
			this.refreshView();
		},
		watch: {
			//通过watch来监听路由变化
			'$route.params.rId': function() {
				if (this.$route.params.rId) {
					this.refreshView();
				}
			},
			'$store.state.room.roomChatList': {
				//watch roomlist, sync chatlist
				handler() {
					this.refreshMsg();
					console.log('test chat list');
				},
				deep: true,
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
