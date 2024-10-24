<template>

    <v-app-bar app color="primary">
      <v-toolbar-title>Productes</v-toolbar-title>
    </v-app-bar>

    <v-btn color="primary" :to="'/createProduct'">Crear producte</v-btn>
  <v-container class="fill-height">
    <div >
      <div
        v-for="category in categoriesData.categories.filter(category => productsData.products.some(p => p.category === category.id))"
        :key="category.id" >
        <h2>{{ category.nom }}</h2>
        <ul class="grid">
          <li v-for="product in productsData.products.filter(p => p.category === category.id)" :key="product.id" >
            <tarjeta :product="product"/>
            
          </li>
        </ul>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import categoriesData from '../assets/categories.json';
import productsData from '../assets/productes.json';
import  tarjeta  from "../components/tarjeta.vue";

const categories = ref([]);
const products = ref([]);

onMounted(() => {
  categories.value = categoriesData;
  products.value = productsData;
});
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