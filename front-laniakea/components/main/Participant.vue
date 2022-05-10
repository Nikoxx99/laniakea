<template>
  <div>
    <v-card v-if="!$store.state.sessionHandler.started" class="mt-5 mx-auto pa-3 rounded-xl" max-width="774" color="rgba(10,30,120,.3)" elevation="0">
      <v-row class="justify-space-between">
        <v-col class="justify-center">
          <v-alert
            text
            dense
            icon="mdi-check"
            border="left"
            class="ml-4"
          >
            <h3>
              {{ $t('participant.title') }} <strong>{{ $store.state.auth.username }}</strong>
            </h3>
          </v-alert>
        </v-col>
        <v-col cols="12" sm="12" md="4" lg="3" xl="3">
          <v-btn
            color="red darken-1"
            class="mt-lx-4 mt-lg-4 mt-md-4 ml-4 ml-sm-4 ml-lg-0 mb-4 mb-sm-4 white--text"
            rounded
            elevation="0"
            @click="$store.commit('sessionHandler/unstage'), $router.push('/')"
          >
            {{ $t('session.switchRoleBtn') }}
            <v-icon
              right
            >
              mdi-account-arrow-left-outline
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-card-text>
        <v-text-field
          v-model="uniqueid"
          class="justify-self-center"
          :label="$t('participant.uniqueIdSelectorLabel')"
          hide-details
          outlined
          prepend-icon="mdi-fingerprint"
          @keyup="updateUniqueIdOnStore"
        />
      </v-card-text>
      <v-card-text>
        <client-only>
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
        </client-only>
      </v-card-text>
      <v-card-text>
        <v-btn
          elevation="0"
          :color="$store.state.sessionHandler.started ? 'green darken-4' : 'deep-purple accent-4'"
          large
          rounded
          x-large
          block
          @click="beginSession()"
        >
          <v-icon>mdi-broadcast</v-icon> {{ $store.state.sessionHandler.started ? $t('participant.btnBeginStarted') : $t('participant.btnBegin') }}
        </v-btn>
      </v-card-text>
    </v-card>
    <v-card>
      <v-card-text v-if="$store.state.sessionHandler.started" class="text-left px-0 pb-0 d-flex" style="height:100vh">
        <MainPlayer />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'ParticipantView',
  data () {
    return {
      video: [],
      uniqueid: ''
    }
  },
  computed: {
    hasFocus () {
      return document.hasFocus()
    }
  },
  methods: {
    beginSession () {
      this.$store.dispatch('sessionHandler/blobURL', window.URL.createObjectURL(this.video))
    },
    updateUniqueIdOnStore () {
      this.$store.commit('sessionHandler/updateUniqueId', this.uniqueid)
    }
  }
}
</script>
<style>

</style>
