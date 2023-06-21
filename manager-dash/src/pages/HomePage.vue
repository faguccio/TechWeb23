<script setup>
import { ref, onMounted } from "vue";
import PostCard from "../components/PostCard.vue";
import { Const } from "../utils.js";
import  router  from '../router';



const posts = ref([]);

const fetchPosts = async () => {
  let res = await fetch(`${Const.apiurl}/posts/managed/all`, {
    headers: {
      Authorization: localStorage.tokenPro,
    },
  });
  res = await res.json();
  console.log(res);
  posts.value = res;
};

onMounted(() => {
  if(!localStorage.tokenPro)
    router.push('/login')
  else
    fetchPosts();
});
</script>

<template>
  <PostCard v-for="post in posts" :id="post" />
</template>
