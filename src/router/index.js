import { createRouter, createWebHashHistory } from 'vue-router';
// login
import Register from '../views/login/Register.vue';
import Entrance from '../views/login/index.vue';
import Signin from '../views/login/Login.vue';
// home
import Home from '../views/home/index.vue';
import FriendChatList from '../views/home/user/FriendChatList/index.vue';
import RoomList from '../views/home/channel/RoomList.vue';
import FriendChatBox from '../views/home/user/FriendChatBox/index.vue';
import RoomChatBox from '../views/home/channel/RoomChatBox.vue';

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
	{
		path: '/home',
		redirect: '/home/me',
		component: Home,
		children: [
			{
				path: 'me',
				components: {
					leftSidebar1: FriendChatList,
					mainCentral: FriendChatBox,
				},
			},
			{
				path: 'channels',
				components: { leftSidebar1: RoomList, mainCentral: RoomChatBox },
			},
		],
	},
];
const router = createRouter({
	history: createWebHashHistory(),
	routes, // `routes: routes`
});

export default router;
