export const state = () => ({
  role: '',
  uniqueid: '',
  started: false,
  stagged: false,
  blobURL: null
})
export const mutations = {
  setSessionInformation (state, sessionInformation) {
    try {
      state.role = sessionInformation.role
      state.uniqueid = sessionInformation.uniqueid
    } catch (error) {
      throw new Error(`SESSION STORE MUTATE ${error}`)
    }
  },
  stage (state) {
    state.stagged = true
  },
  unstage (state) {
    state.stagged = false
  },
  startSession (state) {
    try {
      state.started = true
    } catch (error) {
      throw new Error(`SESSION START MUTATE ${error}`)
    }
  },
  endSession (state) {
    try {
      state.started = false
    } catch (error) {
      throw new Error(`SESSION START MUTATE ${error}`)
    }
  },
  blobURL (state, blobURL) {
    try {
      state.blobURL = blobURL
    } catch (error) {
      throw new Error(`BLOB GENERATION MUTATE ${error}`)
    }
  }
}
export const actions = {
  setSessionInformation ({ commit }, sessionInformation) {
    try {
      commit('setSessionInformation', sessionInformation)
    } catch (error) {
      throw new Error(`SESSION STORE ACTION ${error}`)
    }
  },
  blobURL ({ commit }, blob) {
    try {
      commit('blobURL', blob)
      commit('startSession')
    } catch (error) {
      throw new Error(`BLOB GENERATION ACTION ${error}`)
    }
  }
}
