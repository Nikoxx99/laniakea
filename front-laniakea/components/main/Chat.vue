<template>
  <v-card flat class="chatLaniakea">
    <v-card-text
      style="background-color:rgba(0,0,0,0.4);"
      class="py-0 hideMe"
      @mouseenter="e => e.target.classList.remove('hideMe')"
      @mouseleave="e => e.target.classList.add('hideMe')"
    >
      <h2>
        {{ $t('host.codeTitle') }}
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <strong
              id="uniqueid"
              class="purple--text"
              style="cursor:pointer;"
              v-bind="attrs"
              v-on="on"
              @click="copyId"
              @hover="copyStatus = 'copyToClipboard'"
            >{{ $store.state.sessionHandler.uniqueid }}</strong>
          </template>
          <span>{{ $t(`session.${copyStatus}`) }}</span>
        </v-tooltip>

        <span
          style="float:right;cursor:pointer;"
          class="red--text darken-3"
          @click="reload()"
        >
          {{ $t('session.closeSessionBtn') }}
        </span>
      </h2>
    </v-card-text>
    <v-card-text
      :class="{ hideMe: visible.input }"
      @mouseenter="visible.input = false"
      @mouseleave="visible.input = true"
    >
      <v-file-input
        v-model="video"
        color="deep-purple accent-4"
        counter
        :label="$store.state.sessionHandler.role === 'host' ? $t('host.fileInputTitle') : $t('participant.fileInputTitle')"
        :placeholder="$store.state.sessionHandler.role === 'host' ? $t('host.fileInputPlaceholder') : $t('participant.fileInputPlaceholder')"
        prepend-icon="mdi-paperclip"
        outlined
        :show-size="1000"
        @change="updateVideoFile(video)"
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
    <v-card-text
      class="scroller"
      style="height:100px;overflow-y:scroll;display:flex;flex-direction:column-reverse;flex: 1 1 auto;"
      @mouseenter="visible.chatItem = false"
      @mouseleave="visible.chatItem = true"
    >
      <p
        v-for="chatMessage in chatmessages"
        :key="chatMessage.date"
        :class="{ hideMe2: visible.chatItem }"
        style="cursor:pointer;background-color:rgba(0,0,0,0.4);padding: 10px 10px 10px 10px"
      >
        <strong :style="`color:${chatMessage.payload.color}`">{{ chatMessage.user }}: </strong>{{ chatMessage.payload.message }}
      </p>
    </v-card-text>
    <v-card-text
      :class="{ hideMe: visible.inputChat }"
      style="flex: 0 1 auto;background-color:rgba(0,0,0,0.4);boder-radius:20px;"
      @mouseenter="visible.inputChat = false, visible.chat = false, visible.chatItem = false"
      @mouseleave="visible.inputChat = true, visible.chat = true, visible.chatItem = true"
    >
      <v-text-field
        v-model="chat.message"
        :label="$t('chat.chatBox.label')"
        :placeholder="$t('chat.chatBox.placeholder')"
        outlined
        dense
        hide-details
        autocomplete="off"
        @keydown.enter="sendChat()"
      />
    </v-card-text>
  </v-card>
</template>

<script>
const randomColor = require('randomcolor')
export default {
  name: 'Chat',
  props: {
    chatmessages: {
      type: Array,
      default: () => []
    },
    onlineusers: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      chat: {
        message: '',
        color: randomColor()
      },
      video: null,
      visible: {
        input: true,
        chat: true,
        chatItem: true,
        inputChat: true
      },
      copyStatus: 'copyToClipboard'
    }
  },
  computed: {
    randomColor () {
      return randomColor()
    }
  },
  methods: {
    reload () {
      this.$emit('closeSession')
    },
    sendChat () {
      if (this.chat.message) {
        this.$socket(this.$store.state.auth).chat(this.chat)
        this.$emit('chat', this.chat)
        this.chat.message = ''
      }
    },
    updateVideoFile (video) {
      this.$emit('updateVideoFile', video)
    },
    copyId () {
      navigator.clipboard.writeText(this.$store.state.sessionHandler.uniqueid)
      this.copyStatus = 'copiedToClipboard'
    }
  }

}
</script>

<style scoped>
::-webkit-scrollbar {
width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background-color:#333;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #673ab7 !important
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #4e2a8d !important
}
.scroller {
  overflow-y: scroll;
  scrollbar-color: #4e2a8d rgba(48, 48, 48,0);
  scrollbar-width: thin;
}

.chatLaniakea {
  position: absolute;
  float:right;
  right:0;
  bottom:40px;
  width:350px;
  height: 90vh;;
  display:flex;
  flex-flow: column;
  background-color:rgba(0,0,0,0);
}
.hideMe {
    -moz-animation: cssAnimation 1s ease-in 2s forwards;
    /* Firefox */
    -webkit-animation: cssAnimation 1s ease-in 2s forwards;
    /* Safari and Chrome */
    -o-animation: cssAnimation 1s ease-in 2s forwards;
    /* Opera */
    animation: cssAnimation 1s ease-in 2s forwards;
    -webkit-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
}
.hideMe2 {
    -moz-animation: cssAnimation 1s ease-in 4s forwards;
    /* Firefox */
    -webkit-animation: cssAnimation 1s ease-in 4s forwards;
    /* Safari and Chrome */
    -o-animation: cssAnimation 1s ease-in 4s forwards;
    /* Opera */
    animation: cssAnimation 1s ease-in 4s forwards;
    -webkit-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
}
@keyframes cssAnimation {
    to {
        opacity: 0;
    }
}
@-webkit-keyframes cssAnimation {
    to {
        opacity: 0;
    }
}

</style>
