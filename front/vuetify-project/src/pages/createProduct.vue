
<!-- /**
 * This Vue component provides a form for creating a new product. 
 * It includes fields for product name, description, price, offer price, stock, category, image, and various checkboxes for product attributes.
 * 
 * Template:
 * - v-container: Container for the form.
 * - v-form: Form element with a submit handler.
 * - v-text-field: Input fields for product name and description.
 * - v-number-input: Input fields for price, offer price, and stock.
 * - v-select: Dropdown for selecting a category.
 * - v-file-input: Input for uploading an image.
 * - v-checkbox: Checkboxes for product attributes (halal, vegan, gluten, lactosa, crustacis).
 * - v-btn: Submit button.
 * 
 * Script:
 * - Imports necessary functions and hooks from Vue and a communication manager.
 * - Defines reactive variables for form fields and categories.
 * - Fetches categories on component mount and populates the category dropdown.
 * - handleSubmit: Function to handle form submission, constructs form data and calls an API to post the product.
 * 
 * Dependencies:
 * - Vue 3
 * - Vuetify
 * - communicationManager.js for API calls
 * - vue-router for navigation
 */ -->
<template>
    <v-container>
        <v-form @submit.prevent="handleSubmit" id="form" class="form">
            <v-text-field label="Nom del producte" v-model="productName"></v-text-field>
            <v-text-field label="Descripció" v-model="descripció"></v-text-field>
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
            <v-file-input
                label="Imatge"
                variant="solo"
                accept="image/*"
            ></v-file-input>
            <v-checkbox label="halal" v-model="halal"></v-checkbox>
            <v-checkbox label="vegà" v-model="vegà"></v-checkbox>
            <v-checkbox label="conté gluten" v-model="gluten"></v-checkbox>
            <v-checkbox label="conté lactosa" v-model="lactosa"></v-checkbox>
            <v-checkbox label="conté crustacis" v-model="crustacis"></v-checkbox>
            <v-btn type="submit" color="primary">Submit</v-btn>
        </v-form>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { callPostProduct, callGetCategories } from '../services/communicationManager.js';
import { useRoute, useRouter } from 'vue-router';

const categories = ref([]);
const categoriesFull = ref([]);
const productName = ref('');
const descripció = ref('');
const price = ref(0);
const offerPrice = ref(0);
const stock = ref(0);
const valueToSend = ref('');
const halal = ref(false);
const vegà = ref(false);
const gluten = ref(false);
const lactosa = ref(false);
const crustacis = ref(false);
const route = useRoute(); 
const router = useRouter();

onMounted(async () => {
    let auxArray = [];
    let auxCategories = await callGetCategories();
    console.log('Categories:', auxCategories);
    auxCategories.forEach(element => {
        auxArray.push(element.nom);
        console.log(element.nom);
    });
    categories.value = auxArray;
    categoriesFull.value = auxCategories;
});



  const handleSubmit = async () => {
    if(productName.value==null || descripció.value==null || price.value==null || stock.value==null || valueToSend.value==null || !document.querySelector('input[type="file"]').files.length ){
        alert("Falten camps per omplir");
    } else {
        
    const formData = {
        nom: productName.value,
        descripcio: descripció.value,
        preu: price.value,
        oferta: offerPrice.value || null,
        stock: stock.value,
        category: categoriesFull.value.find(category => category.nom === valueToSend.value).id,
        halal: halal.value ? 1 : 0,
        vegan: vegà.value ? 1 : 0,
        gluten: gluten.value ? 1 : 0,
        lactosa: lactosa.value ? 1 : 0,
        crustacis: crustacis.value ? 1 : 0
    };

    // Solo para verificación:
    
    const imageInput = document.querySelector('input[type="file"]');
    await callPostProduct(formData,imageInput.files[0] );
    router.push({ path: '/products' });
}

};
</script>
