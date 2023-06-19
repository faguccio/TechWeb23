<template>
    <div class="flex flex-col items-center justify-center h-full" lang='en'>
        <div className="flex flex-col items-center justify-center w-96 mt-24">
            <h1 class="text-4xl font-bold mb-8">Log in</h1>
            <LoginView />
        </div>
    </div>
</template>

<script>
import LoginView from '../components/LoginView.vue';

export default {
    components: { LoginView }
}
</script>