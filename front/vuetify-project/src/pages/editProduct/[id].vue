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
            <v-file-input label="Imatge" variant="solo" accept="image/*"></v-file-input>
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
import { callGetCategories, callGetProductById, callPutProduct } from '../../services/communicationManager.js';
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
    async function handleSubmit() {
        if(product.value.nom==null || product.value.descripcio==null || product.value.preu==null || product.value.stock==null || product.value.category==null ){
            alert(`Falten camps per omplir`);
            return;
        } else {
            let dataAdapted = {
                id:route.params.id,
                nom: product.value.nom,
                descripcio: product.value.descripcio,
                preu: product.value.preu,
                oferta: product.value.oferta == 0 ? null : product.value.oferta,
                stock: product.value.stock,
                category: categoriesFull.value.filter(category => category.nom === product.value.category)[0].id,
                halal: product.value.halal?1:0,
                vegan: product.value.vegan?1:0,
                gluten: product.value.gluten?1:0,
                lactosa: product.value.lactosa?1:0,
                crustacis: product.value.crustacais?1:0
            };

        const imageInput = document.querySelector('input[type="file"]');
        await callPutProduct(dataAdapted,imageInput.files[0] );
        router.push({ path: '/products' });
        }
        
        // Add your form submission logic here, e.g., send data to an API
    };

</script>