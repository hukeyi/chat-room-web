import { createRouter, createWebHashHistory } from 'vue-router';
// login
import Register from '../views/login/Register.vue';
import Entrance from '../views/login/index.vue';
import Signin from '../views/login/Login.vue';
// channel & user
import Channel from '../views/channel/index.vue';
import User from '../views/user/index.vue';

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
			},
			{
				path: 'register',
				component: Register,
			},
		],
	},
	{
		// 用户首页-好友界面
		path: '/me',
		component: User,
	},
	{
		// 用户首页-某频道界面
		path: '/channel',
		component: Channel,
	},
];
const router = createRouter({
	history: createWebHashHistory(),
	routes, // `routes: routes`
});

export default router;
