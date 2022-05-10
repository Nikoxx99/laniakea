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
    }
  },
  watch: {
    $route () {
      this.setSessionInformation()
    }
  },
  mounted () {
    this.setSessionInformation()
  },
  methods: {
    setSessionInformation () {
      this.$store.dispatch('sessionHandler/setSessionInformation', {
        role: this.$route.query.role,
        uniqueid: this.$route.query.role === 'host' ? this.generateUniqueId() : null
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
