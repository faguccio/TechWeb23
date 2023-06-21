<script setup>
    import { ref, onMounted } from "vue";
    import { Const } from "../utils.js";

    const props = defineProps({
        user: {
            type: Object,
            required: true
        }
    });
    const stats = ref({});

    const fetchStats = async () => {
        const res = await fetch(`${Const.apiurl}/user/${props.user._id}/stats`, {
            method: "GET",
            headers: {
                Authorization: localStorage.token
            }
        });
        return await res.json();
    }; 

    onMounted(() => {
        fetchStats().then((data) => {
            data.LikesPerPost = (data.totalLikes / data.totalPosts).toFixed(1);
            data.DislikesPerPost = (data.totalDislikes / data.totalPosts).toFixed(1);
            data.CommentsPerPost = (data.totalComments / data.totalPosts).toFixed(1);
            data.ImpressionsPerPost = (data.totalImpressions / data.totalPosts).toFixed(1);
            stats.value = data;
            console.log(stats.value);
        });
    });

</script>
<template>
    <div class="flex flex-col items-center justify-center w-96 mt-4">
        <h3 class="text-2xl font-semibold mb-2 hidden">User Stats</h3>
        <h4 class="text-xl font-semibold mb-2">Total stats</h4>
        <div class="stats shadow-lg flex flex-wrap mb-4">
            <div class="stat place-items-center w-1/2">
                <div class="stat-title">Total Posts</div>
                <div class="stat-value">{{ stats.totalPosts }}</div>
            </div>
            <div class="stat place-items-center w-1/2">
                <div class="stat-title">Total Comments</div>
                <div class="stat-value">{{ stats.totalComments }}</div>
            </div>
            <div class="stat place-items-center w-full">
                <div class="stat-title">Total Impressions</div>
                <div class="stat-value">{{ stats.totalImpressions }}</div>
            </div>
            <div class="stat place-items-center w-1/2">
                <div class="stat-title">Total Likes</div>
                <div class="stat-value">{{ stats.totalLikes }}</div>
            </div>
            <div class="stat place-items-center w-1/2">
                <div class="stat-title">Total Dislike</div>
                <div class="stat-value">{{ stats.totalDislikes }}</div>
            </div>
        </div>
        <h4 class="text-xl font-semibold mb-2">Per Post stats</h4>
        <div class="stats shadow-lg flex flex-wrap mb-4">
            <div class="stat place-items-center w-1/2">
                <div class="stat-title">Comments / Post</div>
                <div class="stat-value">{{ stats.CommentsPerPost }}</div>
            </div>
            <div class="stat place-items-center w-1/2">
                <div class="stat-title">Impressions / Post</div>
                <div class="stat-value">{{ stats.ImpressionsPerPost }}</div>
            </div>
            <div class="stat place-items-center w-1/2">
                <div class="stat-title">Likes / Post</div>
                <div class="stat-value">{{ stats.LikesPerPost }}</div>
            </div>
            <div class="stat place-items-center w-1/2">
                <div class="stat-title">Dislike / Post</div>
                <div class="stat-value">{{ stats.DislikesPerPost }}</div>
            </div>
        </div>
        <h4 class="text-xl font-semibold">Max stats</h4>
        <div class="stats shadow-lg flex flex-wrap mb-4">
            <div class="stat place-items-center w-full">
                <div class="stat-title">Max Comments</div>
                <div class="stat-value">{{ stats.maxComments }}</div>
            </div>
            <div class="stat place-items-center w-full">
                <div class="stat-title">Max Impressions</div>
                <div class="stat-value">{{ stats.maxImpressions }}</div>
            </div>
            <div class="stat place-items-center w-full">
                <div class="stat-title">Max Likes</div>
                <div class="stat-value">{{ stats.maxLikes }}</div>
            </div>
        </div>
    </div>
</template>