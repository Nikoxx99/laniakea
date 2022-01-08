<template>
  <v-app class="stars-gradient">
    <v-main>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-main>
    <!-- <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }} Laniakea Video Sync | All rights reserved</span>
    </v-footer> -->
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        }
      ],
      miniVariant: true,
      right: true,
      rightDrawer: false,
      title: 'Laniakea'
    }
  }
}
</script>
<style>
  body {
    background-color:#000;
  }
  .theme--dark.v-card {
    background-color: #000000;
    color: #FFFFFF;
  }
  .stars-gradient {
    background: rgb(0,0,0);
    background: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(6,0,85,1) 100%)!important;
  }
</style>
