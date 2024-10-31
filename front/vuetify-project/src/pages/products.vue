<template>

    <v-app-bar app color="primary">
      <v-toolbar-title>Productes</v-toolbar-title>
    </v-app-bar>

    <v-btn color="primary" :to="'/createProduct'">Crear producte</v-btn>
  <v-container class="fill-height">
    <div >
      <div
        v-for="category in categories.filter(category => products.some(p => p.category === category.id))"
        :key="category.id" >
        <h2>{{ category.nom }}</h2>
        <ul class="grid">
          <li v-for="product in products.filter(p => p.category === category.id)" :key="product.id" >
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
import  tarjeta  from "../components/tarjeta.vue";
import { callGetCategories, callGetProducts } from "../services/communicationManager.js";


const categories = ref([]);
const products = ref([]);

onMounted(async () => {
  categories.value = await callGetCategories();
  products.value = await callGetProducts();
});


// Método para manejar la eliminación del producto
const handleProductDeleted = (id) => {
  products.value = products.value.filter(product => product.id !== id);
};

</script>
<style scoped>
    li {
        list-style-type: none;
    }
    .grid{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 1rem;
    }
</style>