<template>
    <v-container>
      <v-form @submit.prevent="handleSubmit">
        <v-text-field label="Nom del producte" v-model="product.nom" />
        <v-text-field label="Descripció" v-model="product.descripcio" />
        <v-number-input
          :reverse="false"
          controlVariant="split"
          label="Preu"
          :hideInput="false"
          :inset="false"
          v-model="product.preu"
        ></v-number-input>
        <v-number-input
          :reverse="false"
          controlVariant="split"
          label="Preu oferta"
          :hideInput="false"
          :inset="false"
          v-model="product.oferta"
        ></v-number-input>
        <v-number-input
          :reverse="false"
          controlVariant="split"
          label="Stock"
          :hideInput="false"
          :inset="false"
          v-model="product.stock"
        ></v-number-input>
        <v-select label="Category" :items="categories" v-model="product.category"></v-select>
        <v-file-input
          label="Imatge"
          variant="solo"
          accept="image/*"
          v-model="product.image"
        ></v-file-input>
        <v-checkbox label="halal" v-model="product.halal"></v-checkbox>
        <v-checkbox label="vegà" v-model="product.vegan"></v-checkbox>
        <v-checkbox label="conté gluten" v-model="product.gluten"></v-checkbox>
        <v-checkbox label="conté lactosa" v-model="product.lactosa"></v-checkbox>
        <v-checkbox label="conté crustacis" v-model="product.crustacis"></v-checkbox>
        <v-btn color="primary" type="submit">Submit</v-btn>
      </v-form>
    </v-container>
  </template>
  
  <script setup>
  import { callGetCategories, callGetProductById, callPutProduct } from '../../services/communicationManager.js';
  import { useRoute, useRouter } from 'vue-router';
  import { ref, onMounted } from 'vue';
  
  const categoriesFull = ref([]);
  const product = ref({
    nom: '',
    descripcio: '',
    preu: 0,
    oferta: 0,
    stock: 0,
    category: '',
    halal: false,
    vegan: false,
    gluten: false,
    lactosa: false,
    crustacis: false,
    image: null
  });
  const route = useRoute();
  const router = useRouter();
  const categories = ref([]);
  
  onMounted(async () => {
    categoriesFull.value = await callGetCategories();
    let id = route.params.id;
  
    product.value = await callGetProductById(id);
    product.value.halal = Boolean(product.value.halal);
    product.value.vegan = Boolean(product.value.vegan);
    product.value.gluten = Boolean(product.value.gluten);
    product.value.lactosa = Boolean(product.value.lactosa);
    product.value.crustacis = Boolean(product.value.crustacis);
    product.value.oferta = product.value.oferta ?? 0;
  
    categories.value = categoriesFull.value.map((element) => element.nom);
  
    const categoryObj = categoriesFull.value.find(
      (element) => element.id === product.value.category
    );
    product.value.category = categoryObj ? categoryObj.nom : '';
  });
  
  async function handleSubmit() {
    if (!product.value.nom || !product.value.descripcio || product.value.preu == null || 
        product.value.stock == null || !product.value.category) {
      alert(`Falten camps per omplir`);
      return;
    }
  
    let dataAdapted = {
      id: route.params.id,
      nom: product.value.nom,
      descripcio: product.value.descripcio,
      preu: product.value.preu,
      oferta: product.value.oferta === 0 ? null : product.value.oferta,
      stock: product.value.stock,
      category: categoriesFull.value.find(
        (category) => category.nom === product.value.category
      ).id,
      halal: product.value.halal ? 1 : 0,
      vegan: product.value.vegan ? 1 : 0,
      gluten: product.value.gluten ? 1 : 0,
      lactosa: product.value.lactosa ? 1 : 0,
      crustacis: product.value.crustacis ? 1 : 0,
    };
  
    const imageFile = product.value.image;
    await callPutProduct(dataAdapted, imageFile);
  
    alert('Producte actualitzat correctament!');
    router.push({ path: '/products' });
  }
  </script>
  