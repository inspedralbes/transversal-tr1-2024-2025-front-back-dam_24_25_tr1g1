<template>
    
</template>

<script setup>
import router from '@/router';
import { ref, onMounted } from 'vue';
onMounted(() => {
    router.push('/products');
});
</script>
