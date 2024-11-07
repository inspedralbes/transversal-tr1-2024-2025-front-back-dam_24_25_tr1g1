<template>
  <!-- <v-app-bar app color="primary">
    <v-toolbar-title>Productes</v-toolbar-title>
  </v-app-bar> -->

  <v-container class="general_container">
    <v-btn color="primary" :to="'/createProduct'" class="create-btn">Crear producte</v-btn>
    <div class="product_container">
      <div
        v-for="category in categories.filter(category => products.some(p => p.category === category.id))"
        :key="category.id" class="category_container">
        <h2>{{ category.nom }}</h2>
        <ul class="grid">
          <li v-for="product in products.filter(p => p.category === category.id)" :key="product.id" class="tarjeta">
            <tarjeta
             :product="product"
             @productDeleted="handleProductDeleted"/>
          </li>
        </ul>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import tarjeta from "../components/tarjeta.vue";
import { callGetCategories, callGetProducts, callDeleteUser } from "../services/communicationManager.js";
import socket from '@/services/socket.js';

const categories = ref([]);
const products = ref([]);

// Carga las categorías y productos iniciales
onMounted(async () => {
  categories.value = await callGetCategories();
  products.value = await callGetProducts();

  // Escucha el evento de eliminación de producto a través del socket
  socket.on('productDeleted', (data) => {
    handleProductDeleted(data.id); // Asegúrate de que data contenga la propiedad id
  });
});

// Función para manejar la eliminación del producto en el frontend
const handleProductDeleted = (id) => {
  products.value = products.value.filter(product => product.id !== id);
};

// Función para eliminar el producto manualmente
const deleteProduct = async (id) => {
  await callDeleteUser(id);  // Llama a la API para eliminar el producto en el servidor
  handleProductDeleted(id);  // Remueve el producto localmente tras la eliminación
};

</script>

<style scoped>
li {
  list-style-type: none;
  width: 100%;
  height: 100%;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: 1fr;
  margin:auto;
  gap: 1rem;
}

.product_container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.general_container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  padding: 1rem;
}

ul {
  width: 100%;
  padding: 0;
}

.category_container {
  margin-bottom: 2rem;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.create-btn {
  margin-bottom: 1rem;
  position: sticky;
  top: 70px;
  z-index: 1;
}

h2 {
  color: #3f51b5;
  margin-bottom: 1rem;
  text-align: center;
}
.tarjeta{
  width: 100%;
  height: auto;
}
</style>