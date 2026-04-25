import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useStudentStore } from './stores/studentStore';
import { useSettingsStore } from './stores/settingsStore';
import './assets/styles/main.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

const studentStore = useStudentStore();
const settingsStore = useSettingsStore();

if (!studentStore.hasData) {
  studentStore.loadMockData(settingsStore.selectedTemplateId);
}
settingsStore.ensureValidSubject(studentStore.currentSubjects);

app.mount('#app');
