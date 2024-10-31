<template>
    <v-container>
        <h1>Usuaris</h1>
        <v-list>
            <v-list-item v-for="user in users" :key="user.id">
                <v-row align="center" justify="space-between" class="w-100">
                    <v-col>
                        <v-list-item-content>
                            <v-list-item-title>{{ user.nom }}</v-list-item-title>
                            <v-list-item-subtitle>{{ user.correu }}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-col>
                    <v-col class="d-flex justify-end">
                        <v-list-item-action>
                            <v-checkbox
                                v-model="user.adminBoolean"
                                label="Admin"
                                @change="toggleAdmin(user)"
                            ></v-checkbox>

                            <v-btn icon @click="confirmDeleteUser(user.id)">
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
import { callGetUsers, callDeleteUser, callPutUser } from '../services/communicationManager.js';

let users = ref([]);

// Cargar usuarios al montar el componente y convertir admin a booleano
onMounted(async () => {
    const fetchedUsers = await callGetUsers();
    users.value = fetchedUsers.map(user => ({
        ...user,
        adminBoolean: Boolean(user.admin) 
    }));
});

// Función para confirmar y eliminar un usuario
const confirmDeleteUser = async (id) => {
    const confirmed = confirm("¿Estás seguro de que deseas eliminar este usuario?");
    if (confirmed) {
        try {
            await callDeleteUser(id);
            users.value = await callGetUsers();
        } catch (error) {
            alert("No se puede eliminar el usuario.");
        }
    }
};


const toggleAdmin = async (user) => {
    user.admin = user.adminBoolean ? 1 : 0; 
    console.log(`Updating admin status for user ${user.id}: ${user.admin}`); 
    try {
        await callPutUser(user); 
        alert("Estado de admin actualizado con éxito."); 
    } catch (error) {
        console.error(error); 
        alert("No se pudo actualizar el estado de admin del usuario.");
    }
};
</script>

<style scoped>
li {
    list-style-type: circle;
    display: flex;
    align-items: center;
}
.user-item {
    position: relative;
    padding-left: 20px;
}
</style>
