import type { App } from 'vue';
import { createPinia } from 'pinia';
import vuetify from '../utils/vuetify';

export default (app: App) => {
  app.use(createPinia());
  app.use(vuetify);
};
