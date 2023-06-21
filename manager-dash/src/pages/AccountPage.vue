
<template>
    <div class="flex flex-col items-center h-full py-8" lang='en'>
        <h1 class="text-4xl font-bold text-center hidden">Profile Page</h1>
        <div v-if="statusUser==='loading'"><LoadingSpinner /></div>
        <div v-else-if="statusUser==='success'" class="">
            <div v-if="user.managing===null" class="flex flex-col items-center">
                <div class="card w-96 md:w-1/3 bg-emerald-50 shadow-lg">
                    <div class="m-4"> 
                        <div v-if="user.type==='vip'">
                            <div class="badge badge-primary">Vip</div>
                        </div>
                        <div v-else>
                            <div class="badge badge-secondary">Manager</div>
                        </div>
                    </div>
                    <div class="avatar px-10 py-2">
                        <div class="mask mask-squircle" >
                            <img :src="user.propic_path" alt="Profile Picture" />
                        </div>
                    </div>
                    <div class="card-body flex md items-center">
                        <h2 class="card-title text-2xl mb-4">{{ user.name }}</h2>
                        <div class="card-actions mt-4">
                            <div class="flex flex-col items-center" >
                                <label for="propic_path" class="hidden">Profile Picture path </label>
                                <input 
                                type="url" 
                                id="propic_path" 
                                class="w-full mb-4 p-2 rounded-md input input-bordered max-w-xs" 
                                placeholder="Profile Picture url"
                                v-model="propic_path"
                                />
                                <button class="btn btn-info mb-3" @click="changeProfilePicHandler">Change profile pic</button>
                            </div>
                        </div>
                    </div>
                </div>
                <UserStats :user="user" />
                <div class="flex justify-center mt-6">
                    <button class="btn btn-sm btn-outline" @click="logoutHandler">Log out</button>
                </div>
            </div>
            <div v-else-if="statusUserManaged==='loading'"><LoadingSpinner /></div>
            <div v-else-if="statusUserManaged==='success'" class="flex flex-col items-center">
                <div class="card w-96 md:w-1/3 bg-emerald-50 shadow-lg">
                    <div class="m-4">
                        <div class="badge badge-accent">Vip Managed</div>
                    </div>
                    <div class="avatar px-10 py-2">
                        <div class="mask mask-squircle" >
                            <img :src="userManaged.propic_path" alt="Profile Picture" />
                        </div>
                    </div>
                    <div class="card-body flex items-center"> 
                        <h2 class="card-title text-2xl mb-4">{{ userManaged.name }}</h2>
                        <div class="card-actions flex flex-col items-center mt-4">
                            <label for="propic_path" class="hidden">Profile Picture path </label>
                            <input 
                            type="url" 
                            id="propic_path" 
                            class="w-full p-2 rounded-md input input-bordered max-w-xs" 
                            placeholder="Profile Picture url"
                            v-model="propic_path"
                            />
                            <button class="btn btn-info mb-2" @click="changeProfilePicHandler">Change profile pic</button>
                        </div>
                    </div>
                </div>
                <UserStats :user="userManaged" />
                <div class="flex justify-center mt-6">
                    <button class="btn btn-sm btn-outline" @click="logoutHandler">Log out</button>
                </div>
            </div>
            
        </div>  
    </div>
</template>

<script>
import LoadingSpinner from '../components/LoadingSpinner.vue'
import UserStats from '../components/UserStats.vue'
import { computed, ref, onMounted, watch, onBeforeMount} from 'vue';
import  router  from '../router';
import {Const} from '../utils.js';

export default {
    setup(){
        
        //Refs
        const user = ref(null)
        const statusUser = ref('loading')
        const userManaged = ref(null)
        const statusUserManaged = ref('loading')
        
        //const enabled = computed(() => !!user.value && user.value.type === 'manager')

    
        // Functions
        async function fetchUser() {
            const response = await fetch(`${Const.apiurl}/user`, {
                method: 'GET',
                headers: {
                    Authorization: localStorage.token
                },
            });
            return await response.json();
        }

        async function fetchUserManaged() {
            const response = await fetch(`${Const.apiurl}/userManager/vip`, {
                method: 'GET',
                headers: {
                    Authorization: localStorage.token
                },
            });
            return await response.json();
        }    
        
        async function changeProfilePic() {
            const response = await fetch(`${Const.apiurl}/user`, {
                method: 'PATCH',
                headers: {
                    Authorization: localStorage.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    propic_path: propic_path.value
                })
            });
            return await response.json();
        }
        
        async function changeUserManagedProfilePic() {
            const response = await fetch(`${Const.apiurl}/userManager/vip`, {
                method: 'PATCH',
                headers: {
                    Authorization: localStorage.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    propic_path: propic_path.value
                })
            });
            return await response.json();
        }
        
        function fetchData(){
            fetchUser()
            .then((userData) => {
                user.value = userData;
                statusUser.value = 'success';
            })
            .then(()=>{
                if(user.value.type === 'manager' && user.value.managing!==null){
                    fetchUserManaged()
                    .then((userManagedData) => {
                        userManaged.value = userManagedData;
                        statusUserManaged.value = 'success';
                    })
                }
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
            statusUser,
            userManaged,
            statusUserManaged,
            changeProfilePic,
            changeUserManagedProfilePic,
            fetchData,
        }
    },
    data() {
        return {
            propic_path: '',
        }
    },
    components: {
        LoadingSpinner,
        UserStats
    },
    methods: {
        changeProfilePicHandler(){
            if(this.user.managing === null){
                this.changeProfilePic()
                .then(()=>{
                    this.fetchData();
                })           
            }else{
                this.changeUserManagedProfilePic()
                .then(()=>{
                    this.fetchData();
                })
            }
        },
        logoutHandler(){
            localStorage.removeItem('token');
            this.$router.push({name: 'login'});
        }
    }
}
</script>