<template>
    <v-container>
        <v-form @submit.prevent="handleSubmit">
            <v-text-field label="Nom del Usuari" v-model="user.nom" required></v-text-field>
            <v-text-field label="Correu Electrònic" v-model="user.correu" required></v-text-field>
            <v-text-field label="Contrasenya" v-model="user.contrasenya" required></v-text-field>
            <v-checkbox label="Admin" v-model="user.admin" :true-value="1" :false-value="0"></v-checkbox>
            <v-checkbox label="Halal" v-model="user.halal" :true-value="1" :false-value="0"></v-checkbox>
            <v-checkbox label="Vegà" v-model="user.vegan" :true-value="1" :false-value="0"></v-checkbox>
            <v-checkbox label="Conté Gluten" v-model="user.gluten" :true-value="1" :false-value="0"></v-checkbox>
            <v-checkbox label="Conté Lactosa" v-model="user.lactosa" :true-value="1" :false-value="0"></v-checkbox>
            <v-checkbox label="Conté Crustacis" v-model="user.crustacais" :true-value="1" :false-value="0"></v-checkbox>
            <v-btn color="primary" type="submit">Guardar Cambios</v-btn>
        </v-form>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { callGetUserById, callPutUser } from '../../services/communicationManager.js';

const user = ref({
    nom: '',
    correu: '',
    contrasenya: '',
    admin: 0,
    halal: 0,
    vegan: 0,
    gluten: 0,
    lactosa: 0,
    crustacais: 0
}); // Inicializar con valores por defecto
const route = useRoute();
const router = useRouter();

onMounted(async () => {
    const id = parseInt(route.params.id); // Asegúrate de que el id sea un número
    const fetchedUser = await callGetUserById(id);

    // Asignar valores a user, asegurando que sean números para los checkboxes
    user.value.nom = fetchedUser.nom;
    user.value.correu = fetchedUser.correu;
    user.value.contrasenya = fetchedUser.contrasenya;
    user.value.admin = fetchedUser.admin === 1 ? 1 : 0; // Convertir a 1/0
    user.value.halal = fetchedUser.halal === 1 ? 1 : 0; // Convertir a 1/0
    user.value.vegan = fetchedUser.vegan === 1 ? 1 : 0; // Convertir a 1/0
    user.value.gluten = fetchedUser.gluten === 1 ? 1 : 0; // Convertir a 1/0
    user.value.lactosa = fetchedUser.lactosa === 1 ? 1 : 0; // Convertir a 1/0
    user.value.crustacais = fetchedUser.crustacais === 1 ? 1 : 0; // Convertir a 1/0
});

// Función para manejar la actualización del usuario
async function handleSubmit() {
    if (!user.value.nom || !user.value.correu || !user.value.contrasenya) {
        alert('Falten camps per omplir');
        return;
    }

    const updatedUser = {
    id: route.params.id, // Debe ser un número
    nom: user.value.nom,
    correu: user.value.correu,
    contrasenya: user.value.contrasenya,
    admin: user.value.admin ? 1 : 0,
    halal: user.value.halal ? 1 : 0,
    vegan: user.value.vegan ? 1 : 0,
    gluten: user.value.gluten ? 1 : 0,
    lactosa: user.value.lactosa ? 1 : 0,
    crustacais: user.value.crustacais ? 1 : 0,
};

    // Llamada para actualizar el usuario
    await callPutUser(updatedUser);
    // Redireccionar a la lista de usuarios
    router.push({ path: '/users' });
}
</script>

<style scoped>
/* Aquí puedes añadir estilos específicos para tu componente */
</style>
