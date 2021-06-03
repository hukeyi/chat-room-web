<template>
	<div class="user-info-box">
		<el-container class="main-area">
			<!-- 设置界面：头顶栏，选择设置类别 -->
			<el-header class="main-header">
				<div class="main-header-title">
					<img :src="icon_setting" /><span style="margin: auto 10px;"
						>设置</span
					>
				</div>
				<el-divider
					class="main-header-divider"
					direction="vertical"
				></el-divider>
				<el-menu
					@select="handleSelectStatus"
					class="main-header-menu"
					mode="horizontal"
					:default-active="selectStatus"
				>
					<el-menu-item index="info">个人信息设置</el-menu-item>
					<el-menu-item index="password">密码重设</el-menu-item>
				</el-menu>
				<el-divider
					class="main-header-divider"
					direction="vertical"
				></el-divider>
			</el-header>
			<!-- 个人信息界面 -->
			<el-container>
				<el-main class="main-central">
					<el-row v-if="selectStatus == 'info'" class="user-info-form">
						<el-col :span="10">
							<el-form
								label-position="top"
								label-width="80px"
								:model="ruleInfoForm"
								:rules="rulesInfo"
								ref="ruleInfoForm"
							>
								<el-form-item label="ID" prop="id">
									<el-input
										v-model="ruleInfoForm.id"
										:disabled="true"
									></el-input>
								</el-form-item>
								<el-form-item label="手机号" prop="phone">
									<el-input
										v-model="ruleInfoForm.phone"
										:disabled="true"
									></el-input>
								</el-form-item>
								<el-form-item label="昵称" prop="name">
									<el-input v-model="ruleInfoForm.name"></el-input>
								</el-form-item>

								<el-form-item label="邮箱" prop="email">
									<el-input v-model="ruleInfoForm.email"></el-input>
								</el-form-item>
								<el-form-item label="生日" prop="birthDate">
									<el-date-picker v-model="ruleInfoForm.birthDate" type="date">
									</el-date-picker>
								</el-form-item>
								<el-form-item label="性别" prop="gender">
									<el-radio
										size="medium"
										v-model="ruleInfoForm.gender"
										label="f"
										>女</el-radio
									>
									<el-radio
										size="medium"
										v-model="ruleInfoForm.gender"
										label="m"
										>男</el-radio
									>
								</el-form-item>

								<el-form-item>
									<el-button type="primary" @click="submitForm('ruleInfoForm')"
										>确认修改</el-button
									>
									<el-button @click="resetForm('ruleInfoForm')">重置</el-button>
								</el-form-item>
							</el-form>
						</el-col>
						<el-col style="padding-top: 40px;" :span="14">
							<div class="avatar-form" style="margin-left: 80px; border:0px;">
								<div class="avatar-operation">
									<el-upload
										name="avatar"
										:action="upload_url + `?uid=${getUserId()}`"
										:show-file-list="false"
										:on-success="handleAvatarSuccess"
										:before-upload="beforeAvatarUpload"
									>
										<img
											:src="ruleInfoForm.avatar ? avatar_url : icon_user"
											class="avatar-image"
										/>
										<el-button class="avatar-form-button">修改图像</el-button>
									</el-upload>
								</div>
							</div>
						</el-col>
					</el-row>
					<div
						v-else-if="selectStatus == 'password'"
						class="user-password-form"
					>
						<el-form
							label-position="top"
							label-width="80px"
							:model="rulePassForm"
							:rules="rulesPass"
							ref="rulePassForm"
						>
							<el-form-item label="原密码" prop="exPass">
								<el-input
									type="password"
									v-model="rulePassForm.exPass"
								></el-input>
							</el-form-item>
							<el-form-item label="新密码" prop="newPass">
								<el-input
									type="password"
									v-model="rulePassForm.newPass"
								></el-input>
							</el-form-item>
							<el-form-item label="确认密码" prop="checkPass">
								<el-input
									type="password"
									v-model="rulePassForm.checkPass"
								></el-input>
							</el-form-item>

							<el-form-item>
								<el-button type="primary" @click="submitForm('rulePassForm')"
									>确认重设</el-button
								>
								<el-button @click="resetForm('rulePassForm')">重置</el-button>
							</el-form-item>
						</el-form>
					</div>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
	import userApi from '@/api/user';
	// import { h } from 'vue';
	import { mapActions, mapGetters } from 'vuex';
	import { isObjectsEqual } from '@/utils/tool';

	export default {
		components: {},
		data() {
			const validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入原密码'));
				} else {
					if (this.rulePassForm.checkPass !== '') {
						this.$refs.rulePassForm.validateField('newPass');
					}
					callback();
				}
			};
			const validatePass1 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入新密码'));
				} else if (value === this.rulePassForm.exPass) {
					callback(new Error('不能与原密码相同'));
				} else {
					if (this.rulePassForm.checkPass !== '') {
						this.$refs.rulePassForm.validateField('checkPass');
					}
					callback();
				}
			};
			const validatePass2 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.rulePassForm.newPass) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				icon_setting: require('@/assets/styles/common/img/setting.png'),
				icon_user: require('@/assets/styles/common/img/user.png'),
				avatar_url: '',
				selectStatus: 'info',

				upload_url: userApi.UpdateAvatar,
				download_url: '',
				test_url: '',

				exInfo: {},

				// info
				ruleInfoForm: {
					id: '',
					name: '',
					phone: '',
					email: '',
					gender: '',
					birthDate: '',
					avatar: '',
				},
				rulesInfo: {
					name: [{ required: true }],
				},

				// pass
				rulePassForm: {
					exPass: '',
					newPass: '',
					checkPass: '',
				},

				rulesPass: {
					exPass: [{ validator: validatePass, trigger: 'blur' }],
					newPass: [{ validator: validatePass1, trigger: 'blur' }],
					checkPass: [{ validator: validatePass2, trigger: 'blur' }],
				},
			};
		},
		methods: {
			...mapGetters(['getUserInfo', 'getUserId']),
			...mapActions(['setUserInfo', 'setUserAvatar']),
			/**
			 * 头像上传回调函数
			 */
			async handleAvatarSuccess(res, file) {
				console.log('success', file);
				const filename = 'avatar_user_' + this.ruleInfoForm.id;
				this.ruleInfoForm.avatar = filename;
				await this.setUserAvatar(filename);
				this.avatar_url = URL.createObjectURL(file.raw);
			},
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isJPG) {
					this.$message.error('上传头像图片只能是 JPG 格式');
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB');
				}
				return isJPG && isLt2M;
			},
			handleSelectStatus(key) {
				this.selectStatus = key;
			},
			async submitPassForm() {
				try {
					const postData = {
						exPass: this.rulePassForm.exPass,
						newPass: this.rulePassForm.newPass,
					};
					await userApi.UpdatePass(postData);
					this.$message({
						type: 'success',
						message: `修改密码成功`,
					});
				} catch (err) {
					console.log('submit pass', err);
					this.$message({
						type: 'error',
						message: `修改密码失败：${err}`,
					});
				}
			},
			async submitInfoForm() {
				try {
					const { name, email, gender, birthDate } = this.ruleInfoForm;
					const postData = {
						name: name ? name : this.exInfo.name,
						email: email ? email : this.exInfo.email,
						gender: gender ? gender : this.exInfo.gender,
						birth_date: birthDate ? birthDate : this.exInfo.birthDate,
					};

					console.log('this.exInfo:', this.exInfo, '\npostData', postData);

					if (
						this.exInfo &&
						postData &&
						!isObjectsEqual(postData, this.exInfo)
					) {
						await userApi.UpdateInfo(postData);
						this.setUserInfo(this.ruleInfoForm);
						this.$message({
							type: 'success',
							message: `修改个人信息成功`,
						});
					} else {
						this.$message({
							message: `无修改信息`,
						});
						console.log('same user info');
					}
				} catch (err) {
					console.log('submit pass', err);
					this.$message({
						type: 'error',
						message: `修改个人信息失败：${err}`,
					});
				}
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if (formName === 'rulePassForm') {
							this.submitPassForm();
						} else {
							this.submitInfoForm();
						}
					}
				});
			},
			resetForm(formName) {
				if (formName === 'rulePassForm') this.$refs[formName].resetFields();
				else this.ruleInfoForm = this.getUserInfo();
			},
		},
		mounted() {
			const userInfo = this.getUserInfo();
			this.exInfo = {
				name: userInfo.name,
				email: userInfo.email,
				gender: userInfo.gender,
				birth_date: userInfo.birthDate,
			};
			this.avatar_url = userApi.DownloadAvatar(userInfo.id);
			this.download_url = userApi.DownloadAvatar(userInfo.id);
			this.ruleInfoForm = userInfo;
			console.log('userinfo', userInfo);
		},
	};
</script>

<style lang="scss" scoped>
	.user-info-box .main-area .el-container {
		overflow: auto;

		.avatar-image {
			width: 180px;
			height: 180px;
		}
	}
	@import '@/assets/styles/user/chat.scss';
</style>
