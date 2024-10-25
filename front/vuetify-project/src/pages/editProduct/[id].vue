<template>
    <v-container>
        <v-form @submit.prevent="handleSubmit">
            <v-text-field label="Nom del producte" v-model="product.nom"></v-text-field>
            <v-text-field label="Descripció" v-model="product.descripcio" ></v-text-field>
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
            <v-select
            label="Category"
            :items="categories"
            v-model="product.category"
            ></v-select>
            <v-file-input label="Imatge" variant="solo"></v-file-input>
            <v-checkbox label="halal" v-model="product.halal"></v-checkbox>
            <v-checkbox label="vegà" v-model="product.vegan"></v-checkbox>
            <v-checkbox label="conté gluten" v-model="product.gluten"></v-checkbox>
            <v-checkbox label="conté lactosa" v-model="product.lactosa"></v-checkbox>
            <v-checkbox label="conté crustacis" v-model="product.crustacais"></v-checkbox>
            <v-btn color="primary" type="submit">Submit</v-btn>
            
        </v-form>
    </v-container>
</template>
<script setup>
import { callGetCategories, callGetProductById, callPutProduct } from '../../../communicationManager.js';
import { useRoute, useRouter } from 'vue-router';
import { ref,onMounted } from 'vue';
    const categoriesFull=ref([]);
    const product=ref({});
    const route = useRoute(); // Necesario para acceder a los parámetros de la ruta
    const router = useRouter();
    const categories = ref([]);

    onMounted(async() => {
        categoriesFull.value= await callGetCategories();
        let id=route.params.id;
        let auxArray=[];
        product.value=await callGetProductById(id);
        product.value.halal==1?product.value.halal=true:product.value.halal=false;
        product.value.vegan==1?product.value.vegan=true:product.value.vegan=false;
        product.value.gluten==1?product.value.gluten=true:product.value.gluten=false;
        product.value.lactosa==1?product.value.lactosa=true:product.value.lactosa=false;
        product.value.crustacais==1?product.value.crustacais=true:product.value.crustacais=false;
        product.value.oferta=product.value.oferta==null?0:product.value.oferta;
        
        
        categoriesFull.value.forEach(element => {
            auxArray.push(element.nom);
            console.log(element.nom);
        });

        categories.value = auxArray;
        categoriesFull.value.forEach(element => {
            if(element.id==product.value.category){
                product.value.category=element.nom;
            }
        });
        
        console.log("Montate en mi motora",categories.value);
    });
    function handleSubmit() {
        let dataAdapted  = new FormData();
        dataAdapted.append('nom', product.value.nom);
        dataAdapted.append('descripcio', product.value.descripcio);
        dataAdapted.append('preu', product.value.preu);
        product.value.oferta==0?product.value.oferta=null:product.value.oferta;
        dataAdapted.append('oferta', product.value.oferta);
        dataAdapted.append('stock', product.value.stock);
        product.value.category=categoriesFull.value.filter(category => category.nom === product.value.category)[0].id;
        dataAdapted.append('category', product.value.category);
        dataAdapted.append('halal', product.value.halal);
        dataAdapted.append('vegan', product.value.vegan);
        dataAdapted.append('gluten', product.value.gluten);
        dataAdapted.append('lactosa', product.value.lactosa);
        dataAdapted.append('crustacis', product.value.crustacais);
        dataAdapted.append('imatge', product.value.imatge);

        callPutProduct(dataAdapted);
        router.push({ path: '/products' });
        // Add your form submission logic here, e.g., send data to an API
    };

</script>