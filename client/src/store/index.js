import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import { userModule } from './userModule';
import { roomModule } from './roomModule';

const store = createStore({
	plugins: [createPersistedState({ storage: window.sessionStorage })],
	modules: { user: userModule, room: roomModule },
});

export default store;
