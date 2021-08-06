<template>
  <div>
    <v-img
      src="bg1.jpg"
      style="width:100%!important;height:100vh!important;background-position:bottom!important"
    >
      <v-card v-if="!started" :class="started ? '' : 'mt-5 mx-auto pa-3'" max-width="674" color="rgba(5,5,5,0.6)">
        <v-card-title>
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
          <v-spacer />
          <v-btn
            color="red darken-1"
            class="ma-2 white--text"
            tile
            @click="$emit('changeRole')"
          >
            {{ $t('session.switchRoleBtn') }}
            <v-icon
              right
            >
              mdi-account-arrow-left-outline
            </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <p>
            {{ role === 'host' ? $t('host.info') : $t('participant.info') }}
          </p>
          <v-text-field
            v-if="role === 'participant'"
            v-model="uniqueid"
            class="justify-self-center"
            :label="$t('participant.uniqueIdSelectorLabel')"
            hide-details
            outlined
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
            @change="role === 'host' ? generateUniqueId() : null"
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
            elevation="2"
            :color="started ? 'green darken-4' : 'deep-purple accent-4'"
            large
            x-large
            block
            @click="beginSession()"
          >
            {{ started ? role === 'host' ? $t('host.btnBeginStarted') : $t('participant.btnBeginStarted') : role === 'host' ? $t('host.btnBegin') : $t('participant.btnBegin') }}
          </v-btn>
        </v-card-text>
        <v-card-text v-if="role === 'host'" class="text-center">
          <h2 class="white--text accent-4 mb-4 pl-4">
            {{ $t('host.codeTitle') }} <strong class="deep-purple--text">{{ uniqueid }}</strong>
          </h2>
        </v-card-text>
      </v-card>
      <v-card>
        <v-card-text v-if="started" class="text-left px-0 pb-0 d-flex" style="height:100vh">
          <div
            style="width:85%;min-width:300px;"
          >
            <vue-plyr ref="player">
              <video
                ref="video"
                playsinline
                controls
                style="--plyr-color-main: #9c27b0;"
                :current-time.prop="time"
                :src="blobUrl"
                @play="sendWS('play',)"
                @pause="sendWS('pause')"
                @seeking="sendWS('seekTo', $event.target.currentTime)"
              />
            </vue-plyr>
          </div>
          <MainChat
            :uniqueid="uniqueid"
            :chatmessages="chatMessages"
            :onlineusers="onlineUsers"
            :role="role"
            @closeSession="closeSession()"
            @newChatMessage="sendWS('chat', $event, username)"
            @updateVideoFile="updateVideoFile($event)"
          />
        </v-card-text>
      </v-card>
    </v-img>
  </div>
</template>

<script>
import { nanoid } from 'nanoid'
import { io } from 'socket.io-client'
const ping = new Audio('ping.mp3')
export default {
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
  destroyed () {
    if (this.socket) {
      this.socket.emit('bye', this.username)
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
      this.$emit('runningSession', true)
      this.socket = io(process.env.wsURI, { auth: { username: this.username } })
      this.socket.emit('joinRoom', this.uniqueid)
      this.sendWS('join', this.username + ' ' + this.$t('session.newParticipant'), 'Info')
      this.socket.on('join', (data) => {
        const action = JSON.parse(data)
        this.chatMessages.unshift(action)
      })
      this.socket.on('newMember', (data) => {
        this.onlineUsers = data
      })
      this.socket.on('disc', (data) => {
        this.chatMessages.unshift({ payload: data + this.$t('session.participantLeft'), type: 'chat', user: 'Info' })
        console.log(data)
      })
      this.socket.on('play', () => {
        this.$refs.video.play()
      })
      this.socket.on('pause', () => {
        this.$refs.video.pause()
      })
      this.socket.on('seekTo', (timeData) => {
        if (this.role === 'participant') {
          const time = JSON.parse(timeData)
          this.time = time.payload
        }
      })
      this.chatMessages.unshift({ payload: this.$t('session.welcome') + this.username, type: 'chat', user: 'Info' })
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
      this.sendWS('bye', this.username + ' ' + this.$t('session.participantLeft'), 'Info')
      this.socket.disconnect()
      this.started = false
      this.initialized = false
      this.uniqueid = ''
      this.blobUrl = ''
      this.time = 0
    },
    generateUniqueId () {
      this.uniqueid = nanoid(10)
    }
  }
}
</script>
