<template>
	<div class="room-info-box">
		<el-container class="main-area">
			<!-- 聊天室界面：头顶栏，选择聊天室状态分类 -->
			<el-header class="main-header">
				<div class="main-header-title">
					<img :src="icon_room" /><span style="margin: auto 10px;">聊天室</span>
				</div>
				<el-divider
					class="main-header-divider"
					direction="vertical"
				></el-divider>
				<el-menu
					@select="handleSelectStatus"
					class="main-header-menu"
					mode="horizontal"
					:default-active="selectRoomStatus"
				>
					<el-menu-item index="all">全部</el-menu-item>
					<el-menu-item index="mine">我管理的</el-menu-item>
				</el-menu>
				<el-divider
					class="main-header-divider"
					direction="vertical"
				></el-divider>
				<el-button
					@click="handleClickAddRoom"
					size="medium"
					class="main-header-btn"
					:class="{ 'is-active': showAddRoom }"
					>加入聊天室</el-button
				>
				<el-button
					@click="handleClickCreateRoom"
					size="medium"
					class="main-header-btn"
					:class="{ 'is-active': showCreateRoom }"
					>创建聊天室</el-button
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
			<!-- 添加聊天室+显示聊天室列表+创建聊天室界面 -->
			<el-container>
				<el-main class="main-central">
					<!-- 添加聊天室+搜索聊天室 -->
					<div v-if="showAddRoom" class="add-room">
						<InputItem
							itemStyle="
							padding: 20px !important; 
							width: 400px; 
							height: auto; 
							overflow: hidden;
							"
							inputStyle="float: left; width: 60%;"
							labelValue="请输入聊天室ID搜索聊天室："
							placeholder="请输入聊天室ID"
							:clearable="true"
							@onInput="handleInputId"
							@keydown.enter="handleEnterClear"
							@keyup.enter="handleClickSearchRoom"
						>
							<el-button
								@click="handleClickSearchRoom"
								size="medium"
								class="add-room-btn"
								>搜索聊天室</el-button
							>
						</InputItem>
					</div>
					<!-- 无聊天室 -->
					<div v-else-if="!roomList.length" class="no-rooms">
						<el-empty
							description="暂时没有聊天室，赶快搜索聊天室开始聊天吧"
							:image-size="200"
						>
							<el-button
								size="medium"
								class="add-room-btn"
								@click="handleClickAddRoom"
								>加入聊天室</el-button
							>
						</el-empty>
					</div>
					<!-- 所有聊天室信息列表 -->
					<div v-else-if="selectRoomStatus === 'all'" class="room-list-all">
						<InfoCardItem
							v-for="item in roomList"
							:key="item.id"
							:name="item.name"
							:avatar="item.avatar ? item.avatar : undefined"
							:id="item.id"
							:status="item.status"
							@click="handleClickRoomCard(item)"
						></InfoCardItem>
					</div>
					<!-- 我管理的聊天室信息列表 -->
					<div v-else-if="selectRoomStatus === 'mine'" class="room-list-on">
						<InfoCardItem
							v-for="item in getMyRoomList()"
							:key="item.id"
							:name="item.name"
							:avatar="item.avatar ? item.avatar : undefined"
							:id="item.id"
							:status="item.status"
							@click="handleClickRoomCard(item)"
						></InfoCardItem>
					</div>
					<!-- 创建聊天室 -->
					<div v-else-if="showCreateRoom" class="create-room-form">
						<el-form
							label-position="top"
							label-width="80px"
							:model="ruleForm"
							:rules="rules"
							ref="ruleForm"
						>
							<el-form-item label="名称" prop="name">
								<el-input v-model="ruleForm.name"></el-input>
							</el-form-item>
							<el-form-item label="简介" prop="intro">
								<el-input type="textarea" v-model="ruleForm.intro"></el-input>
							</el-form-item>
							<el-form-item>
								<el-button type="primary" @click="submitForm('ruleForm')"
									>立即创建</el-button
								>
								<el-button @click="resetForm('ruleForm')">重置</el-button>
							</el-form-item>
						</el-form>
					</div>
					<!-- 通知 -->
					<div v-if="showNotice" class="room-notice">
						<span v-if="noticeList.length" class="room-notice-title"
							>聊天室申请</span
						>
						<div
							class="room-notice-item"
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
					<!-- 加入聊天室 -->
					<div v-if="showAddRoom" class="add-room-result">
						<div
							class="add-room-result-item"
							v-for="item in searchResultList"
							:key="item.id"
						>
							<InfoCardItem
								:name="item.name"
								:avatar="item.avatar ? item.avatar : undefined"
								:id="item.id"
								:status="item.status ? item.status : 'off'"
							></InfoCardItem>
							<el-button @click="handleClickSend(item)">发送加入申请</el-button>
						</div>
						<el-empty
							v-if="showEmptyRes"
							description="不存在此聊天室"
							:image-size="100"
						></el-empty>
					</div>
					<!-- 聊天室信息边栏，点击某个聊天室的card，从右往左弹出指定聊天室的信息 -->
					<el-drawer
						custom-class="room-info-drawer"
						:withHeader="false"
						v-model="showRightDrawer"
						direction="rtl"
						destroy-on-close
					>
						<el-row type="flex" justify="center"
							><img :src="drawerInfo.avatar ? drawerInfo.avatar : icon_room"
						/></el-row>
						<el-row type="flex" justify="center">{{ drawerInfo.id }}</el-row>
						<el-row type="flex" justify="center">{{ drawerInfo.name }}</el-row>
						<el-row type="flex" justify="center">{{
							drawerInfo.status
						}}</el-row>
						<el-row class="btn-group" type="flex" justify="center">
							<el-button
								@click="handleClickEnterRoom(drawerInfo.id)"
								id="start-chat"
								size="medium"
								>进入聊天室</el-button
							>

							<el-button
								id="delete-room"
								size="medium"
								@click="handleClickQuitRoom(drawerInfo.id, drawerInfo.name)"
								>退出聊天室</el-button
							>
							<el-button
								id="btn-del-room"
								v-if="drawerInfo.isAdmin"
								size="medium"
								@click="handleClickDeleteRoom(drawerInfo.id, drawerInfo.name)"
								>删除聊天室</el-button
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
	import { mapGetters, mapActions } from 'vuex';
	import roomApi from '@/api/room';
	import { h } from 'vue';

	export default {
		components: { InputItem, InfoCardItem },
		props: {
			roomList: {
				type: Array,
				default: () => [],
			},
		},
		data() {
			return {
				// 聊天室搜索
				searchResultList: [],
				searchId: '',
				showEmptyRes: false,

				icon_room: require('@/assets/styles/common/img/user.png'),

				// 添加聊天室 聊天室状态表
				showAddRoom: false,
				selectRoomStatus: 'all',
				// 创建聊天室
				showCreateRoom: false,
				// 聊天室信息
				showRightDrawer: false,
				drawerInfo: undefined, //drawer展示的聊天室的id
				// 用户通知
				noticeList: [], //通知列表
				showNotice: false,

				//创建聊天室
				ruleForm: {
					name: '',
					intro: '',
				},
				rules: {
					name: [
						{ required: true, message: '请输入聊天室名称', trigger: 'blur' },
					],
				},
			};
		},
		methods: {
			...mapGetters({
				getUserId: 'getUserId',
				getNotice: 'getNewNotice',
				getRoomList: 'getRoomList',
				getMyRoomList: 'getMyRoomList',
			}),
			...mapActions([
				'deleteRoomById',
				'deleteNoticeByIndex',
				'deleteNewNotice',
			]),

			/**
			 * 创建聊天室相关
			 */
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						roomApi
							.PostCreateRoom(this.ruleForm)
							.then((res) => {
								this.$message({
									type: 'success',
									message: `成功创建聊天室${this.ruleForm.name}！ID为${res.id}`,
								});
								this.handleSelectStatus('all');
								console.log('create room ok', res);
							})
							.catch((err) => {
								console.log('create room', err);
							});
					} else {
						console.log('error submit');
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},

			//删除聊天室
			deleteRoom(id) {
				console.log('start delete room', id);

				this.showRightDrawer = false;
				this.deleteRoomById(id);

				const postData = { rId: id };
				return roomApi.PostDeleteRoom(postData);
			},
			//退出聊天室
			quitRoom(id) {
				console.log('start quit room', id);

				this.showRightDrawer = false;
				this.deleteRoomById(id);

				const postData = { rId: id };
				return roomApi.PostQuitRoom(postData);
			},
			async searchRooms(id) {
				try {
					this.searchResultList.splice(0, this.searchResultList.length);
					console.log('start room search by id', id);
					const postData = { rId: id };
					const temp = await roomApi.PostSearchRooms(postData);
					if (temp) {
						this.searchResultList.push(temp);
						this.showEmptyRes = false;
					} else {
						this.showEmptyRes = true;
					}
				} catch (err) {
					console.log('search room', err);
				}
			},
			// 发送聊天室请求
			sendAddRequest(id) {
				console.log('send request to', id);
				this.$socket.emitter('add room request', [id, 'room request']);
			},
			//添加聊天室按钮的点击事件回调函数
			handleClickAddRoom() {
				this.showAddRoom = true;
				this.showCreateRoom = false;
				this.showEmptyRes = false;
				this.showNotice = false;
				this.selectRoomStatus = '';
			},
			handleClickNotice() {
				this.showAddRoom = false;
				this.showCreateRoom = false;
				this.showEmptyRes = false;
				this.selectRoomStatus = '';
				this.showNotice = true;
			},
			//聊天室界面头顶栏聊天室状态菜单选择事件回调函数
			handleSelectStatus(key) {
				this.selectRoomStatus = key;
				this.showAddRoom = false;
				this.showCreateRoom = false;
				this.showNotice = false;
			},
			handleClickCreateRoom() {
				this.showCreateRoom = true;
				this.showAddRoom = false;
				this.selectRoomStatus = '';
				this.showNotice = false;
			},

			//点击聊天室card，显示聊天室信息事件回调函数
			handleClickRoomCard(info) {
				this.drawerInfo = info;
				this.showRightDrawer = !this.showRightDrawer;
			},
			// 点击进入聊天室按钮的回调函数
			async handleClickEnterRoom(id) {
				this.showRightDrawer = false;
				// todo: emit user enter xx room
				this.$router.push(`/channel/${this.getUserId()}/room/${id}`);
			},
			//点击删除聊天室按钮的回调函数
			handleClickDeleteRoom(id, name) {
				this.$confirm(`是否确认删除聊天室${name}?`, '确认删除', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(async () => {
						try {
							await this.deleteRoom(id);
							this.$message({
								type: 'success',
								message: `成功删除聊天室${name}!`,
							});
						} catch (err) {
							this.$message({
								type: 'error',
								message: `操作失败：${err}!`,
							});
						}
					})
					.catch((err) => {
						console.log('cancel delete room', id, err);
					});
			},
			handleClickQuitRoom(id, name) {
				this.$confirm(`是否确认退出聊天室${name}?`, '确认退出', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(async () => {
						try {
							await this.quitRoom(id);
							this.$message({
								type: 'success',
								message: `成功退出聊天室${name}!`,
							});
						} catch (err) {
							this.$message({
								type: 'error',
								message: `操作失败：${err}!`,
							});
						}
					})
					.catch((err) => {
						console.log('cancel quit room', id, err);
					});
			},
			// 搜索聊天室输入框的input回调函数
			handleInputId(id) {
				this.searchId = id;
			},
			// 搜索聊天室按钮点击事件的回调函数
			handleClickSearchRoom() {
				this.showEmptyRes = false;
				const id = this.searchId;
				// todo: check if searchID in roomlist
				this.searchRooms(id);
			},
			// 发送聊天室请求按钮的回调函数
			handleClickSend(item) {
				this.$confirm(`是否向 ${item.name} 发送加入聊天室申请?`, '', {
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
				if (notice.type == 'apply_result_ok') {
					this.$emit('refresh');
					this.handleSelectStatus('all');
				}
			},
			handleClickYes(item, key) {
				console.log('yes to ', item.detail.name, key);
				this.noticeList.splice(key, 1);
				this.$socket.emitter('add room response', [item.detail.id, true]);
			},
			handleClickNo(item, key) {
				console.log('no to ', item.detail.name, key);
				this.noticeList.splice(key, 1);
				this.$socket.emitter('add room response', [item.detail.id, false]);
			},
			// 清除回车键默认事件
			handleEnterClear(e) {
				if (e.preventDefault) e.preventDefault();
				else window.event.value = false;
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
	// @media (max-width: 1200px) {
	// 	.main-right-sidebar {
	// 		display: none;
	// 	}
	// }
	@import '@/assets/styles/user/chat.scss';
</style>
