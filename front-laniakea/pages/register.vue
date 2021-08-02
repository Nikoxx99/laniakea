<template>
  <v-img
    src="bg1.jpg"
    style="width:100%!important;height:97vh!important;background-position:right!important"
  >
    <v-container>
      <v-row>
        <v-col
          cols="12"
          xs="12"
          sm="10"
          md="8"
          lg="4"
          lx="4"
          class="mx-auto"
        >
          <LayoutLogo class="my-4" style="justify-self:center;display:flex;" />
          <AuthRegister />
        </v-col>
      </v-row>
    </v-container>
  </v-img>
</template>

<script>
export default {
  middleware: 'notAuthenticated'
}
</script>

<style>

</style>
