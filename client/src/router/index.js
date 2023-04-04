/*
 * @Author: Hu Keyi
 * @Date: 2021-05-05 21:59:54
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2023-04-05 00:30:57
 */
import { createRouter, createWebHashHistory } from 'vue-router';
import jwt_decode from 'jwt-decode';
import { ElMessage } from 'element-plus';

// entrance
import Entrance from '../views/login/index.vue';
import Login from '../views/login/LoginForm.vue';
import Register from '../views/login/RegisterForm.vue';

// Main
import Container from '../views/index.vue';

// room & chat
import Room from '../views/room/index.vue';
import User from '../views/chat/index.vue';

// friend-box
import FriendInfoBox from '../views/chat/FriendMain/FriendInfoBox.vue';
import FriendChatBox from '../views/chat/FriendMain/FriendChatBox.vue';

// room-box
import RoomChatBox from '../views/room/RoomMain/RoomChatBox.vue';
import RoomInfoBox from '../views/room/RoomMain/RoomInfoBox.vue';

// setting
import Setting from '../views/setting/index.vue';

// error
import ErrorPage from '@/views/error/index.vue';

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
		// 用户登录后界面
		path: '/',
		component: Container,
		meta: { requiresAuth: true },
		children: [
			{
				// 用户首页-好友界面
				path: 'user/:id',
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
				path: 'setting/:id',
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
				// 用户首页-群聊界面
				path: 'group/:id',
				component: Room,
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
		],
	},
	{
		// 错误提示界面
		path: '/error/:code?',
		component: ErrorPage,
		props: true,
	},
	{
		path: '/:pathMatch(.*)*',
		component: ErrorPage,
		props: { code: '404' },
	},
];
const router = createRouter({
	history: createWebHashHistory(),
	routes,
});
// 路由拦截
router.beforeEach((to, from, next) => {
	if (!to.meta.requiresAuth) {
		next();
	} else {
		const id = to.params.id;
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
			next('/error/403');
		}
	}
});

export default router;
