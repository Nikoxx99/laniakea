<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <div class="text-center">
        <logo />
        <vuetify-logo />
      </div>
      <v-card>
        <v-card-title class="headline">
          {{ $t('index.welcome') }}
        </v-card-title>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>

export default {
  mounted () {
    const ws = new WebSocket('ws://localhost:8082')
    console.log(ws)
  }
}
</script>
