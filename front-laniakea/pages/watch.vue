<template>
  <div>
    <MainHost v-if="$route.query.role === 'host'" />
    <MainParticipant v-else />
  </div>
</template>

<script>
import { nanoid } from 'nanoid'
export default {
  name: 'Watch',
  data () {
    return {
      uniqueid: ''
    }
  },
  watch: {
    $route () {
      this.setSessionInformation()
      this.generateUniqueId()
    }
  },
  mounted () {
    this.setSessionInformation()
    this.generateUniqueId()
  },
  methods: {
    setSessionInformation () {
      this.$store.dispatch('sessionHandler/setSessionInformation', {
        role: this.$route.query.role,
        uniqueid: this.generateUniqueId()
      })
      this.$store.commit('sessionHandler/stage')
    },
    generateUniqueId () {
      return nanoid(6)
    }
  }
}
</script>
<style>

</style>
