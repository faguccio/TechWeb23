<script setup>
import { ref, onMounted } from "vue";
import PostCard from "../components/PostCard.vue";
import { Const } from "../utils.js";

const posts = ref([]);

const fetchPosts = async () => {
  let res = await fetch(`${Const.apiurl}/posts/managed/all`, {
    headers: {
      Authorization: localStorage.token,
    },
  });
  res = await res.json();
  console.log(res);
  posts.value = res;
};

onMounted(() => {
  fetchPosts();
});
</script>

<template>
  <PostCard v-for="post in posts" :id="post" />
</template>
