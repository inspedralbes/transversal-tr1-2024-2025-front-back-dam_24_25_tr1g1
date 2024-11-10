<template>
    <v-app-bar app>
        <v-toolbar-title>Grill&Grab</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn to="/products">Gestió de productes</v-btn>
        <v-btn to="/categoryAdmin">Gestió de categories</v-btn>
        <v-btn to="/userAdmin">Gestió d'usuaris</v-btn>
        <v-btn to="/comandesAdmin">Gestió de comandes</v-btn>
    </v-app-bar>
</template>

<script>


export default {
    name: 'NavBar',
};
</script>

<style scoped>
</style>