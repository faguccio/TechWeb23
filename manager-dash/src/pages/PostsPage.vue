<template>
    <div class="flex flex-col items-center h-full" lang='en'>
        <div>

        </div>
    </div>
</template>
<script>
import { ref, onMounted } from 'vue'
import router from '../router'
import { fetchUser, fetchUserManaged } from '../utils.js'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import PostCard from '../components/PostCard.vue'
import { Const } from '../utils.js'

export default {
    setup(){
        const user = ref(null)
        const userManaged = ref(null)
        const posts = ref(null)
        const statusPosts = ref('loading')
        const isActiveManager = ref(false)

        function fetchData(){
            fetchUser()
            .then((userData) => {
                user.value = userData;
                console.log("user",user.value)
            })
            .then(()=>{
                isActiveManager.value = user.value.type === 'manager' && user.value.managing!==null
                console.log("active manager",isActiveManager.value)
                if(isActiveManager.value){
                    fetchUserManaged()
                    .then((userManagedData) => {
                        userManaged.value = userManagedData;
                        fetchPosts(userManaged.value.id)
                    })
                }else{
                    fetchPosts(user.value.id)
                }
            })
        }
        
        async function fetchPosts(userId) {
            await fetch(`${Const.apiurl}/posts/${userId}`, {
                method: 'GET',
                headers: {
                    Authorization: localStorage.token
                },
            })
            .then((response) => {
                posts.value = response.json();
                statusPosts.value = 'success';
                console.log(posts.value)
            })
        }

        onMounted(() => {
            if(!localStorage.token){
                router.push({name: 'login'});
            }else{
                fetchData();
            }

        })

        return {
            user,
            userManaged,
            posts,
            statusPosts,
            isActiveManager,
            fetchData,
        }
    },
    components: {
        LoadingSpinner
    },
}
</script>