<template>
  <v-card
    flat
    color="rgba(51,51,51,0)"
  >
    <v-card-title class="justify-center">
      {{ $t('auth.registerTitle') }}
    </v-card-title>
    <v-card-text>
      <form>
        <v-text-field
          v-model="username"
          label="Username"
          required
          outlined
        />
        <v-text-field
          v-model="email"
          :label="$t('auth.email')"
          :hint="$t('auth.emailHint')"
          outlined
        />
        <v-text-field
          v-model="password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          :label="$t('auth.password')"
          :hint="$t('auth.passwordHint')"
          required
          counter
          :error="!matchPasswords"
          :success="matchPasswords"
          outlined
          @click:append="showPassword = !showPassword"
        />
        <v-text-field
          v-model="confirmPassword"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          :label="$t('auth.confirmPassword')"
          :hint="$t('auth.confirmPasswordHint')"
          required
          counter
          outlined
          :success="matchPasswords"
          @click:append="showPassword = !showPassword"
        />
      </form>
    </v-card-text>
    <v-card-text>
      <v-btn
        block
        text
        rounded
        class="my-2 yellow darken-4"
        :loading="loading"
        :disabled="loading"
        @click="createUser"
      >
        {{ $t('auth.registerButton') }}
      </v-btn>
      <v-btn block text class="gray darken-4" href="/">
        {{ $t('auth.registerCancel') }}
      </v-btn>
    </v-card-text>
    <v-card-text>
      <h4 class="text-center">
        {{ $t('auth.info.alreadyAccount') }}
      </h4>
      <p class="text-center">
        {{ $t('auth.info.registerOptions') }}
      </p>
      <v-btn block rounded text class="blue darken-4" href="/login">
        {{ $t('auth.loginOnRegisterPage') }}
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    loading: false,
    showPassword: false,
    valid: false
  }),
  head () {
    return {
      title: this.$t('auth.registerTitle'),
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
  computed: {
    matchPasswords () {
      return this.password === this.confirmPassword
    }
  },
  methods: {
    clear () {
      this.$v.$reset()
      this.name = ''
      this.email = ''
      this.select = null
      this.checkbox = false
    },
    async createUser () {
      this.loading = true
      const { register } = await this.$strapi.graphql({
        query: `mutation($input: UsersPermissionsRegisterInput!) {
          register(input:$input){
            jwt
            user{
              id
              username
              confirmed
            }
          }
        }`,
        variables: {
          input: {
            username: this.username,
            email: this.email,
            password: this.password
          }
        }
      })
      if (register.jwt) {
        this.loading = false
        this.$router.replace({ path: '/login?firstTime' })
      } else {
        this.loading = false
        this.valid = false
      }
    }
  }
}
</script>

<style>

</style>
