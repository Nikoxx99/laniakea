<template>
  <v-card :class="started ? '' : 'mt-5'">
    <v-card-title v-if="!started">
      <v-alert
        text
        dense
        color="teal"
        icon="mdi-check"
        border="left"
      >
        <h3>
          {{ $t('host.title') }} <strong>{{ username }}</strong>
        </h3>
      </v-alert>
      <v-spacer />
      <v-btn
        color="red darken-1"
        class="ma-2 white--text"
        @click="$emit('changeRole')"
      >
        {{ $t('session.switchRoleBtn') }}
        <v-icon
          right
        >
          mdi-close
        </v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text v-if="!started">
      <p>
        {{ $t('host.info') }}
      </p>
    </v-card-text>
    <v-card-text v-if="!started">
      <v-file-input
        v-model="video"
        color="deep-purple accent-4"
        counter
        :label="$t('host.fileInputTitle')"
        :placeholder="$t('host.fileInputPlaceholder')"
        prepend-icon="mdi-paperclip"
        outlined
        :show-size="1000"
        @change="generateUniqueId()"
      >
        <template #selection="{ text }">
          <v-chip
            color="deep-purple accent-4"
            dark
            label
            small
          >
            {{ text }}
          </v-chip>
        </template>
      </v-file-input>
    </v-card-text>
    <v-card-text v-if="!started">
      <v-btn
        v-model="initialized"
        elevation="2"
        :color="started ? 'green darken-4' : 'deep-purple accent-4'"
        large
        x-large
        block
        @click="beginSession()"
      >
        {{ started ? $t('host.btnBeginStarted') : $t('host.btnBegin') }}
      </v-btn>
    </v-card-text>
    <v-card-text v-if="!started" class="text-center">
      <h2 class="white--text accent-4 mb-4 pl-4">
        {{ $t('host.codeTitle') }} <strong class="deep-purple--text">{{ uniqueid }}</strong>
      </h2>
    </v-card-text>
    <v-card-text v-if="started" class="text-left px-0 pb-0 d-flex" style="height:100vh">
      <video
        ref="video"
        style="width:85%;min-width:300px;"
        :src="blobUrl"
        controls
        @play="sendWS('play',)"
        @pause="sendWS('pause')"
        @seeking="sendWS('seekTo', $event.target.currentTime)"
      />
      <MainChat
        :uniqueid="uniqueid"
        :chatMessages="chatMessages"
        @newChatMessage="sendWS('chat', $event, username)"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import { nanoid } from 'nanoid'
import { io } from 'socket.io-client'
export default {
  props: {
    username: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      video: null,
      initialized: false,
      started: false,
      uniqueid: '',
      blobUrl: '',
      time: 0,
      ws: null,
      socket: null,
      chatMessages: []
    }
  },
  watch: {
    time (time) {
      if (Math.abs(time - this.$refs.video.currentTime) > 0.5) {
        this.$refs.video.currentTime = time
      }
      this.ws.send(this.time)
    }
  },
  methods: {
    sendWS (type, payload, user) {
      const msg = {
        type: null,
        payload: null,
        user: null,
        date: Date.now()
      }
      msg.type = type
      msg.payload = payload
      msg.user = user
      this.socket.emit(type, JSON.stringify(msg))
    },
    beginSession () {
      /* The env dep is already installed. Use it to change the local ws URI */
      this.started = true
      this.socket = io(process.env.wsURI)
      this.socket.emit('joinRoom', this.uniqueid)
      this.socket.on('join', (data) => {
        const action = JSON.parse(data)
        this.chatMessages.unshift(action)
      })
      this.socket.on('message', (data) => {
        const action = JSON.parse(data)
        switch (action.type) {
          case 'chat':
            this.chatMessages.unshift(action)
            break
          case 'info':
            break
        }
      })
      this.sendWS('info', 'Video iniciado')
      this.blobUrl = window.URL.createObjectURL(this.video)
    },
    generateUniqueId () {
      this.uniqueid = nanoid()
    }
  }
}
</script>
