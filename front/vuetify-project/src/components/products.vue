<template>
  <v-container class="fill-height">
    <div >
      <div
        v-for="category in categoriesData.categories.filter(category => productsData.products.some(p => p.category === category.id))"
        :key="category.id" >
        <h2>{{ category.nom }}</h2>
        <ul class="grid">
          <li v-for="product in productsData.products.filter(p => p.category === category.id)" :key="product.id" >
            <v-card>
              <v-img :src="product.fotoRuta" alt="Product Image" />
              <v-card-title>{{ product.nom }}</v-card-title>
              <v-card-text>{{ product.descripcio }}</v-card-text>
              <v-card-text>Preu original {{ product.preu.toFixed(2) }} €</v-card-text>
              <v-card-text v-if="product.oferta">Preu ofertat {{ product.oferta.toFixed(2) }} €</v-card-text>
              <v-card-text>Stock {{ product.stock }}</v-card-text>
              <div class="grid">
                <v-img src="../assets/halal.png" v-if="product.halal==1"></v-img>
                <v-img src="../assets/vegan.png" v-if="product.vegan==1"></v-img>
                <v-img src="../assets/gluten.png" v-if="product.gluten==1"></v-img>
                <v-img src="../assets/lactosa.png" v-if="product.lactosa==1"></v-img>
                <v-img src="../assets/crustacis.png" v-if="product.crustacais==1"></v-img>
              </div>
            </v-card>
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