import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import { userModule } from './userModule';
import { roomModule } from './roomModule';

const store = createStore({
	plugins: [createPersistedState({ storage: window.sessionStorage })],
	modules: {
		user: userModule,
		room: roomModule,
		loading: {
			state: {
				showFullPageLoader: false, // 整页的加载页面
			},
			getters: {
				getFullPageLoader: (state) => state.showFullPageLoader,
			},
			mutations: {
				/**
				 * 整页的加载
				 */
				hideFullPageLoader(state) {
					state.showFullPageLoader = false;
				},
				showFullPageLoader(state) {
					state.showFullPageLoader = true;
				},
			},
		},
	},
});

export default store;
