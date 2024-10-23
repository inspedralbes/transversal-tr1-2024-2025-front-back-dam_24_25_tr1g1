<template>
    <v-container>
       <v-form @click="sendData">
            
           <v-text-field label="Nou nom de la categoria" v-model="newName">

           </v-text-field>
           <v-btn color="primary">Submit</v-btn>
       </v-form>
    </v-container>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
    const route = useRoute();
    const categoryId = ref('');
    const newName = ref('');

    onMounted(() => {
        categoryId.value = route.params.id;
    });
    
    function sendData(){
        fetch("http://localhost:3000/categories/" + categoryId.value, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nom: newName.value
            })
        });
    }


</script>