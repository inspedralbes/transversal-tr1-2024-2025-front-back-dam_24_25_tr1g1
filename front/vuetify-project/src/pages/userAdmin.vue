<template>
    <v-container>
        <div class="title-with-button">
            <h1>Usuaris</h1>
            <v-btn class="ml-4" color="primary" @click="showStats">
                Veure estadistiques
            </v-btn>
        </div>
        <v-list >
            <v-list-item v-for="user in users" :key="user.id" class="container">
                <v-row align="center" justify="space-between" class="w-100">
                    <v-col>
                        <v-list-item-content>
                            <v-list-item-title>{{ user.nom }}</v-list-item-title>
                            <v-list-item-subtitle>{{ user.correu }}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-col>
                    <v-col class="d-flex justify-center align-center">
                        <v-row>

                        </v-row>
                        <v-row align="center">
                            <v-checkbox
                                v-model="user.adminBoolean"
                                @change="toggleAdmin(user)"
                                label="Admin"
                            ></v-checkbox>
                        </v-row>
                       
                    </v-col>
                    <v-col class="d-flex justify-end">
                        <v-list-item-action>
                            
                            <v-btn icon :to="'/showCommands/'+user.id">
                                <v-icon>mdi-cart</v-icon>
                            </v-btn>

                            <v-btn icon @click="confirmDeleteUser(user.id)">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </v-list-item-action>
                    </v-col>
                </v-row>
            </v-list-item>
        </v-list>
        <v-dialog v-model="isModalVisible" max-width="800px">
            <v-card>
                <v-card-title>
                    <span class="headline">Estadísticas de Clientes</span>
                </v-card-title>
                <v-card-text>
                    <!-- Mostrar la imagen en el modal -->
                    <img :src="statsImageUrl" alt="Estadísticas de Clientes" class="full-width" />
                </v-card-text>
                <v-card-actions>
                    <v-btn color="blue darken-1" text @click="isModalVisible = false">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-container>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { callGetUsers, callDeleteUser, callPutUser } from '../services/communicationManager.js';

let users = ref([]);
let statsImageUrl = ref(null); // La URL de la imagen del gráfico
let isModalVisible = ref(false); 

onMounted(async () => {
    const fetchedUsers = await callGetUsers();
    users.value = fetchedUsers.map(user => ({
        ...user,
        adminBoolean: Boolean(user.admin) 
    }));
});

const showStats = async () => {
    try {
        const response = await fetch("http://localhost:26968/generate-client-stats");
        const data = await response.json();
        
        // Si la URL de la imagen está disponible, abrirla en el modal
        if (data.imageUrl) {
            statsImageUrl.value = data.imageUrl;
            isModalVisible.value = true; // Mostrar el modal
        } else {
            console.error("No se obtuvo la URL de la imagen");
        }
    } catch (error) {
        console.error("Error al obtener las estadísticas:", error);
    }
};

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
.title-with-button {
    display: flex;
    align-items: center;
}
.stats-image-container {
    margin-top: 20px;
    text-align: center;
}
li {
    list-style-type: circle;
    display: flex;
    align-items: center;
}
.user-item {
    position: relative;
    padding-left: 20px;
}
.container:nth-child(odd) {
    background-color: #f2f2f2;

}
.container:nth-child(even) {
    background-color: #f9f9f9;
}
.full-width {
    width: 100%;
    height: auto;
    max-width: 100%;
}
</style>
