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
import { callGetComandes, callUpdateComandaStatus } from '../services/communicationManager.js';

const comandes = ref([]);

// Cargar comandas al montar el componente
onMounted(async () => {
    comandes.value = await callGetComandes();
});

// Función para cambiar el estado de la comanda
const toggleEstat = async (comanda) => {
    if (!isFinalEstat(comanda.estat)) {
        const nextState = getNextEstat(comanda.estat); 
        comanda.estat = nextState; 
        await callUpdateComandaStatus(comanda.id, nextState); 
    }
};

// Función auxiliar para obtener el próximo estado
const getNextEstat = (currentEstat) => {
    const estatSequence = ["En cuina", "Preparant", "Preparat per recollir", "Lliurat"];
    const currentIndex = estatSequence.indexOf(currentEstat);
    return estatSequence[(currentIndex + 1) % estatSequence.length];
};

// Función auxiliar para verificar si el estado es el final
const isFinalEstat = (estat) => {
    return estat === "Lliurat";
};
</script>


<style scoped>
li {
    list-style-type: circle;
    display: flex;
    align-items: center;
}
</style>
