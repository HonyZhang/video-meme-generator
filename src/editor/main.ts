import { createApp } from 'vue';
import App from '@/editor/App.vue';
import { createPinia } from 'pinia';

import '@/assets/styles/main.css';
import '@/assets/styles/fonts.css';

const app = createApp(App);
app.use(createPinia());
app.mount('#app');
