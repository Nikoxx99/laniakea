<template>
  <v-card class="mt-5">
    <v-card-title>
      <h3>
        {{ $t('participant.title') }} <strong>{{ username }}</strong>
      </h3>
    </v-card-title>
    <v-card-text>
      <p>
        {{ $t('participant.info') }}
      </p>
    </v-card-text>
    <v-card-text>
      <v-text-field
        v-model="session.uniqueid"
        style="max-width:50%;margin-left:auto;margin-right:auto;"
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
        :label="$t('participant.fileInputTitle')"
        :placeholder="$t('participant.fileInputPlaceholder')"
        prepend-icon="mdi-paperclip"
        outlined
        :show-size="1000"
      >
        <template v-slot:selection="{ text }">
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
    <v-card-text v-if="video">
      <v-btn
        v-model="initialized"
        elevation="2"
        color="deep-purple accent-4"
        large
        x-large
        block
        @click="joinSession()"
      >
        {{ $t('participant.btnBegin') }}
      </v-btn>
    </v-card-text>
    <v-card-text>
      <video
        ref="video"
        controls
        width="100%"
        :src="blobUrl"
        :current-time.prop="time"
      />
    </v-card-text>
  </v-card>
</template>

<script>
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
      blobUrl: null
    }
  },
  watch: {
    time (time) {
      if (Math.abs(time - this.$refs.video.currentTime) > 0.5) {
        this.$refs.video.currentTime = time
      }
      this.ws.send(this.time)
      console.log(this.time)
    }
  },
  methods: {
    joinSession () {
      this.ws = new WebSocket(`ws://localhost:8082/?token=${this.session.uniqueid}`)
      this.ws.addEventListener('open', () => {
        console.log('Connected')
        this.ws.send(this.username + this.$t('sesion.newParticipant'))
      })
      this.ws.addEventListener('message', ({ data }) => {
        if (data === 'play') {
          this.$refs.video.play()
        } else if (data === 'pause') {
          this.$refs.video.pause()
        } else {
          this.time = data
        }
      })
      this.blobUrl = window.URL.createObjectURL(this.video)
    }
  }
}
</script>

<style scoped>
  audio::-webkit-media-controls-timeline,
  video::-webkit-media-controls-play-button,
  video::-webkit-media-controls-current-time-display,
  video::-webkit-media-controls-time-remaining-display,
  video::-webkit-media-controls-timeline {
      display: none;
  }
</style>
