import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from './router';
import vuetify from './utils/vuetify';
import App from './App.vue';
import './style.scss';

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.use(vuetify);

app.mount('#app');
