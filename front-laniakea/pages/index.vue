<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card>
        <v-alert
          v-if="error.status"
          dense
          type="error"
        >
          {{error.message}}
        </v-alert>
        <v-card-title class="headline justify-center">
          <h1 class="text-center">
            {{ $t('index.welcome') }}
          </h1>
        </v-card-title>
        <v-card-text class="text-center">
          <h3>
            {{ $t('index.nameSelector') }}
          </h3>
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
          <h3>
            {{ $t('index.subtitle') }}
          </h3>
        </v-card-text>
        <v-card-text class="text-center">
          <v-btn
            v-model="user.isHost"
            elevation="2"
            color="red darken-4"
            large
            x-large
            @click="switchToRoleHost()"
          >
            {{ $t('index.btnHost') }}
          </v-btn>
          <v-btn
            v-model="user.isParticipant"
            elevation="2"
            color="blue darken-4"
            large
            x-large
            @click="switchToRoleParticipant()"
          >
            {{ $t('index.btnParticipant') }}
          </v-btn>
        </v-card-text>
      </v-card>
      <MainHost
        v-if="user.isHost"
        :username="user.name"
      />
      <MainParticipant
        v-if="user.isParticipant"
        :username="user.name"
      />
    </v-col>
  </v-row>
</template>

<script>

export default {
  data () {
    return {
      error: {
        status: false,
        message: ''
      },
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
  },
  methods: {
    switchToRoleHost () {
      this.error.status = false
      this.error.message = ''
      if (this.user.name) {
        this.user.isHost = true
        this.user.isParticipant = false
      } else {
        this.error.status = true
        this.error.message = this.$t('error.index.usernameNotDefined')
      }
    },
    switchToRoleParticipant () {
      this.error.status = false
      this.error.message = ''
      if (this.user.name) {
        this.user.isHost = false
        this.user.isParticipant = true
      } else {
        this.error.status = true
        this.error.message = this.$t('error.index.usernameNotDefined')
      }
    }
  }
}
</script>
