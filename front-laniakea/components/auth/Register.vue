<template>
  <v-card
    flat
    color="rgba(51,51,51,0.5)"
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
        />
        <v-text-field
          v-model="email"
          :label="$t('auth.email')"
          :hint="$t('auth.emailHint')"
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
          :success="matchPasswords"
          @click:append="showPassword = !showPassword"
        />
      </form>
    </v-card-text>
    <v-card-text>
      <v-btn
        block
        text
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
      <v-btn block tile text class="blue darken-4" href="/login">
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
    // createUser () {
    //   this.$apollo.mutate({
    //     mutation: gql`mutation ($input: UserInput!){
    //       createUser(input: $input){
    //         success
    //         token
    //         username
    //         errors{
    //           path
    //           message
    //         }
    //       }
    //     }`,
    //     variables: {
    //       input: {
    //         username: this.username,
    //         email: this.email,
    //         password: this.password
    //       }
    //     }
    //   }).then((input) => {
    //     this.$router.push({ path: '/login?firstTime=true' })
    //   }).catch((error) => {
    //     // eslint-disable-next-line no-console
    //     console.error(error)
    //   })
    // }
  }
}
</script>

<style>

</style>
