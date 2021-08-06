<template>
  <v-card style="width:350px;display:flex;flex-flow: column;">
    <v-card-text
      class="py-0"
    >
      {{ $t('host.codeTitle') }} <strong class="purple--text">{{ uniqueid }}</strong>
      <span
        style="float:right;cursor:pointer;"
        class="red--text darken-3"
        @click="reload()"
      >
        {{ $t('session.closeSessionBtn') }}
      </span>
    </v-card-text>
    <v-card-text
      class="py-2"
    >
      <v-file-input
        v-model="video"
        color="deep-purple accent-4"
        counter
        :label="role === 'host' ? $t('host.fileInputTitle') : $t('participant.fileInputTitle')"
        :placeholder="role === 'host' ? $t('host.fileInputPlaceholder') : $t('participant.fileInputPlaceholder')"
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
      style="height:100px;overflow-y:scroll;display:flex;flex-direction:column-reverse;flex: 1 1 auto;"
    >
      <p
        v-for="chatMessage in chatmessages"
        :key="chatMessage.date"
        style="cursor:pointer;"
      >
        <strong>{{ chatMessage.user }}: </strong>{{ chatMessage.payload }}
      </p>
    </v-card-text>
    <v-card-text
      style="flex: 0 1 auto;"
    >
      <v-text-field
        v-model="chat.message"
        :label="$t('chat.chatBox.label')"
        :placeholder="$t('chat.chatBox.placeholder')"
        outlined
        hide-details
        autocomplete="off"
        @keydown.enter="sendChat()"
      />
    </v-card-text>
  </v-card>
</template>

<script>
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
    },
    uniqueid: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      chat: {
        message: ''
      },
      video: null
    }
  },
  methods: {
    reload () {
      this.$emit('closeSession')
    },
    sendChat () {
      if (this.chat.message) {
        this.$emit('newChatMessage', this.chat.message)
        this.chat.message = ''
      }
    },
    updateVideoFile (video) {
      this.$emit('updateVideoFile', video)
    }
  }

}
</script>

<style scoped>
::-webkit-scrollbar {
width: 10px;
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
</style>
