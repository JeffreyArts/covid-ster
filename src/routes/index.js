import { createWebHistory, createRouter } from "vue-router";
import Home from "./home/home.vue";
import Download from "./download/download.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/download",
    name: "download",
    component: Download,
  },
];


const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;

