<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12" class="py-0 px-0">
      <v-card v-if="!session.isInitialized">
        <v-alert
          v-if="error.status"
          dense
          type="error"
        >
          {{ error.message }}
        </v-alert>
        <v-card-title class="headline justify-center">
          <LayoutLogo />
        </v-card-title>
        <v-card-title class="headline justify-center">
          <h1 class="text-center">
            {{ $t('index.welcome') }}
          </h1>
        </v-card-title>
        <v-card-text class="text-center">
          <h3>
            {{ $t('index.nameSelector') }}
          </h3>
        </v-card-text>
        <v-card-text class="text-center">
          <v-text-field
            v-model="user.name"
            style="max-width:50%;margin-left:auto;margin-right:auto;"
            class="justify-self-center"
            :label="$t('index.nameSelectorLabel')"
            hide-details
            outlined
          />
        </v-card-text>
        <v-card-text class="text-center">
          <h3>
            {{ $t('index.subtitle') }}
          </h3>
        </v-card-text>
        <v-card-text class="text-center">
          <v-btn
            v-model="user.isHost"
            elevation="2"
            color="red darken-4"
            large
            x-large
            @click="switchToRoleHost()"
          >
            {{ $t('index.btnHost') }}
          </v-btn>
          <v-btn
            v-model="user.isParticipant"
            elevation="2"
            color="blue darken-4"
            large
            x-large
            @click="switchToRoleParticipant()"
          >
            {{ $t('index.btnParticipant') }}
          </v-btn>
        </v-card-text>
      </v-card>
      <MainHost
        v-if="user.isHost"
        :username="user.name"
        @changeRole="user.isHost = false, session.isInitialized = false"
      />
      <MainParticipant
        v-if="user.isParticipant"
        :username="user.name"
        @changeRole="user.isParticipant = false, session.isInitialized = false"
      />
    </v-col>
  </v-row>
</template>

<script>

export default {
  data () {
    return {
      error: {
        status: false,
        message: ''
      },
      user: {
        name: '',
        isHost: false,
        isParticipant: false
      },
      session: {
        isInitialized: false
      }
    }
  },
  head () {
    return {
      title: 'Laniakea - ' + this.$t('index.tabInfo'),
      meta: [
        { hid: 'language', name: 'language', content: 'es' },
        { hid: 'language', name: 'language', content: 'en' },
        { hid: 'audience', name: 'audience', content: 'all' },
        { hid: 'rating', name: 'rating', content: 'general' },
        { hid: 'distribution', name: 'distribution', content: 'global' },
        { hid: 'document-type', name: 'document-type', content: 'Public' },
        { hid: 'MSSmartTagsPreventParsing', name: 'MSSmartTagsPreventParsing', content: 'true' },
        { hid: 'robots', name: 'robots', content: 'all' },
        { hid: 'robots', name: 'robots', content: 'all, index, follow' },
        { hid: 'googlebot', name: 'googlebot', content: 'all, index, follow' },
        { hid: 'yahoo-slurp', name: 'yahoo-slurp', content: 'all, index, follow' },
        { hid: 'msnbot', name: 'msnbot', content: 'index, follow' },
        { hid: 'googlebot-image', name: 'googlebot-image', content: 'all' },
        { hid: 'title', name: 'title', content: this.title },
        { hid: 'og:title', property: 'og:title', content: this.title },
        { hid: 'og:description', property: 'og:description', content: 'Watch movies, videos, and more in sync with your friends' },
        { hid: 'og:url', property: 'og:url', content: 'https://laniakea.live' },
        { hid: 'og:image', property: 'og:image', content: 'https://laniakea.live/favicon.jpg' },
        { hid: 'author', name: 'author', content: 'laniakea' }
      ]
    }
  },
  methods: {
    switchToRoleHost () {
      this.session.isInitialized = true
      this.error.status = false
      this.error.message = ''
      if (this.user.name) {
        this.user.isHost = true
        this.user.isParticipant = false
      } else {
        this.error.status = true
        this.error.message = this.$t('error.index.usernameNotDefined')
      }
    },
    switchToRoleParticipant () {
      this.session.isInitialized = true
      this.error.status = false
      this.error.message = ''
      if (this.user.name) {
        this.user.isHost = false
        this.user.isParticipant = true
      } else {
        this.error.status = true
        this.error.message = this.$t('error.index.usernameNotDefined')
      }
    }
  }
}
</script>
