<template>
    <v-container>
        <h1>Comandes</h1>
        <v-list>
            <v-list-item v-for="comanda in comandes" :key="comanda.id">
                <v-row align="center" justify="space-between" class="w-100">
                    <v-col>
                        <v-list-item-content>
                            <v-list-item-title>ID: {{ comanda.id }}</v-list-item-title>
                            <v-list-item-subtitle>Data: {{ comanda.data }}</v-list-item-subtitle>
                            <v-list-item-subtitle>Contingut: {{ comanda.contingut }}</v-list-item-subtitle>
                            <v-list-item-subtitle>Estat: {{ comanda.estat }}</v-list-item-subtitle>
                            <v-list-item-subtitle>Client: {{ comanda.client }}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-col>
                    <v-col class="d-flex justify-end">
                        <v-btn 
                            @click="toggleEstat(comanda)" 
                            color="primary" 
                            :disabled="isFinalEstat(comanda.estat)"
                        >
                            Canviar Estat
                        </v-btn>
                    </v-col>
                </v-row>
            </v-list-item>
        </v-list>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { callGetComandes, callUpdateComandaStatus, callGetEstats } from '../services/communicationManager.js';
import { io } from 'socket.io-client';

const comandes = ref([]);
const estatOptions = ref([]);

// Conectar con el servidor Socket.IO
const socket = io('http://localhost:26968'); // Asegúrate de que esta URL sea correcta

// Cargar comandas y estados al montar el componente
onMounted(async () => {
    comandes.value = await callGetComandes();
    estatOptions.value = await callGetEstats(); // Obtener los estados de la base de datos

    // Escuchar el evento de actualización de comanda
    socket.on('comandaUpdated', (data) => {
        // Encontrar la comanda actualizada
        const comanda = comandes.value.find(c => c.id === data.id);
        if (comanda) {
            // Actualizar el estado de la comanda con la información recibida
            comanda.estat = data.estat;
            console.log(`Comanda con ID ${data.id} actualizada a estado: ${data.estat}`); // Registro para depuración
        }
    });
});

// Función para cambiar el estado de la comanda
const toggleEstat = async (comanda) => {
    if (!isFinalEstat(comanda.estat)) {
        const nextState = getNextEstat(comanda.estat);
        
        try {
            await callUpdateComandaStatus(comanda.id, nextState);
            // Enviar el evento de actualización a través de Socket.IO
            socket.emit('updateComanda', { id: comanda.id, estat: nextState }); // Emitir evento para que otros clientes lo reciban
        } catch (error) {
            console.error("Error al actualizar el estado en la base de datos:", error);
        }
    }
};

// Función auxiliar para obtener el próximo estado
const getNextEstat = (currentEstat) => {
    const currentIndex = estatOptions.value.indexOf(currentEstat);
    if (currentIndex === -1) return currentEstat; // Si no se encuentra, retornar el actual
    return estatOptions.value[(currentIndex + 1) % estatOptions.value.length];
};

const isFinalEstat = (estat) => {
    return estat === estatOptions.value[estatOptions.value.length - 1];
};

</script>

<style scoped>
li {
    list-style-type: circle;
    display: flex;
    align-items: center;
}
</style>
