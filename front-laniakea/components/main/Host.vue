<template>
  <v-card class="mt-5">
    <v-card-title>
      <h3>
        {{ $t('host.title') }} <strong>{{ username }}</strong>
      </h3>
    </v-card-title>
    <v-card-text>
      <p>
        {{ $t('host.info') }}
      </p>
    </v-card-text>
    <v-card-text>
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
        @click="beginSession()"
      >
        {{ $t('host.btnBegin') }}
      </v-btn>
    </v-card-text>
    <v-card-text>
      <video
        ref="video"
        width="100%"
        :src="blobUrl"
        controls
        @play="ws.send('play')"
        @pause="ws.send('pause')"
        @seeking="time = $event.target.currentTime"
      />
      <h2 class="deep-purple--text accent-4">{{ uniqueid }}</h2>
    </v-card-text>
  </v-card>
</template>

<script>
import { nanoid } from 'nanoid'
export default {
  props: {
    username: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      video: [],
      initialized: false,
      uniqueid: '',
      blobUrl: '',
      time: 0,
      ws: null
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
    beginSession () {
      this.ws = new WebSocket(`ws://localhost:8082/?token=${this.uniqueid}`)
      this.ws.addEventListener('open', () => {
        console.log('Connected')
        this.ws.send('Video iniciado')
      })
      this.ws.addEventListener('message', (e) => {
        console.log(e)
      })
      this.blobUrl = window.URL.createObjectURL(this.video)
    },
    generateUniqueId () {
      this.uniqueid = nanoid()
    }
  }
}
</script>
