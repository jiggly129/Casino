import { createApp } from 'vue'
import './assets/main.css'

import { createMemoryHistory, createRouter } from 'vue-router'

import App from './App.vue'
import HomeView from './Views/Home.vue'

const routes = [
  { path: '/', component: HomeView },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

createApp(App).use(router).mount('#app')
