import { createApp } from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store';
import installElementPlus from './plugins/element';
// import SocketIO from 'socket.io-client';

const app = createApp(App);

// fixme: connect socketio via -client
// socket 连接参数
// const socketOptions = {
// 	autoConnect: false, //close auto connect
// };

// app.use(
// 	new VueSocketIO({
// 		debug: true,
// 		connection: SocketIO('http://localhost:3000', socketOptions),
// 	})
// );
// axios
app.config.globalProperties.$axios = axios;

// vue-router & vuex
app.use(router);
app.use(store);

// element plus
installElementPlus(app);

app.mount('#app');
