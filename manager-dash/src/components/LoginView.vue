<template>
    <form class="flex flex-col items-center justify-center" >
        <label for="username" class="label-text w-full flex justify-start mb-2">Username</label>
        <input 
            type="text" 
            id="username" 
            class="w-full mb-4 p-2 rounded-md input input-bordered" 
            placeholder="Username"
            required
            v-model="username"
        />
        <label for="password" class="label-text w-full flex justify-start mb-2">Password</label>
        <input 
            type="password" 
            id="password" 
            class="w-full mb-4 p-2 rounded-md input input-bordered" 
            placeholder="Password" 
            required
            v-model="password"
        />
        <div 
            class="alert alert-error shadow-lg w-full flex items-center justify-between mb-4" 
            v-if="alert"
            role="alert"
            aria-roledescription='alert for login error message'
        >
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{{ alertMessage }}</span>
            </div>
        </div>
        <button type="button" class="w-full p-2 rounded-md bg-blue-800 text-white" v-on:click.prevent = "login()">Log in</button>
    </form>
</template>

<script>
import {Const} from '../utils.js';
    export default {
        data() {
            return {
                username: '',
                password: '',
                alert: false,
                alertMessage: ''
            }
        },
        methods: {
            async loginRequest() {
                if(this.username !== "" && this.password !== ""){
                    const response = await fetch(`${Const.apiurl}/users/loginPro`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name: this.username,
                            password: this.password
                        })
                    })
                    const ret = {
                        data: await response.json(),
                        status: await response.status
                    };
                    console.log(ret);
                    
                    return ret;
                }else{
                    return { data: { message: "Username or password is empty"} };
                }
            },
            async login() {
                const response = await this.loginRequest();
                if(response.status === 200){
                    //this.$store.commit('setUser', response.data);
                    this.alert = false;
                    localStorage.setItem('token', response.data.token);
                    this.$router.push({ name: 'home' });
                }else{
                    console.log(response);
                    this.alert = true;
                    this.alertMessage = response.data.message;
                }
            }
        }
    }
</script>