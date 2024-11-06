<template>
    <v-container>
        <h1>Comandes usuari</h1>
        <v-list>
            <v-list-item v-for="comanda in userComandes" :key="comanda.id">
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
import { useRoute } from 'vue-router';
import { callGetComandes, callUpdateComandaStatus, callGetEstats } from '../../services/communicationManager.js';
import { io } from 'socket.io-client';

const comandes = ref([]);
const userComandes = ref([]);
const estatOptions = ref([]);

const socket = io('http://localhost:26968');

const route = useRoute();
const userId = route.params.id;

onMounted(async () => {
    comandes.value = await callGetComandes();
    estatOptions.value = await callGetEstats(); 

    userComandes.value = comandes.value.filter(comanda => Number(comanda.client) === Number(userId));

    socket.on('comandaUpdated', (data) => {
        const comanda = userComandes.value.find(c => c.id === data.id);
        if (comanda) {
            comanda.estat = data.estat;
            console.log(`Comanda con ID ${data.id} actualizada a estado: ${data.estat}`);
        }
    });
});

const toggleEstat = async (comanda) => {
    if (!isFinalEstat(comanda.estat)) {
        const nextState = getNextEstat(comanda.estat);
        
        try {
            await callUpdateComandaStatus(comanda.id, nextState);
            socket.emit('updateComanda', { id: comanda.id, estat: nextState });
        } catch (error) {
            console.error("Error al actualizar el estado en la base de datos:", error);
        }
    }
};

const getNextEstat = (currentEstat) => {
    const currentIndex = estatOptions.value.indexOf(currentEstat);
    if (currentIndex === -1) return currentEstat;
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
