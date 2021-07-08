import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import store from './store';

import './assets/css/styles.css';

import Loading from './components/global/Loading.vue'
import AlbuquerqueLogo from './components/global/AlbuquerqueLogo.vue'

createApp(App)
	.use(router)
	.use(store)
	.component('Loading', Loading)
	.component('AlbuquerqueLogo', AlbuquerqueLogo)
	.mount('#app')
