<template>
  <div class="flex flex-col items-center h-full" lang="en">
    <PostAnalyze :id="props.id" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import PostAnalyze from "../components/PostAnalyze.vue";
import { Const } from "../utils.js";
import  router  from '../router';

if(!localStorage.tokenPro){
  router.push('/login')
}
const props = defineProps({ id: String });
</script>
