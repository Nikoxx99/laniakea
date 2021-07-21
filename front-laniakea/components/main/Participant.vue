<template>
  <v-card :class="initialized ? '' : 'mt-5'">
    <v-card-title
      v-if="!initialized"
    >
      <v-alert
        text
        dense
        color="teal"
        icon="mdi-check"
        border="left"
      >
        <h3>
          {{ $t('participant.title') }} <strong>{{ username }}</strong>
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
    <v-card-text v-if="!initialized">
      <p>
        {{ $t('participant.info') }}
      </p>
      <v-text-field
        v-model="session.uniqueid"
        style="max-width:50%;margin-left:auto;margin-right:auto;"
        class="justify-self-center"
        :label="$t('participant.uniqueIdSelectorLabel')"
        hide-details
        outlined
      />
    </v-card-text>
    <v-card-text
      v-if="!initialized"
    >
      <v-file-input
        v-model="video"
        color="deep-purple accent-4"
        counter
        :label="$t('participant.fileInputTitle')"
        :placeholder="$t('participant.fileInputPlaceholder')"
        prepend-icon="mdi-paperclip"
        outlined
        :show-size="1000"
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
    <v-card-text v-if="!initialized">
      <v-btn
        v-model="initialized"
        elevation="2"
        :color="initialized ? 'green darken-4' : 'deep-purple accent-4'"
        large
        x-large
        block
        @click="joinSession()"
      >
        {{ initialized ? $t('participant.btnBeginStarted') : $t('participant.btnBegin') }}
      </v-btn>
    </v-card-text>
    <v-card-text
      v-if="initialized"
      class="text-left px-0 pb-0 d-flex"
      style="height:100vh"
    >
      <div
        style="width:85%;min-width:300px;"
      >
        <vue-plyr :options="options">
          <video
            ref="video"
            style="--plyr-color-main: #9c27b0;"
            :current-time.prop="time"
          >
            <source
              :src="blobUrl"
              type="video/mp4"
            >
          </video>
        </vue-plyr>
      </div>
      <MainChat
        :uniqueid="session.uniqueid"
        :chatMessages="chatMessages"
        @closeSession="closeSession()"
        @newChatMessage="sendWS('chat', $event, username)"
      />
    </v-card-text>
  </v-card>
</template>

<script>
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
      time: null,
      session: {
        uniqueid: null
      },
      blobUrl: null,
      chatMessages: [],
      socket: null,
      options: {
        controls: ['current-time', 'volume', 'fullscreen']
      }
    }
  },
  methods: {
    joinSession () {
      this.initialized = true
      this.socket = io(process.env.wsURI)
      this.socket.emit('joinRoom', this.session.uniqueid)
      this.sendWS('join', this.username + ' ' + this.$t('session.newParticipant'), 'Info')
      this.socket.on('play', () => {
        this.$refs.video.play()
      })
      this.socket.on('pause', () => {
        this.$refs.video.pause()
      })
      this.socket.on('seekTo', (timeData) => {
        const time = JSON.parse(timeData)
        this.time = time.payload
      })
      this.socket.on('message', (data) => {
        const action = JSON.parse(data)
        this.chatMessages.unshift(action)
      })
      this.blobUrl = window.URL.createObjectURL(this.video)
    },
    closeSession () {
      this.sendWS('bye', this.username + ' ' + this.$t('session.participantLeft'), 'Info')
      this.socket.disconnect()
      this.started = false
      this.initialized = false
      this.uniqueid = ''
      this.blobUrl = ''
      this.time = 0
    },
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
    }
  }
}
</script>

<style scoped>
  audio::-webkit-media-controls-timeline,
  video::-webkit-media-controls-play-button,
  video::-webkit-media-controls-timeline {
      display: none;
  }
  .plyr__progress,
  button[aria-label="Play"]{
    display: none !important;
  }
</style>
