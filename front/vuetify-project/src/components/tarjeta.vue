<template>
<v-card>
              <v-img :src="apiUrl+'/' + product.fotoRuta" alt="Product Image" />
              <v-card-title>{{ product.nom }}</v-card-title>
              <v-card-text>{{ product.descripcio }}</v-card-text>
              <v-card-text>Preu original {{ product.preu.toFixed(2) }} €</v-card-text>
              <v-card-text v-if="product.oferta">Preu ofertat {{ product.oferta.toFixed(2) }} €</v-card-text>
              <v-card-text>Stock {{ product.stock }}</v-card-text>
              <div class="grid">
                <v-img src="../assets/halal.png" v-if="product.halal==1"></v-img>
                <v-img src="../assets/vegan.png" v-if="product.vegan==1"></v-img>
                <v-img src="../assets/gluten.png" v-if="product.gluten==1"></v-img>
                <v-img src="../assets/lactosa.png" v-if="product.lactosa==1"></v-img>
                <v-img src="../assets/crustacis.png" v-if="product.crustacais==1"></v-img>
              </div>
              <v-card-actions>
                <v-btn color="primary" :to="'/editProduct/'+product.id">Edit</v-btn>
                <v-btn color="error" @click="eraseProduct()">Delete</v-btn>
              </v-card-actions>
            </v-card>
</template>
<script>
import {callDeleteProduct} from '../../communicationManager.js'
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
        }
    },
    methods: {
      async eraseProduct() {
       await callDeleteProduct(this.product.id)
      }
    }
    
}
</script>
<style scoped>

li {
  list-style-type: none;
}
.grid{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}
</style>