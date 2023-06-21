import { createRouter, createWebHistory } from "vue-router";

import HomePage from "./pages/HomePage.vue";
import AccountPage from "./pages/AccountPage.vue";
import LoginPage from "./pages/LoginPage.vue";
import PostsPage from "./pages/PostsPage.vue";

const router = createRouter({
  base: "/man",
  history: createWebHistory(),
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
      path: "/login",
      name: "login",
      component: LoginPage,
    },
    {
      path: "/post/:id",
      name: "Managing",
      component: PostsPage,
      props: true,
    },
  ],
});

export default router;
