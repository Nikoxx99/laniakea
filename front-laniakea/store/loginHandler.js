import Cookie from 'js-cookie'
export const state = () => ({
  auth: []
})
export const mutations = {
  setAuth (state, authDetails) {
    try {
      state.auth = authDetails
    } catch (error) {
      throw new Error(`LOGIN MUTATE ${error}`)
    }
  }
}
export const actions = {
  async loginUser ({ commit }, user) {
    try {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identifier: user.username,
          password: user.password
        })
      })
        .then(res => res.json())
        .then((login) => {
          const auth = {
            accessToken: login.jwt,
            username: this.username
          }
          commit('setAuth', auth)
          Cookie.set('auth', auth)
          window.location.href = '/'
        })
    } catch (error) {
      throw new Error(`LOGIN ACTION ${error}`)
    }
  }
}
