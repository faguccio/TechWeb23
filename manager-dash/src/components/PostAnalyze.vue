<script setup>
import { ref, onMounted } from "vue";
import GeoMap from "./GeoMap.vue";
import { Const } from "../utils.js";

const postData = ref(false);
const userData = ref(false);
const props = defineProps({ id: String });

const reactionRatio = ref(0);
const commentEngagement = ref(0);
const reactionEngagement = ref(0);
const progressToPopular = ref(0);
const progressToUnpopular = ref(0);
const comments = ref([]);
const newComment = ref("");

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

const addComment = async (e) => {
  e.preventDefault();
  const res = await fetch(`${Const.apiurl}/post/${props.id}/comments/manager`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.tokenPro,
    },
    body: JSON.stringify({ text: newComment.value }),
  });
  postData.value = await fetchData();
  comments.value = postData.value.comments.map((comm) => {
    const [name, comment] = comm.split("\n");
    return { name: name, comment: comment };
  });
};

onMounted(() => {
  fetchData().then((pd) => {
    postData.value = pd;
    comments.value = pd.comments.map((comm) => {
      const [name, comment] = comm.split("\n");
      return { name: name, comment: comment };
    });

    if (pd.reactions.positive + pd.reactions.negative > 0) {
      reactionRatio.value = (
        (pd.reactions.positive /
          (pd.reactions.positive + pd.reactions.negative)) *
        100
      ).toFixed(1);
    }

    if (pd.impressions > 0) {
      commentEngagement.value = (pd.comments.length / pd.impressions).toFixed(
        1
      );
      reactionEngagement.value = (
        ((pd.reactions.positive + pd.reactions.negative) / pd.impressions) *
        100
      ).toFixed(1);

      progressToPopular.value = (
        (pd.reactions.positive * 100) /
        (0.2 * pd.impressions)
      ).toFixed(1);

      progressToUnpopular.value = (
        (pd.reactions.negative * 100) /
        (0.2 * pd.impressions)
      ).toFixed(1);
    }
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
        <div class="flex flex-wrap">
          <p v-for="dest in postData.recipients" class="px-2">
            {{ dest }}
          </p>
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
      </div>
    </div>
  </div>

  <div
    v-if="postData"
    class="flex flex-col bg-white shadow-lg rounded-lg mx-4 md:mx-auto mb-8 md:max-w-2xl md:w-8/12"
  >
    <h2 class="text-2xl text-slate-700 font-semibold self-center m-4">
      Few Stats
    </h2>
    <div class="flex justify-around">
      <div class="flex flex-col items-center m-4">
        <div
          class="radial-progress text-primary bg-slate-200 border-4"
          :style="{
            '--value': reactionRatio,
            '--size': 7 + 'rem',
            '--thickness': '6px',
          }"
        >
          {{ reactionRatio }}%
        </div>
        <p class="w-min text-center text-black">Like to reactions</p>
      </div>

      <div class="flex flex-col items-center m-4">
        <div
          class="radial-progress text-success bg-slate-200 border-4"
          :style="{
            '--value': commentEngagement,
            '--size': 7 + 'rem',
            '--thickness': '6px',
          }"
        >
          {{ commentEngagement }}%
        </div>
        <p class="w-min text-center text-black">Comment engagement</p>
      </div>

      <div class="flex flex-col items-center m-4">
        <div
          class="radial-progress text-orange-600 bg-slate-200 border-4"
          :style="{
            '--value': reactionEngagement,
            '--size': 7 + 'rem',
            '--thickness': '6px',
          }"
        >
          {{ reactionEngagement }}%
        </div>
        <p class="w-min text-center text-black">Reaction engagement</p>
      </div>
    </div>

    <div class="stats shadow m-4">
      <div class="stat">
        <div class="stat-figure text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-8 h-8 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            ></path>
          </svg>
        </div>
        <div class="stat-title">Total Likes</div>
        <div class="stat-value text-primary">
          {{ postData.reactions.positive }}
        </div>
      </div>

      <div class="stat">
        <div class="stat-figure text-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-8 h-8 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            ></path>
          </svg>
        </div>
        <div class="stat-title">Views</div>
        <div class="stat-value text-secondary">{{ postData.impressions }}</div>
      </div>
    </div>

    <h3 class="mx-2 mt-4 text-black text-lg ml-4">Progress to popular</h3>
    <progress
      className="mx-2 rounded-lg mb-4 h-4 bg-success"
      :value="progressToPopular"
      max="100"
    ></progress>

    <h3 class="mx-2 mt-4 text-black text-lg ml-4">Progress to unpopular</h3>
    <progress
      className="mx-2 rounded-lg mb-4 h-4 bg-warning"
      :value="progressToUnpopular"
      max="100"
    ></progress>
  </div>

  <div
    v-if="postData"
    class="flex flex-col bg-white shadow-lg rounded-lg mx-4 md:mx-auto mb-16 md:max-w-2xl md:w-8/12"
  >
    <h2 class="text-2xl text-slate-700 font-semibold self-center m-4">
      Comments
    </h2>

    <form class="flex flex-col mx-6">
      <label class="font-lg text-black" for="testo">Add comment</label>
      <p>Comment text must not be empty</p>
      <textarea
        v-model="newComment"
        id="testo"
        class="textarea textarea-bordered mt-1"
      >
      </textarea>
      <button
        class="w-fit self-center my-2 btn btn-primary"
        @click="addComment"
      >
        ADD
      </button>
    </form>

    <div
      v-for="comment in comments"
      class="flex flex-col mx-5 items-start shadow-lg rounded-lg p-4 my-4 text-slate-600"
    >
      <h5 class="text-xl">@{{ comment.name }}</h5>
      <p class="ml-2">{{ comment.comment }}</p>
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
