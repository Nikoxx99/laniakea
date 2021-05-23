<template>
  <v-card class="mt-5">
    <v-card-title>
      <h3>
        {{ $t('host.title') }} <strong>{{ username }}</strong>
      </h3>
    </v-card-title>
    <v-card-text>
      <p>
        {{ $t('host.info') }}
      </p>
    </v-card-text>
    <v-card-text>
      <v-file-input
        v-model="video"
        color="deep-purple accent-4"
        counter
        :label="$t('host.fileInputTitle')"
        :placeholder="$t('host.fileInputPlaceholder')"
        prepend-icon="mdi-paperclip"
        outlined
        :show-size="1000"
      >
        <template v-slot:selection="{ text }">
          <v-chip
            color="deep-purple accent-4"
            dark
            label
            small
          >
            {{ text }}
          </v-chip>
        </template>
      </v-file-input>
    </v-card-text>
    <v-card-text v-if="video">
      <v-btn
        v-model="initialized"
        elevation="2"
        color="deep-purple accent-4"
        large
        x-large
        block
        @click="switchToRoleParticipant()"
      >
        {{ $t('host.btnBegin') }}
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    username: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      video: [],
      initialized: false
    }
  }
}
</script>
