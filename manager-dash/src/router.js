import { createRouter, createWebHistory } from "vue-router";

import HomePage from "./pages/HomePage.vue";
import AccountPage from "./pages/AccountPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/account",
      name: "account",
      component: AccountPage,
    },
    {
      path: "/newpost",
      name: "newpost",
      component: NewPost,
    },
  ],
});

export default router;
