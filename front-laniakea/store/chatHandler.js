export const state = () => ({
  init: []
})
export const mutations = {
  sendChat (state, sessionInformation) {
    try {
      state.role = sessionInformation.role
      state.uniqueid = sessionInformation.uniqueid
    } catch (error) {
      throw new Error(`CHAT MUTATE ${error}`)
    }
  }
}
export const actions = {
  sendChat ({ commit }, chatMessage) {
    try {
      commit('sendChat', sessionInformation)
    } catch (error) {
      throw new Error(`CHAT ACTION ${error}`)
    }
  }
}
