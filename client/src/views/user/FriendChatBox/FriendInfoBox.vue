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
				<el-badge
					v-if="noticeList.length"
					:value="noticeList.length"
					class="main-header-badge"
				>
					<el-button
						@click="handleClickNotice"
						size="medium"
						class="main-header-btn"
						:class="{ 'is-active': showNotice }"
						>通知</el-button
					>
				</el-badge>
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
							labelValue="您可以通过搜索好友ID或手机号来添加好友："
							placeholder="请输入用户ID或手机号"
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
							<el-button
								@click="handleClickStartChat(drawerInfo.id)"
								id="start-chat"
								size="medium"
								>发起私聊</el-button
							>
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
						<div
							class="add-friend-result-item"
							v-for="item in searchResultList"
							:key="item.id"
						>
							<InfoCardItem
								:name="item.name"
								:avatar="item.avatar ? item.avatar : undefined"
								:id="item.id"
								:status="item.status ? item.status : 'off'"
							></InfoCardItem>
							<el-button @click="handleClickSend(item)">发送好友申请</el-button>
						</div>
						<el-empty
							v-if="showEmptyRes"
							description="该ID或手机号不存在"
							:image-size="100"
						></el-empty>
					</div>
					<div v-if="showNotice" class="friend-notice">
						<span v-if="noticeList.length" class="friend-notice-title"
							>好友申请</span
						>
						<div
							class="friend-notice-item"
							v-for="(item, key) in noticeList"
							:key="key"
						>
							<br />
							<InfoCardItem
								:name="item.detail.name"
								:avatar="item.detail.avatar ? item.detail.avatar : undefined"
								:id="item.detail.id"
								:showStatus="false"
							></InfoCardItem>
							<el-button class="yes-btn" @click="handleClickYes(item, key)"
								>同意</el-button
							>
							<el-button class="no-btn" @click="handleClickNo(item, key)"
								>拒绝</el-button
							>
						</div>
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
	import friendApi from '@/api/friend';
	import userApi from '@/api/user';
	import { h } from 'vue';

	export default {
		components: { InputItem, InfoCardItem },
		props: {
			friendList: {
				type: Array,
				default: () => [],
			},
		},
		data() {
			return {
				// 好友搜索
				searchResultList: [],
				searchId: '',
				showEmptyRes: false,

				icon_friend: require('@/assets/styles/common/img/user.png'),

				// 添加好友 好友状态表
				showAddFriend: false,
				selectFriendStatus: 'all',
				// 好友信息
				showRightDrawer: false,
				drawerInfo: undefined, //drawer展示的好友的id
				// 用户通知
				noticeList: [], //通知列表
				showNotice: false,
			};
		},
		methods: {
			...mapGetters({
				getUserId: 'getUserId',
				getUserName: 'getUserName',
				getUserPhone: 'getUserPhone',
				getNotice: 'getNewNotice',
				getList: 'allFriends',
				getOnList: 'onFriends',
				getOffList: 'offFriends',
			}),
			...mapActions([
				'deleteFriendById',
				'deleteNoticeByIndex',
				'deleteNewNotice',
			]),

			//删除好友
			async deleteFriend(id) {
				try {
					console.log('start delete friend', id);

					this.showRightDrawer = false;
					this.deleteFriendById(id);

					const postData = { fid: id };
					await friendApi.PostDeleteFriend(postData);
				} catch (err) {
					console.log('delete err', id, err);
				}
			},
			async searchFriends(id) {
				try {
					console.log('start search by id', id);

					const postData = { id: id };
					this.searchResultList = await userApi.SearchUsers(postData);
					if (!this.searchResultList.length) this.showEmptyRes = true;
				} catch (err) {
					console.log('search user', err);
				}
			},
			async startChatWith(id) {
				try {
					const postData = {
						fid: id,
					};
					return friendApi.PostChatWithFriend(postData);
				} catch (err) {
					console.log('start chat with', err);
				}
			},
			// 发送好友请求
			sendAddRequest(id) {
				console.log('send request to', id);
				this.$socket.emitter('add friend request', [id, 'friend request']);
			},
			//添加好友按钮的点击事件回调函数
			handleClickAddFriend() {
				this.showAddFriend = true;
				this.showEmptyRes = false;
				this.showNotice = false;
				this.selectFriendStatus = '';
			},
			handleClickNotice() {
				this.showAddFriend = false;
				this.showEmptyRes = false;
				this.selectFriendStatus = '';
				this.showNotice = true;
			},
			//好友界面头顶栏好友状态菜单选择事件回调函数
			handleSelectStatus(key) {
				this.selectFriendStatus = key;
				this.showAddFriend = false;
				this.showNotice = false;
			},

			//点击好友card，显示好友信息事件回调函数
			handleClickFriendCard(info) {
				this.drawerInfo = info;
				this.showRightDrawer = !this.showRightDrawer;
			},
			// 点击发起私聊按钮的回调函数
			async handleClickStartChat(id) {
				this.showRightDrawer = false;
				await this.startChatWith(id);
				const uid = this.getUserId();
				this.$emit('startChat', uid, id);
			},
			//点击删除好友按钮的回调函数
			handleClickDeleteFriend(id, name) {
				this.$confirm(`是否确认删除好友${name}?`, '确认删除', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(async () => {
						await this.deleteFriend(id);
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
				this.showEmptyRes = false;
				const selfId = this.getUserId();
				const selfPhone = this.getUserPhone();
				const id = this.searchId;
				if (id != selfId && id != selfPhone) {
					this.searchFriends(id);
				} else {
					this.$message({
						type: 'warning',
						message: '不能添加自己为好友哦!',
					});
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
			openNotice(notice) {
				console.log('open notice', notice);
				this.$notify({
					title: notice.title,
					message: h('i', { style: 'color: teal' }, notice.content),
				});
			},
			handleClickYes(item, key) {
				console.log('yes to ', item.detail.name, key);
				this.noticeList.splice(key, 1);
				this.$socket.emitter('add friend response', [item.detail.id, true]);
			},
			handleClickNo(item, key) {
				console.log('no to ', item.detail.name, key);
				this.noticeList.splice(key, 1);
				this.$socket.emitter('add friend response', [item.detail.id, false]);
			},
		},
		watch: {
			'$store.state.user.noticeList': {
				handler() {
					console.log('noticelist changes');

					const notice = this.getNotice();
					if (notice.type == 'apply') {
						this.noticeList.push(notice);
					}
					this.openNotice(notice);
				},
				deep: true,
			},
		},
		mounted() {},
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
