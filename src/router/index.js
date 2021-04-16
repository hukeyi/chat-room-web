import { createRouter, createWebHashHistory } from 'vue-router';
import Register from '../views/login/Register.vue';
import Entrance from '../views/login/index.vue';
import Signin from '../views/login/Login.vue';

const routes = [
	{
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
];
const router = createRouter({
	history: createWebHashHistory(),
	routes, // `routes: routes`
});

export default router;
