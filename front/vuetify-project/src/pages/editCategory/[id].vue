<template>
    <v-container>
      <v-form @submit.prevent="sendData">
        <v-text-field label="Nou nom de la categoria" v-model="newName"></v-text-field>
        <v-btn type="submit" class="mr-12" color="primary">Editar</v-btn>
            <v-btn to="/categoryAdmin" color="red" margin="80px">Cancel·lar</v-btn>
      </v-form>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { callPutCategory } from '../../services/communicationManager.js';
  
  const route = useRoute(); // Necesario para acceder a los parámetros de la ruta
  const router = useRouter();
  const categoryId = ref('');
  const newName = ref('');
  
  onMounted(() => {
    categoryId.value = route.params.id; // Acceder al parámetro de la ruta
  });
  
  async function sendData() {
    let data = { "id": categoryId.value, "nom": newName.value };
    await callPutCategory(data);
    router.push({ path: '/categoryAdmin' });
  }
  </script>
  