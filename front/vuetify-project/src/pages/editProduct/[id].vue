<template>
    <v-container>
        <v-form @submit.prevent="handleSubmit">
            <v-text-field label="Nom del producte" v-model="productName"></v-text-field>
            <v-text-field label="Descripció" v-model="descripció" ></v-text-field>
            <v-number-input
  :reverse="false"
  controlVariant="split"
  label="Preu"
  :hideInput="false"
  :inset="false"
  v-model="price"
></v-number-input>
<v-number-input
  :reverse="false"
  controlVariant="split"
  label="Preu oferta"
  :hideInput="false"
  :inset="false"
  v-model="offerPrice"
></v-number-input>
<v-number-input
  :reverse="false"
  controlVariant="split"
  label="Stock"
  :hideInput="false"
  :inset="false"
  v-model="stock"
></v-number-input>
            <v-select
            label="Category"
            :items="categories"
            v-model="valueToSend"
            ></v-select>
            <v-file-input label="Imatge" variant="solo"></v-file-input>
            <v-btn color="primary">Submit</v-btn>
            
        </v-form>
    </v-container>
</template>
<script setup>
import categoriesData from '../assets/categories.json';
import { ref,onMounted } from 'vue';

    const categories = ref([]);
    const categoriesFull=ref([]);
    const productName = ref('');
    const descripció = ref('');
    const price = ref(0);
    const offerPrice = ref(0);
    const stock = ref(0);
    const valueToSend = ref('');


    onMounted(() => {
        let auxArray=[];
        let auxCategories  = categoriesData.categories;
        auxCategories.forEach(element => {
           auxArray.push(element.nom);
           console.log(element.nom);
        });
        categories.value = auxArray;
        categoriesFull.value=auxCategories;
    });
    const handleSubmit = () => {
        const productData = {
            name: productName.value,
            description: descripció.value,
            price: price.value,
            offerPrice: offerPrice.value,
            stock: stock.value,
            category: valueToSend.value,
        };
        console.log('Product Data:', productData);
        // Add your form submission logic here, e.g., send data to an API
    };

</script>