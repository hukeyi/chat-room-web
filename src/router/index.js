import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/login/Login.vue';
const routes = [
	{
		path: '/',
		redirect: '/login',
	},
	{
		path: '/login',
		name: 'login',
		component: Login,
	},
];
const router = createRouter({
	history: createWebHashHistory(),
	routes, // `routes: routes`
});

export default router;
