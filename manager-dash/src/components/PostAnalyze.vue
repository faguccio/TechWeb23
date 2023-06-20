<script setup>
import { ref, onMounted } from "vue";
import GeoMap from "./GeoMap.vue";
import { Const } from "../utils.js";

const postData = ref(false);
const userData = ref(false);
const props = defineProps({ id: String });

const reactionEngagement = ref(0);

const fetchData = async () => {
  console.log(`${Const.apiurl}/post/${props.id}`);
  const res = await fetch(`${Const.apiurl}/post/${props.id}`);
  return await res.json();
};

const fetchUser = async () => {
  const res = await fetch(`${Const.apiurl}/user/${postData.value.sender}`);
  const ret = await res.json();
  return ret;
};

onMounted(() => {
  fetchData().then((pd) => {
    postData.value = pd;
    reactionEngagement.value = (
      (pd.reactions.positive /
        (pd.reactions.positive + pd.reactions.negative)) *
      100
    ).toFixed(1);
    fetchUser(postData.value.sender).then((ud) => {
      userData.value = ud;
    });
  });
});
</script>

<template>
  <div
    v-if="postData"
    class="flex bg-white shadow-lg rounded-lg mx-4 md:mx-auto my-8 md:max-w-2xl"
  >
    <div class="flex items-start px-4 py-6">
      <img
        v-if="userData"
        class="w-12 h-12 rounded-full object-cover mr-2 shadow"
        :src="userData.propic_path"
        alt="avatar"
      />

      <div v-else>
        <div
          class="border-t-transparent border-solid animate-spin rounded-full border-blue-400 border-8 h-10 w-10"
        ></div>
      </div>

      <div>
        <div class="flex justify-between">
          <h2 class="text-lg font-semibold text-gray-900 -mt-1">
            {{ userData ? userData.name : null }}
          </h2>
          <small class="text-sm text-gray-700">
            {{ postData.timestamp.split("T")[0] }}
          </small>
        </div>
        <div>
          <p>Destinatari</p>
        </div>
        <p class="mt-3 text-gray-700 text-xs md:text-sm">{{ postData.text }}</p>

        <div class="flex justify-end mt-4">
          <div
            className="flex mx-2 items-center text-gray-700 text-sm"
            aria-label="Like Number"
          >
            <span class="text-lg px-2 mr-1"> 😁 </span>
            <span>{{ postData.reactions.positive }}</span>
          </div>
          <div
            className="flex mx-2 items-center text-gray-700 text-sm"
            aria-label="Dislike Icon"
          >
            <span class="text-lg px-2 mr-1"> 😤 </span>
            <span>{{ postData.reactions.negative }}</span>
          </div>
          <div
            className="flex mx-2 items-center text-gray-700 text-sm"
            aria-label="Number Comments"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3193/3193015.png"
              alt=""
              className="w-5 mx-2"
            />
            <span>{{ postData.comments.length }}</span>
          </div>
        </div>

        <div
          class="radial-progress text-primary"
          :style="{ '--value': reactionEngagement }"
        >
          {{ reactionEngagement }}%
        </div>
      </div>
    </div>
  </div>

  <div
    v-else
    class="right-1/2 bottom-1/2 transform translate-x-1/2 translate-y-1/2"
  >
    <div
      class="border-t-transparent border-solid animate-spin rounded-full border-blue-400 border-8 h-20 w-20"
    ></div>
  </div>
</template>
