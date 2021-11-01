<template>
  <v-card
    flat
    color="rgba(51,51,51,0.5)"
  >
    <v-alert
      v-if="firstTime"
      type="info"
      class="blue darken-4"
      tile
    >
      {{ $t('login.title') }}
    </v-alert>
    <v-alert
      v-if="loginFailed"
      type="error"
      tile
    >
      {{ $t('login.error') }}
    </v-alert>
    <v-card-title class="justify-center">
      {{ $t('login.title') }}
    </v-card-title>
    <v-card-text>
      <form @keyup.enter="login">
        <v-text-field
          v-model="username"
          :label="$t('login.username')"
          required
        />
        <v-text-field
          v-model="password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          :label="$t('login.password')"
          :hint="$t('login.passwordHint')"
          required
          @click:append="showPassword = !showPassword"
        />
      </form>
    </v-card-text>
    <v-card-text>
      <v-btn tile text block class="my-2 blue darken-4" @click.enter="login">
        {{ $t('login.loginButton') }}
      </v-btn>
    </v-card-text>
    <v-card-text>
      <h4 class="text-center">
        {{ $t('login.info.alreadyAccount') }}
      </h4>
      <p class="text-center">
        {{ $t('login.info.registerOptions') }}
      </p>
      <v-btn block tile text class="yellow darken-4" href="/register">
        {{ $t('login.registerOnLoginPage') }}
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import Cookie from 'js-cookie'
export default {
  data: () => ({
    username: '',
    password: '',
    showPassword: false,
    firstTime: false,
    loginFailed: false
  }),
  mounted () {
    if (this.$route.query.firstTime) {
      this.firstTime = true
    }
    if (this.$route.query.loginFailed) {
      this.loginFailed = true
    }
  },
  methods: {
    clear () {
      this.username = ''
      this.password = ''
    },
    async login () {
      const { login } = await this.$strapi.graphql({
        query: `mutation($input: UsersPermissionsLoginInput!) {
            login(input:$input){
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
            identifier: this.username,
            password: this.password,
            provider: 'local'
          }
        }
      })
      if (login.jwt) {
        const auth = {
          accessToken: login.jwt,
          username: this.username
        }
        this.$store.commit('setAuth', auth)
        Cookie.set('auth', auth)
        this.$router.replace('/')
      } else {
        this.loginFailed = true
      }
    }
  }
}
</script>

<style>

</style>
