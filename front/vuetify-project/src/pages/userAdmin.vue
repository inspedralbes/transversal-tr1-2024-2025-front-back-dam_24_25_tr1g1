<template>
    <v-container>
        <h1>Users</h1>
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
                            <!-- Botón para editar el usuario -->
                            <v-btn icon :to="'/editUser/' + user.id">
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            <!-- Botón para eliminar el usuario -->
                            <v-btn icon @click="deleteUser(user.id)">
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
import { callGetUsers, callPutUser, callDeleteUser } from '../services/communicationManager.js';

let users = ref([]);

// Cargar usuarios al montar el componente
onMounted(async () => {
    users.value = await callGetUsers();
});

// Función para eliminar un usuario
const deleteUser = async (id) => {
    try {
        await callDeleteUser(id);
        // Actualizar la lista de usuarios después de la eliminación
        users.value = await callGetUsers();
    } catch (error) {
        alert("No se puede eliminar el usuario.");
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
