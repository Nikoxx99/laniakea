<template>
  <div>
    <v-app-bar
      v-if="!runningSessionValue"
      dense
      flat
      stlye="height:36px !important;"
      class="mb-4 p-0"
    >
      <v-spacer />

      <v-btn icon @click="logout">
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="12" md="12" class="py-0 px-0">
        <v-card v-if="!session.isInitialized" color="black">
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
              {{ $t('index.welcome') }} {{ $store.state.auth.username }}
            </h1>
          </v-card-title>
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
              @click="switchRole('host')"
            >
              {{ $t('index.btnHost') }}
            </v-btn>
            <v-btn
              v-model="user.isParticipant"
              elevation="2"
              color="blue darken-4"
              large
              x-large
              @click="switchRole('participant')"
            >
              {{ $t('index.btnParticipant') }}
            </v-btn>
          </v-card-text>
        </v-card>
        <MainPlayer
          v-if="session.isInitialized"
          :role="role"
          :username="user.name"
          @changeRole="role = null, session.isInitialized = false"
          @runningSession="runningSessionFunc($event)"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Cookie from 'js-cookie'
export default {
  name: 'Laniakea',
  middleware: ['authenticated'],
  data () {
    return {
      runningSessionValue: false,
      role: null,
      error: {
        status: false,
        message: ''
      },
      user: {
        name: this.$store.state.auth.username
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
    switchRole (role) {
      this.session.isInitialized = true
      this.error.status = false
      this.error.message = ''
      if (this.user.name) {
        if (role === 'host') {
          this.role = 'host'
        } else {
          this.role = 'participant'
        }
      } else {
        this.error.status = true
        this.error.message = this.$t('error.index.usernameNotDefined')
      }
    },
    runningSessionFunc (event) {
      if (event) {
        this.runningSessionValue = true
      } else {
        this.runningSessionValue = false
      }
    },
    logout () {
      Cookie.remove('auth')
      Cookie.remove('authToken')
      localStorage.clear()
      sessionStorage.clear()
      this.$store.commit('setAuth', null)
      window.location.href = '/login'
    }
  }
}
</script>
