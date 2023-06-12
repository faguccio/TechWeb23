<script setup>
import { ref, onMounted } from "vue";
import GeoMap from "./GeoMap.vue";

const postData = ref(false);
const userData = ref(false);
const props = defineProps({ id: String });

const fetchData = async () => {
  console.log(`http://localhost:3000/post/${props.id}`);
  const res = await fetch(`http://localhost:3000/post/${props.id}`);
  return await res.json();
};

const fetchUser = async () => {
  const res = await fetch(
    `http://localhost:3000/user/${postData.value.sender}`
  );
  const ret = await res.json();
  return ret;
};

onMounted(() => {
  fetchData().then((pd) => {
    postData.value = pd;
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
        <img
          v-if="postData.image_path"
          class="my-5 rounded-lg"
          :src="postData.image_path"
        />
        <div
          v-if="postData.geolocation"
          className="h-52 md:h-96 z-0 w-auto  shadow-lg  shadow-gray-500"
        >
          <GeoMap
            lat="postData.geolocation.lat"
            lon="postData.geolocation.lat"
          />
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

<!-- import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import GeoMap from "./GeoMap";
import LoadingSpinner from "./LoadingSpinner";

function PostCard({ id }) {
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState([false, false]);

  const positiveR = {
    emoji: "😁",
    type: "positive",
    alt: "Like Button",
    amount: 0,
  };
  const negativeR = {
    emoji: "😤",
    type: "negative",
    alt: "Dislike Button",
    amount: 0,
  };

  const reactions = [positiveR, negativeR];

  const fetchData = async () => {
    const res = await fetch(`http://localhost:3000/post/${id}`);
    return res.json();
    //setData(ret);
  };

  const fetchUser = async () => {
    const res = await fetch(`http://localhost:3000/user/${data.sender}`);
    const ret = await res.json();
    return ret;
    // setUser(ret);
  };

  function sium() {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
    });
  }

  const { data, status } = useQuery(["post-card", id], fetchData);

  const { data: user, status2 } = useQuery(["user", id], fetchUser, {
    enabled: !!data,
  });

  const addLike = useMutation({
    mutationFn: async (rtype) => {
      const data = { type: rtype, increase: true };
      const res = await fetch(`http://localhost:3000/post/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-card", id] });
    },
  });

  if (status !== "success")
    return (
      <div class="flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  const reactionsUI = reactions.map((reaction) => (
    <div
      class="flex mx-2 items-center text-gray-700 text-sm"
      key={crypto.randomUUID()}
    >
      <button
        class="btn btn-sm btn-outline text-lg px-2 mr-1"
        aria-label={reaction.alt}
        onClick={() => {
          addLike.mutate(reaction.type);
        }}
      >
        {reaction.emoji}
      </button>
      <span>
        {reaction.type === "positive"
          ? data.reactions.positive
          : data.reactions.negative}
      </span>
    </div>
  ));

  return (
      );
}

export default PostCard; -->
