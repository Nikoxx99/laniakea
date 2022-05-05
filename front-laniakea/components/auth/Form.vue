<template>
  <v-card
    flat
    color="rgba(51,51,51,0)"
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
          outlined
        />
        <v-text-field
          v-model="password"
          outlined
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
      <v-btn
        text
        block
        rounded
        class="my-2 blue darken-4"
        @click.enter="login"
      >
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
      <v-btn
        block
        text
        rounded
        class="yellow darken-4"
        href="/register"
      >
        {{ $t('login.registerOnLoginPage') }}
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
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
      await this.$store.dispatch('loginHandler/loginUser', {
        username: this.username,
        password: this.password
      })
    }
  }
}
</script>

<style>

</style>
