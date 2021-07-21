<template>
  <v-card style="width:350px;display:flex;flex-flow: column;">
    <v-card-text
      class="py-0"
    >
      {{ $t('host.codeTitle') }} <strong class="purple--text">{{ uniqueid }}</strong>
    </v-card-text>
    <v-card-text
      style="height:100px;overflow-y:scroll;display:flex;flex-direction:column-reverse;flex: 1 1 auto;"
    >
      <p
        v-for="chatMessage in chatMessages"
        :key="chatMessage.date"
      >
        <strong>{{ chatMessage.user }}: </strong>{{ chatMessage.payload }}
      </p>
    </v-card-text>
    <v-card-text
      class="pb-0"
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
    <v-card-text
      style="flex: 0 1 auto;"
      class="text-right"
    >
      <v-btn
        color="red darken-1"
        class="white--text"
        block
        @click="reload()"
      >
        {{ $t('session.closeSessionBtn') }}
        <v-icon
          right
        >
          mdi-close
        </v-icon>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'Chat',
  props: {
    chatMessages: {
      type: Array,
      default: () => []
    },
    uniqueid: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      chat: {
        message: ''
      }
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
