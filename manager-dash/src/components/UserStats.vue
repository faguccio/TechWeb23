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
                Authorization: localStorage.tokenPro
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
    <div class="flex flex-col items-center w-96 md:w-1/2 mt-4 p-6">
        <h3 class="text-2xl font-semibold mb-2">User Stats</h3>
        <div class="flex flex-col md:flex-row md:flex-wrap md:justify-evenly md:items-center">
            <div>
                <h4 class="text-xl font-semibold mb-2 text-center">Total stats</h4>
                <div class="stats shadow-lg flex flex-wrap mb-4 bg-sky-100">
                    <div class="stat place-items-center w-1/2">
                        <div class="stat-title font-medium">Total Posts</div>
                        <div class="stat-value">{{ stats.totalPosts }}</div>
                    </div>
                    <div class="stat place-items-center w-1/2">
                        <div class="stat-title font-medium">Total Comments</div>
                        <div class="stat-value">{{ stats.totalComments }}</div>
                    </div>
                    <div class="stat place-items-center w-full">
                        <div class="stat-title font-medium">Total Impressions</div>
                        <div class="stat-value text-amber-500">{{ stats.totalImpressions }}</div>
                    </div>
                    <div class="stat place-items-center w-1/2">
                        <div class="stat-title font-medium">Total Likes</div>
                        <div class="stat-value text-green-600">{{ stats.totalLikes }}</div>
                    </div>
                    <div class="stat place-items-center w-1/2">
                        <div class="stat-title font-medium">Total Dislike</div>
                        <div class="stat-value text-red-600">{{ stats.totalDislikes }}</div>
                    </div>
                </div>
            </div>
            <div>
                <h4 class="text-xl font-semibold mb-2 text-center">Per Post stats</h4>
                <div class="stats shadow-lg flex flex-wrap mb-4 bg-sky-100">
                    <div class="stat place-items-center w-1/2">
                        <div class="stat-title font-medium">Comments / Post</div>
                        <div class="stat-value">{{ stats.CommentsPerPost }}</div>
                    </div>
                    <div class="stat place-items-center w-1/2">
                        <div class="stat-title font-medium">Impressions / Post</div>
                        <div class="stat-value text-amber-500">{{ stats.ImpressionsPerPost }}</div>
                    </div>
                    <div class="stat place-items-center w-1/2">
                        <div class="stat-title font-medium">Likes / Post</div>
                        <div class="stat-value text-green-600">{{ stats.LikesPerPost }}</div>
                    </div>
                    <div class="stat place-items-center w-1/2">
                        <div class="stat-title font-medium">Dislike / Post</div>
                        <div class="stat-value text-red-600">{{ stats.DislikesPerPost }}</div>
                    </div>
                </div>
            </div>
            <div>
                <h4 class="text-xl font-semibold mb-2 text-center">Max stats</h4>
                <div class="stats shadow-lg flex flex-wrap mb-4 bg-sky-100">
                    <div class="stat place-items-center w-full">
                        <div class="stat-title font-medium">Max Comments</div>
                        <div class="stat-value">{{ stats.maxComments }}</div>
                    </div>
                    <div class="stat place-items-center w-full">
                        <div class="stat-title font-medium">Max Impressions</div>
                        <div class="stat-value text-amber-500">{{ stats.maxImpressions }}</div>
                    </div>
                    <div class="stat place-items-center w-full">
                        <div class="stat-title font-medium">Max Likes</div>
                        <div class="stat-value text-green-600">{{ stats.maxLikes }}</div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>