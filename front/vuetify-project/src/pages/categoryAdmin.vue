<template>
    <v-container>
        <h1>Categories</h1>
        <v-form @submit.prevent="addCategory">
            <v-row>
                <v-col cols="8">
                    <v-text-field v-model="newCategory" label="Nom de la categoria" required></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-btn type="submit" color="primary">Submit</v-btn>
                </v-col>
            </v-row>
        </v-form>
        <v-list>
            <v-list-item v-for="category in categories" :key="category.id">
                <v-row align="center" justify="space-between" class="w-100">
                    <v-col>
                        <v-list-item-content>
                            <v-list-item-title>{{ category.nom }}</v-list-item-title>
                        </v-list-item-content>
                    </v-col>
                    <v-col class="d-flex justify-end">
                        <v-list-item-action>
                            <v-btn icon :to="'/editCategory/'+category.id">
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            <v-btn icon @click="deleteCategory(category.id)">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </v-list-item-action>
                    </v-col>
                </v-row>
            </v-list-item>
        </v-list>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { callGetCategories, callPostCategory, callDeleteCategory } from '../services/communicationManager.js';

let categories = ref([]);
let newCategory = ref('');

onMounted(async () => {
    categories.value = await callGetCategories();
});

const addCategory = async() => {
    await callPostCategory(newCategory.value);
    categories.value=await callGetCategories()
    newCategory.value="";
};

const deleteCategory = async (id) => {
    let response=await callDeleteCategory(id)
    if(response=="no puedes"){
        alert("No pots eliminar una categoria amb productes associats")
    }
    categories.vaule=await callGetCategories()
};


</script>

<style scoped>
li {
    list-style-type: circle;
    display: flex;
    align-items: center;
}
.category-item {
    position: relative;
    padding-left: 20px;
}
</style>