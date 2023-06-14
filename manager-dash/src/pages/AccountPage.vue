
<template>
    <div class="flex flex-col items-center justify-center h-full pt-8" lang='en'>
        <h1 class="text-4xl font-bold text-center hidden">Profile Page</h1>
        <div v-if="statusUser==='loading'"><LoadingSpinner /></div>
        <div v-else-if="statusUser==='success'">
            <div v-if="user.managing===null">
                <div class="card w-96 bg-emerald-50 shadow-lg">
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
                    <div class="card-body flex items-center">
                        <h2 class="card-title text-2xl mb-4">{{ user.name }}</h2>
                        <div class="card-actions mt-4">
                            <div class="flex flex-col items-center" v-if="user.type==='vip'">
                                <button class="btn btn-info mb-3" @click="changeProfilePicHandler">Change profile pic</button>
                                <label for="propic_path" class="hidden">Profile Picture path </label>
                                <input 
                                    type="url" 
                                    id="propic_path" 
                                    class="w-full mb-4 p-2 rounded-md input input-bordered max-w-xs" 
                                    placeholder="Profile Picture url"
                                    v-model="propic_path"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex justify-center mt-6">
                    <button class="btn btn-sm btn-warning btn-outline" @click="logoutHandler">Log out</button>
                </div>
            </div>
            <div v-else-if="statusUserManaged==='loading'"><LoadingSpinner /></div>
            <div v-else-if="statusUserManaged==='success'">
                <div class="card w-96 bg-emerald-50 shadow-lg">
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
                            <button class="btn btn-info mb-3" @click="changeProfilePicHandler">Change profile pic</button>
                            <label for="propic_path" class="hidden">Profile Picture path </label>
                            <input 
                                type="url" 
                                id="propic_path" 
                                class="w-full p-2 rounded-md input input-bordered max-w-xs" 
                                placeholder="Profile Picture url"
                                v-model="propic_path"
                            />
                        </div>
                    </div>
                </div>
                <div class="flex justify-center mt-6">
                    <button class="btn btn-sm btn-warning btn-outline" @click="logoutHandler">Log out</button>
                </div>
            </div>
            
        </div>  
    </div>
</template>

<script>
import LoadingSpinner from '../components/LoadingSpinner.vue'
import { useQueryClient, useQuery, useMutation } from '@tanstack/vue-query'
import { computed } from 'vue';

export default {
    setup(){
        // Access QueryClient instance
        const queryClient = useQueryClient()
        // Queries
        const { data: user, status: statusUser } = useQuery(['user'], fetchUser)
        // Mutations
        const { mutate: changeProfilePicMutation} = useMutation(changeProfilePic, {
            onSuccess: () => {
                queryClient.invalidateQueries('user')
            },
        })
        
        // Functions
        async function fetchUser() {
            const response = await fetch('http://localhost:3000/user', {
                method: 'GET',
                headers: {
                    Authorization: localStorage.token
                },
            });
            return response.json();
        }

        

        async function changeProfilePic() {
            //console.log(propic_path.value);
            const response = await fetch('http://localhost:3000/user', {
                method: 'PATCH',
                headers: {
                    Authorization: localStorage.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    propic_path: propic_path.value
                })
            });
            //console.log(response);
            return response.json();
        }

        return {
            user,
            statusUser,
            changeProfilePicMutation,
            queryClient,
        }
    },
    data() {
        return {
            propic_path: '',
        }
    },
    components: {
        LoadingSpinner
    },
    methods: {
        changeProfilePicHandler(){
            //console.log(this.user.name, this.user.type, this.user.managing);
            if(this.user.managing === null && this.user.type === 'vip'){
                this.changeProfilePicMutation();
            }else{
                this.changeUserManagedProfilePicMutation()
            }
        },
        logoutHandler(){
            localStorage.removeItem('token');
            this.$router.push({name: 'login'});
        }
    },
    beforeCreate() {
        //Login Control
        if (!localStorage.token) {
            this.$router.push({ name: 'login' })
        }
        
        //const enabled = computed(() => !!this.user && this.user.type === 'manager');

        const { data: userManaged, status: statusUserManaged } = useQuery(['userManaged'], fetchUserManaged, 
            {enabled: !!this.user && this.user.type === 'manager'})

        const {mutate: changeUserManagedProfilePicMutation} = useMutation(changeUserManagedProfilePic, {
            onSuccess: () => {
                this.queryClient.invalidateQueries('userManaged')
            },
        })

        async function fetchUserManaged() {
            console.log(this.user);
            //if(user?.type !== 'manager' && user?.managing === null) return null;
            const response = await fetch('http://localhost:3000/userManager/vip', {
                method: 'GET',
                headers: {
                    Authorization: localStorage.token
                },
            });
            return response.json();
        }

        async function changeUserManagedProfilePic() {
            const response = await fetch('http://localhost:3000/userManager/vip', {
                method: 'PATCH',
                headers: {
                    Authorization: localStorage.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    propic_path: propic_path.value
                })
            });
            return response.json();
        } 
        
        return {
            userManaged,
            statusUserManaged,
            changeUserManagedProfilePicMutation,
        }
    }
}
</script>