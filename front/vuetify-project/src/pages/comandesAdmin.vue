<template>
    <v-container>
        <h1>Comandes</h1>
        <v-list>
            <v-list-item v-for="comanda in comandes" :key="comanda.id">
                <v-row align="center" justify="space-between" class="w-100" :class="{ cancel: comanda.cancel === 1 }">
                    <v-col >
                        <v-list-item-content >
                            <v-list-item-title>ID: {{ comanda.id }}</v-list-item-title>
                            <v-list-item-subtitle>Data: {{ comanda.data }}</v-list-item-subtitle>
                        
                            <v-dialog max-width="500">
  <template v-slot:activator="{ props: activatorProps }">
    <v-btn
      v-bind="activatorProps"
      color="surface-variant"
      text="Contingut de la comanda"
      variant="flat"
    ></v-btn>
  </template>

  <template v-slot:default="{ isActive }">
    <v-card :title="'Contingut de la comanda '+comanda.id">
      <v-card-text>
        <ul>
            <li v-for="element in JSON.parse(comanda.contingut)"> 
                {{element.nom}} x  {{element.quantitat}}  = {{element.preuTotal}}€
            </li>
        </ul>
        <p>Total: {{ calcularTotal(comanda.contingut)}}€</p>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          text="tancar dialeg"
          @click="isActive.value = false"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </template>
</v-dialog>
                            <v-list-item-subtitle>Estat: {{ comanda.estat }}</v-list-item-subtitle>
                            <v-list-item-subtitle>Client: {{ comanda.client }}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-col>
                    <v-col class="d-flex justify-end">
                        <v-btn class="mx-10"  
                            @click="toggleEstatBefore(comanda)" 
                            color="primary" 
                            :disabled="isFirstEstat(comanda.estat)||comanda.cancel === 1 || comanda.estat === 'Recollit'"
                        >
                            Retrocedir Comanda
                        </v-btn>
                        <br>
                        <v-btn class="mx-10" 
                            @click="toggleEstatNext(comanda)" 
                            color="primary" 
                            :disabled="isFinalEstat(comanda.estat) || comanda.cancel === 1 || comanda.estat === 'Recollit'"
                        >
                            Continuar Comanda
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
import socket from '@/services/socket.js';

const comandes = ref([]);
const estatOptions = ref([]);



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
const toggleEstatNext = async (comanda) => {
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

// Función para cambiar el estado de la comanda
const toggleEstatBefore = async (comanda) => {
    if (!isFinalEstat(comanda.estat)) {
        const beforeState = getPrevEstat(comanda.estat);
        
        try {
            await callUpdateComandaStatus(comanda.id, beforeState);
            // Enviar el evento de actualización a través de Socket.IO
            socket.emit('updateComanda', { id: comanda.id, estat: beforeState }); // Emitir evento para que otros clientes lo reciban
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

// Función auxiliar para obtener el estado anterior
const getPrevEstat = (currentEstat) => {
        const currentIndex = estatOptions.value.indexOf(currentEstat);
        if (currentIndex === -1) return currentEstat; // Si no se encuentra, retornar el actual
        return estatOptions.value[(currentIndex - 1 + estatOptions.value.length) % estatOptions.value.length];
    };

const isFinalEstat = (estat) => {
    return estat === estatOptions.value[estatOptions.value.length - 1];
};

const isFirstEstat = (estat) => {
    return estat === estatOptions.value[0];
};

const calcularTotal = (contingut) => {
    let total = 0;
    JSON.parse(contingut).forEach(element => {
        total += element.preuTotal;
    });
    return total;
};

</script>

<style scoped>
li {
    list-style-type: circle;
    display: flex;
    align-items: center;
}
.cancel {
    opacity: 50%;
    background-color: rgb(190, 67, 67);

    border-radius: 10px;
    margin: 0;
}
</style>
