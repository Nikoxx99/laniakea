<template>
  <div>
    <v-app-bar
      dense
      flat
      color="transparent"
      class="mb-4 p-0"
    >
      <v-spacer />

      <v-btn
        icon
        href="https://discord.gg/N6qZJZftPs"
      >
        <v-icon>mdi-discord</v-icon>
      </v-btn>
      <v-btn icon @click="logout">
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="12" md="12" class="py-0 px-0">
        <v-card color="transparent" elevation="0" class="align-center">
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
          <v-card-text class="text-center justify-center align-center">
            <v-btn
              elevation="0"
              class="mr-sm-4 mr-md-4 mr-lg-4 mb-4 mb-xs-0 mb-sm-0 mb-md-0 mb-lg-0"
              color="deep-purple accent-4"
              large
              rounded
              x-large
              to="/watch?role=host"
            >
              <v-icon>mdi-video-plus</v-icon> {{ $t('index.btnHost') }}
            </v-btn>
            <v-btn
              elevation="0"
              rounded
              color="deep-purple accent-4"
              outlined
              large
              class="mr-sm-4 mr-md-4 mr-lg-4 mb-4 mb-xs-0 mb-sm-0 mb-md-0 mb-lg-0"
              x-large
              to="/watch?role=participant"
            >
              <v-icon>mdi-plus</v-icon>{{ $t('index.btnParticipant') }}
            </v-btn>
          </v-card-text>
          <v-card-text>
            <v-row class="justify-center mt-2 px-4">
              <p class="mr-2">
                {{ $t('index.communityInfo') }}
              </p> <a href="https://discord.gg/N6qZJZftPs"> {{ $t('index.communityLink') }}</a>
            </v-row>
          </v-card-text>
        </v-card>
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
      error: {
        status: false,
        message: ''
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
<style>

</style>
