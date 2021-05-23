<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card>
        <v-card-title class="headline justify-center">
          <h1 class="text-center">{{ $t('index.welcome') }}</h1>
        </v-card-title>
        <v-card-text class="text-center">
          <h3>{{ $t('index.nameSelector') }}</h3>
        </v-card-text>
        <v-card-text class="text-center">
          <v-text-field
            v-model="user.name"
            style="max-width:50%;margin-left:auto;margin-right:auto;"
            class="justify-self-center"
            :label="$t('index.nameSelectorLabel')"
            hide-details
            outlined
          />
        </v-card-text>
        <v-card-text class="text-center">
          <h3>{{ $t('index.subtitle') }}</h3>
        </v-card-text>
        <v-card-text class="text-center">
          <v-btn
            v-model="user.isHost"
            elevation="2"
            color="red darken-4"
            large
            x-large
          >
          {{ $t('index.btnHost') }}
          </v-btn>
          <v-btn
            v-model="user.isParticipant"
            elevation="2"
            color="blue darken-4"
            large
            x-large
          >
          {{ $t('index.btnParticipant') }}
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>

export default {
  data () {
    return {
      user: {
        name: '',
        isHost: false,
        isParticipant: false
      }
    }
  },
  mounted () {
    const ws = new WebSocket('ws://localhost:8082')
    ws.addEventListener('open', () => {
      console.log('Connected')

      ws.send('Wasapppppp')
    })
    ws.addEventListener('message', (e) => {
      console.log(e)
    })
  }
}
</script>
