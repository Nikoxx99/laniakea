<template>
  <div
    id="container"
    style="width:100%;min-width:300px;"
  >
    <vue-plyr ref="plyr" :options="$store.state.sessionHandler.role === 'host' ? optionsHost : optionsParticipant">
      <video
        ref="video"
        playsinline
        :controls="false"
        :clickToPlay="true"
        style="--plyr-color-main: #9c27b0;"
        :src="$store.state.sessionHandler.blobURL"
        @play="$store.state.sessionHandler.role === 'host' ? sendWS('play'): null"
        @pause="$store.state.sessionHandler.role === 'host' ? sendWS('pause') : null"
        @seeking="$store.state.sessionHandler.role === 'host' ? sendWS('seekTo', $event.target.currentTime) : null"
      />
    </vue-plyr>
    <MainChat
      :chatmessages="chatMessages"
      :onlineusers="onlineUsers"
      @closeSession="closeSession()"
    />
  </div>
</template>

<script>
import { nanoid } from 'nanoid'
export default {
  name: 'Player',
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
      uniqueid: '',
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
    this.setupSocket()
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
    setupSocket () {
      this.socket = this.$socket({
        auth: { token: this.$store.state.auth.token }
      })
      this.socket.emit('joinRoom', this.uniqueid)
      this.sendWS('join', { message: this.username + ' ' + this.$t('session.newParticipant'), user: this.$store.state.auth }, 'Info')

      this.socket.on('join', (data) => {
        const action = JSON.parse(data)
        this.chatMessages.unshift(action)
      })
      this.socket.on('newMember', (data) => {
        this.onlineUsers = data
      })
      this.socket.on('disc', (data) => {
        this.chatMessages.unshift({ payload: data + this.$t('session.participantLeft'), type: 'chat', user: 'Info' })
      })
      this.socket.on('play', () => {
        if (this.role === 'participant') {
          this.$refs.video.play()
        }
      })
      this.socket.on('pause', () => {
        if (this.role === 'participant') {
          this.$refs.video.pause()
        }
      })
      this.socket.on('seekTo', (timeData) => {
        if (this.role === 'participant') {
          const time = JSON.parse(timeData)
          this.time = time.payload
        }
      })
      this.chatMessages.unshift({ payload: { message: this.$t('session.welcome') + this.username }, type: 'chat', user: 'Info' })

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
    },
    closeSession () {
      this.$emit('runningSession', false)
      this.sendWS('bye', { message: this.username + ' ' + this.$t('session.participantLeft') }, 'Info')
      this.socket.disconnect()
      this.started = false
      this.initialized = false
      this.uniqueid = ''
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
