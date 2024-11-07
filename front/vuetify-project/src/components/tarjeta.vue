<template>
  <v-card class="card">
    <v-img :src="apiUrl + '/' + product.fotoRuta" alt="Product Image" class="image" />
    <v-card-title>{{ product.nom }}</v-card-title>
    <v-card-text>{{ product.descripcio }}</v-card-text>
    <v-card-text>Preu original {{ product.preu.toFixed(2) }} €</v-card-text>
    <v-card-text v-if="product.oferta">Preu ofertat {{ product.oferta.toFixed(2) }} €</v-card-text>
    <v-card-text>Stock {{ product.stock }}</v-card-text>
    <div class="grid">
      <v-img src="../assets/halal.png" :class="{ faded: product.halal === 0 }"></v-img>
      <v-img src="../assets/vegan.png" :class="{ faded: product.vegan === 0 }"></v-img>
      <v-img src="../assets/gluten.png" :class="{ faded: product.gluten === 0 }"></v-img>
      <v-img src="../assets/lactosa.png" :class="{ faded: product.lactosa === 0 }"></v-img>
      <v-img src="../assets/crustacis.png" :class="{ faded: product.crustacis === 0 }"></v-img>
    </div>
    <v-card-actions class="./buttonBar">
      <v-btn color="primary" :to="'/editProduct/' + product.id">Edit</v-btn>
      <v-btn color="red" @click="confirmEraseProduct">Eliminar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { callDeleteProduct } from '../services/communicationManager.js';

export default {
  name: 'Tarjeta',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      apiUrl: import.meta.env.VITE_API_BACK
    };
  },
  methods: {
    // Confirmación antes de borrar el producto
    confirmEraseProduct() {
      const confirmed = confirm("¿Estás seguro de que deseas eliminar este producto?");
      if (confirmed) {
        this.eraseProduct(); // Si el usuario confirma, llama a la función para eliminar
      }
    },
    async eraseProduct() {
      await callDeleteProduct(this.product.id); // Llama al endpoint de eliminación
      // Emitimos el evento para actualizar la lista en el componente padre
      this.$emit('productDeleted', this.product.id);
    }
}
};
</script>

<style scoped>
.card{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}
.buttonBar {
  display: flex;
  justify-content: space-between;
  align-self: center;
}
.image{
  height: 10%;
  object-fit: cover;
}
.faded{
  filter: grayscale(100%);
  opacity: 0.5;
}
</style>
