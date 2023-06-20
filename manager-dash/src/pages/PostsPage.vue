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

const props = defineProps({ id: String });
</script>
