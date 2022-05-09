<template>
  <v-container>
    <v-row class="justify-center">
      <pre>
      {{ JSON.stringify($store.state.sessionHandler, null, 4) }}
    </pre>
    </v-row>
    <v-row class="justify-center">
      <code>
        {{ $config }}
      </code>
    </v-row>
  </v-container>
</template>
