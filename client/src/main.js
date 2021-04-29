import { createApp } from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store';
import installElementPlus from './plugins/element';

const app = createApp(App);

// axios
app.config.globalProperties.$axios = axios;

// vue-router & vuex
app.use(router);
app.use(store);

// element plus
installElementPlus(app);

app.mount('#app');
