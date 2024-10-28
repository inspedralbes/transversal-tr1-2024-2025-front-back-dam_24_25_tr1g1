<template>
    <v-app-bar app>
        <v-toolbar-title>Grill&Grab</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn to="/products">Gestio de productes</v-btn>
        <v-btn to="/categoryAdmin">Gestio de categories</v-btn>
        <v-btn to="/userAdmin">Gestio d'usuaris</v-btn>
    </v-app-bar>
</template>

<script>


export default {
    name: 'NavBar',
};
</script>

<style scoped>
</style>