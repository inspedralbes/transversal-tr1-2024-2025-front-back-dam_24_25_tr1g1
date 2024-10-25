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
                v-model="imatge"
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
import { callPostProduct, callGetCategories } from '../../communicationManager.js';
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
const imatge = ref(null);
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
    const formData = new FormData();

    formData.append('nom', productName.value);
    formData.append('descripcio', descripció.value);
    formData.append('preu', price.value);
    formData.append('oferta', offerPrice.value || null);
    formData.append('stock', stock.value);
    formData.append('category', categoriesFull.value.find(category => category.nom === valueToSend.value).id);
    formData.append('halal', halal.value ? 1 : 0);
    formData.append('vegan', vegà.value ? 1 : 0);
    formData.append('gluten', gluten.value ? 1 : 0);
    formData.append('lactosa', lactosa.value ? 1 : 0);
    formData.append('crustacis', crustacis.value ? 1 : 0);
    formData.append('imatge', imatge.value);

    // Solo para verificación:
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }

    await callPostProduct(formData);
};
</script>
