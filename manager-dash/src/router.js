import { createRouter, createWebHistory } from "vue-router";

import HomePage from "./pages/HomePage.vue";
import AccountPage from "./pages/AccountPage.vue";
import LoginPage from "./pages/LoginPage.vue";
import PostsPage from "./pages/PostsPage.vue";
import NewPost from "./pages/NewPost.vue";

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
      path: "/login",
      name: "login",
      component: LoginPage,
    },
    {
      path: "/posts",
      name: "posts",
      component: PostsPage,
    },
     {
      path: "/newpost",
      name: "newpost",
      component: NewPost,
    }
  ],
});

export default router;
