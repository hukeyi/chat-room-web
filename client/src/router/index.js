/*
 * @Author: Hu Keyi
 * @Date: 2021-05-05 21:59:54
 * @Last Modified by: Hu Keyi
 * @Last Modified time: 2021-05-27 00:49:33
 */
import { createRouter, createWebHashHistory } from 'vue-router';
import jwt_decode from 'jwt-decode';
// login
import Register from '../views/login/Register.vue';
import Entrance from '../views/login/index.vue';
import Signin from '../views/login/Login.vue';
// channel & user
import Channel from '../views/channel/index.vue';
import User from '../views/user/index.vue';

// friend-box
import FriendInfoBox from '../views/user/FriendChatBox/FriendInfoBox.vue';
import FriendChatBox from '../views/user/FriendChatBox/FriendChatBox.vue';

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
				component: Signin,
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
				path: ':fId',
				component: FriendChatBox,
				meta: { requiresAuth: true },
			},
		],
	},
	{
		// 用户首页-某频道界面
		path: '/channel',
		component: Channel,
		meta: { requiresAuth: true },
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
			console.log('id in token', decoded.id, ';id in url', id);
			if (!id || id != decoded.id) {
				// url的id与token中是否匹配
				next('/error/403');
			} else if (decoded.exp < currentTime) {
				// todo: do a notify alert with element ui global
				alert('Token is expired, please login again');
				// todo: clear vuex？
				next('/');
			} else {
				next();
			}
		} else {
			// todo: replace with element message box
			alert('Please login first');
			// todo: clear vuex
			next('/');
		}
	}
});

export default router;
