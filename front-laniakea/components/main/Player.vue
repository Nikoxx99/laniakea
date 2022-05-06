<template>
  <div>
    <v-card v-if="!started" :class="started ? '' : 'mt-5 mx-auto pa-3'" max-width="674" color="rgba(5,5,5,0)" elevation="0">
      <v-alert
        text
        dense
        color="teal"
        icon="mdi-check"
        border="left"
      >
        <h3>
          {{ role === 'host' ? $t('host.title') : $t('participant.title') }} <strong>{{ username }}</strong>
        </h3>
      </v-alert>
      <v-card-text>
        <v-text-field
          v-if="role === 'participant'"
          v-model="uniqueid"
          class="justify-self-center"
          :label="$t('participant.uniqueIdSelectorLabel')"
          hide-details
          outlined
          prepend-icon="mdi-fingerprint"
        />
      </v-card-text>
      <v-card-text>
        <v-file-input
          v-model="video"
          color="deep-purple accent-4"
          counter
          :label="role === 'host' ? $t('host.fileInputTitle') : $t('participant.fileInputTitle')"
          :placeholder="role === 'host' ? $t('host.fileInputPlaceholder') : $t('participant.fileInputPlaceholder')"
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
      <v-card-text>
        <v-btn
          v-model="initialized"
          elevation="0"
          :color="started ? 'green darken-4' : 'deep-purple accent-4'"
          large
          rounded
          x-large
          block
          @click="beginSession()"
        >
          <v-icon>mdi-broadcast</v-icon> {{ started ? role === 'host' ? $t('host.btnBeginStarted') : $t('participant.btnBeginStarted') : role === 'host' ? $t('host.btnBegin') : $t('participant.btnBegin') }}
        </v-btn>
      </v-card-text>
      <v-card-text class="d-flex justify-center">
        <v-btn
          color="red darken-1"
          class="ma-2 white--text"
          rounded
          elevation="0"
          @click="$emit('changeRole')"
        >
          {{ $t('session.switchRoleBtn') }}
          <v-icon
            right
          >
            mdi-account-arrow-left-outline
          </v-icon>
        </v-btn>
      </v-card-text>
    </v-card>
    <v-card>
      <v-card-text v-if="started" class="text-left px-0 pb-0 d-flex" style="height:100vh">
        <div
          id="container"
          style="width:100%;min-width:300px;"
        >
          <vue-plyr ref="plyr" :options="role === 'host' ? optionsHost : optionsParticipant">
            <video
              ref="video"
              playsinline
              :controls="false"
              :clickToPlay="role === 'host' ? true : false"
              style="--plyr-color-main: #9c27b0;"
              :current-time.prop="role === 'participant' ? time : null"
              :src="blobUrl"
              @play="role === 'host' ? sendWS('play') : null"
              @pause="role === 'host' ? sendWS('pause') : null"
              @seeking="role === 'host' ? sendWS('seekTo', $event.target.currentTime) : null"
            />
          </vue-plyr>
          <MainChat
            :uniqueid="uniqueid"
            :chatmessages="chatMessages"
            :onlineusers="onlineUsers"
            :role="role"
            @closeSession="closeSession()"
            @newChatMessage="sendWS('chat', $event, username)"
            @updateVideoFile="updateVideoFile($event)"
          />
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { nanoid } from 'nanoid'
const ping = 'ping'
export default {
  name: 'Player',
  props: {
    role: {
      type: String,
      default: null
    },
    username: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      optionsHost: {
        controls: ['play', 'progress', 'current-time', 'duration', 'mute', 'volume', 'airplay', 'fullscreen'],
        fullscreen: {
          enabled: true,
          container: '#container'
        },
        clickToPlay: false
      },
      optionsParticipant: {
        controls: ['current-time', 'duration', 'mute', 'volume', 'airplay', 'fullscreen'],
        fullscreen: {
          enabled: true,
          container: '#container'
        },
        clickToPlay: false,
        keyboard: false
      },
      video: null,
      initialized: false,
      started: false,
      uniqueid: '',
      blobUrl: '',
      time: 0,
      ws: null,
      socket: null,
      chatMessages: [],
      onlineUsers: []
    }
  },
  computed: {
    hasFocus () {
      return document.hasFocus()
    }
  },
  mounted () {
    window.addEventListener('beforeunload', this.closeSession)
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
      if (this.role === 'host') { this.generateUniqueId() }

      this.started = true
      this.$emit('runningSession', true)

      this.socket = this.$createSocket({
        auth: this.$store.state.auth,
        query: {
          test: 'test'
        }
      })
      this.socket.emit('joinRoom', this.uniqueid)
      // this.sendWS('join', { message: this.username + ' ' + this.$t('session.newParticipant') }, 'Info')

      // this.socket.on('join', (data) => {
      //   const action = JSON.parse(data)
      //   this.chatMessages.unshift(action)
      // })
      // this.socket.on('newMember', (data) => {
      //   this.onlineUsers = data
      // })
      // this.socket.on('disc', (data) => {
      //   this.chatMessages.unshift({ payload: data + this.$t('session.participantLeft'), type: 'chat', user: 'Info' })
      // })
      // this.socket.on('play', () => {
      //   if (this.role === 'participant') {
      //     this.$refs.video.play()
      //   }
      // })
      // this.socket.on('pause', () => {
      //   if (this.role === 'participant') {
      //     this.$refs.video.pause()
      //   }
      // })
      // this.socket.on('seekTo', (timeData) => {
      //   if (this.role === 'participant') {
      //     const time = JSON.parse(timeData)
      //     this.time = time.payload
      //   }
      // })
      this.chatMessages.unshift({ payload: { message: this.$t('session.welcome') + this.username }, type: 'chat', user: 'Info' })
      this.socket.on('message', (data) => {
        const action = JSON.parse(data)
        switch (action.type) {
          case 'chat':
            this.chatMessages.unshift(action)
            if (document.hidden) {
              ping.play()
            } else if (!this.hasFocus) {
              ping.play()
            }
            break
          case 'info':
            break
        }
      })
      this.sendWS('info', 'Video iniciado')
      this.blobUrl = window.URL.createObjectURL(this.video)
    },
    updateVideoFile (file) {
      this.blobUrl = ''
      this.video = file
      if (this.video) {
        this.blobUrl = window.URL.createObjectURL(file)
        this.sendWS('info', 'Video actualizado')
      }
    },
    closeSession () {
      this.$emit('runningSession', false)
      this.sendWS('bye', { message: this.username + ' ' + this.$t('session.participantLeft') }, 'Info')
      this.socket.disconnect()
      this.started = false
      this.initialized = false
      this.uniqueid = ''
      this.blobUrl = ''
      this.time = 0
    },
    generateUniqueId () {
      this.uniqueid = nanoid(6)
    }
  }
}
</script>
<style>

</style>
