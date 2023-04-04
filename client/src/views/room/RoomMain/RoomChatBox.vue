<template>
	<div class="room-chat-box">
		<el-container class="main-area">
			<el-header class="main-header">
				<div class="main-header-title">
					<img :src="icon_room" /><span style="margin: auto 10px;">
						<span style="color: white;">{{ roomInfo.name }}</span>
						#{{ roomInfo.id }}</span
					>
				</div>
			</el-header>
			<el-container>
				<el-main class="main-central">
					<div class="chat-box-window" ref="chatBox">
						<div v-for="(item, key) in messageList" :key="key">
							<ChatMessage
								v-if="item.type != 'notice'"
								:direction="item.s_id == uId ? 'right' : 'left'"
								:showAvatar="item.avatar != '' && item.avatar"
								:name="item.name"
								:s_id="item.s_id"
								:time="toDate(item.time)"
								:message="item.content"
							></ChatMessage>
							<ChatNotice
								v-else-if="item.type == 'notice'"
								:time="toDate(item.time)"
								:content="item.content"
							>
							</ChatNotice>
						</div>
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
				<el-aside class="main-right-sidebar">
					<div
						class="room-member-list"
						v-for="item in memberList"
						:key="item.id"
					>
						<InfoListItem
							:showDropDown="item.id != uId"
							:info="item"
							:rId="Number(rId)"
							:auth="
								adminIdList.includes(uId) ? 'admin' : 'member'
							"
						></InfoListItem>
					</div>
				</el-aside>
			</el-container>
		</el-container>
	</div>
</template>

<script>
	import { mapGetters, mapActions, mapMutations } from 'vuex';
	import ChatMessage from '@/views/components/ChatMessageItem.vue';
	import ChatNotice from '@/views/components/ChatNoticeItem.vue';

	import { formatDate } from '@/utils/time';
	import InfoListItem from '@/views/components/InfoListItem.vue';
	// import roomApi from '@/api/room';

	export default {
		components: { ChatMessage, ChatNotice, InfoListItem },
		data() {
			return {
				uId: '',
				rId: '',
				adminIdList: [],
				roomInfo: '',
				icon_room: require('@/assets/imgs/group.png'),

				inputText: '',
				messageList: [],
				memberList: [],

				showMemberInfo: false,

				menuList: [
					// {
					// 	auth: 'admin',
					// 	title: '移除该成员',
					// 	handler: async function(uId, rId) {
					// 		console.log('remove member', uId);
					// 		await roomApi.PostDeleteMember({ uId, rId });
					// 	},
					// },
					// {
					// 	auth: 'admin',
					// 	title: '设为管理员',
					// 	handler: async function(uId, rId) {
					// 		console.log('set user', uId, rId, 'admin');
					// 		await roomApi.PostSetRoomAdmin({ uId, rId });
					// 	},
					// },
					// {
					// 	auth: 'member',
					// 	title: '查看个人信息',
					// 	handler: function(uId, rId) {
					// 		console.log('show user', uId, rId, 'info');
					// 		this.showMemberInfo = true;
					// 	},
					// },
				],
			};
		},
		methods: {
			...mapGetters({
				getUserId: 'getUserId',
				getUserName: 'getUserName',
				getRoomInfo: 'getRoomInfoById',
				getHistory: 'getRoomChatHistoryById',
				getMemberList: 'getRoomMembersById',
				hasAvatar: 'hasAvatar',
			}),
			...mapActions(['deleteRoomById', 'getRoomAdminById']),
			...mapMutations({ getAvatarById: 'getAvatarById' }),
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
						avatar: this.hasAvatar(),
						name: this.getUserName(),
						content: this.inputText,
					};
					this.$socket.emitter('group message', [this.rId, text]);
					this.inputText = '';
					this.messageList.push(text);
					this.scrollToEnd();
				}
			},
			async refreshView() {
				this.uId = this.getUserId();
				this.rId = this.$route.params.rId;
				const admins = await this.getRoomAdminById(this.rId);
				this.adminIdList = admins.map((item) => item.id);

				this.roomInfo = this.getRoomInfo()(this.rId);

				// 显示历史消息
				this.messageList = this.getHistory()(this.rId);
				this.memberList = this.getMemberList()(this.rId);

				const msgLen = this.messageList.length;
				const latestMsgTime = msgLen
					? Date.parse(new Date(this.messageList[msgLen - 1].time))
					: 0;
				this.$socket.emitter('enter room', [
					Number(this.rId),
					this.uId,
					latestMsgTime,
				]);
				console.log('enter room emit');
				this.scrollToEnd();
			},
			refreshMsg() {
				this.messageList = this.getHistory()(this.rId);
				this.scrollToEnd();
			},
			refreshMembers() {
				this.memberList = this.getMemberList()(this.rId);
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
					this.refreshMembers();
					console.log('test chat list');
				},
				deep: true,
			},
		},
	};
</script>

<style lang="scss" scoped>
	// @media (max-width: 1200px) {
	// 	.main-right-sidebar {
	// 		display: none;
	// 	}
	// }
	@import '@/assets/styles/chat/chat.scss';
</style>
