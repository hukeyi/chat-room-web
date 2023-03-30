/*
 * @Author: Hu Keyi
 * @Date: 2021-05-05 21:59:54
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2023-03-22 17:19:54
 */
import { createRouter, createWebHashHistory } from 'vue-router';
import jwt_decode from 'jwt-decode';
import { ElMessage } from 'element-plus';

// login
import Entrance from '../views/login/index.vue';
import Login from '../views/login/Login-form.vue';
import Register from '../views/login/Register-form.vue';
// channel & user
import Channel from '../views/channel/index.vue';
import User from '../views/user/index.vue';

// friend-box
import FriendInfoBox from '../views/user/FriendChatBox/FriendInfoBox.vue';
import FriendChatBox from '../views/user/FriendChatBox/FriendChatBox.vue';

// room-box
import RoomChatBox from '../views/channel/RoomChatBox/RoomChatBox.vue';
import RoomInfoBox from '../views/channel/RoomChatBox/RoomInfoBox.vue';

// setting
import Setting from '../views/setting/index.vue';

// error
import ErrorPage from '@/views/error/index.vue';

// test component
// import LoginTest from '@/views/login/Login-test.vue';
// import LoginTest2 from '@/views/login/Login-test-form.vue';
// import SignUpTest from '@/views/login/Register-test.vue';
// import SignUpTest2 from '@/views/login/Register-test-form.vue';

const routes = [
	{
		//网站首页-登录注册界面
		path: '/',
		redirect: '/login',
		component: Entrance,
		children: [
			{
				path: 'login',
				component: Login,
				meta: { requiresAuth: false },
			},
			{
				path: 'register',
				component: Register,
				meta: { requiresAuth: false },
			},
		],
	},
	{
		// 用户首页-好友界面
		path: '/user/:id',
		component: User,
		children: [
			{
				path: '',
				component: FriendInfoBox,
				meta: { requiresAuth: true },
			},
			{
				path: 'friend/:fId',
				component: FriendChatBox,
				meta: { requiresAuth: true },
			},
		],
	},
	{
		// 用户设置界面
		path: '/setting/:id',
		component: Setting,
		children: [
			{
				path: '',
				component: FriendInfoBox,
				meta: { requiresAuth: true },
			},
		],
	},
	{
		// 用户首页-某频道界面
		path: '/channel/:id',
		component: Channel,
		meta: { requiresAuth: true },
		children: [
			{
				path: '',
				component: RoomInfoBox,
				meta: { requiresAuth: true },
			},
			{
				path: 'room/:rId',
				component: RoomChatBox,
				meta: { requiresAuth: true },
			},
		],
	},
	{
		path: '/error/:code?',
		component: ErrorPage,
		props: true,
	},
	{
		path: '/:pathMatch(.*)*',
		name: 'error-404',
		component: ErrorPage,
	},
];
const router = createRouter({
	history: createWebHashHistory(),
	routes, // `routes: routes`
});

router.beforeEach((to, from, next) => {
	const id = to.params.id;
	if (!to.meta.requiresAuth) {
		next();
	} else {
		// 判断是否存在token
		// 存在则鉴权判断
		// 不存在则返回登录页
		const token = localStorage.getItem(`token_${id}`);
		if (token) {
			// 存在，判断是否过期
			const decoded = jwt_decode(token);
			const currentTime = Date.now() / 1000;
			if (!id || id != decoded.id) {
				// url的id与token中是否匹配
				next('/error/403');
			} else if (decoded.exp < currentTime) {
				ElMessage({
					message: '登录令牌已过期，请重新登录',
					type: 'error',
				});
				// todo: clear vuex？
				next('/');
			} else {
				next();
			}
		} else {
			ElMessage({
				message: '请先登录',
				type: 'error',
			});
			// todo: clear vuex
			next('/');
		}
	}
});

export default router;
