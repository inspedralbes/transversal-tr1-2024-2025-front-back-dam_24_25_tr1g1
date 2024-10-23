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
import categoriesData from '../assets/categories.json';

let categories = ref([]);
let newCategory = ref('');

onMounted(() => {
    categories.value = categoriesData.categories;
});

const addCategory = () => {
    
};

const redirectEdit = (id) => {
    console.log(id);
};
const deleteCategory = (id) => {
    categories.value = categories.value.filter(category => category.id !== id);
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