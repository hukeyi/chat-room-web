import { createApp } from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store';
import installElementPlus from './plugins/element';
import { Socket } from './utils/socket';

const app = createApp(App);

const socket = new Socket();
app.config.globalProperties.$socket = socket;

// axios
app.config.globalProperties.$axios = axios;

// vue-router & vuex
app.use(router);
app.use(store);

// element plus
installElementPlus(app);

app.mount('#app');
