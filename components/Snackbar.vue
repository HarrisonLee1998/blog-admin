<template>
  <v-snackbar v-model="show" :color="color" :timeout="timeout" :top="top">
    {{ message }}
    <v-btn dark text @click="show = false">
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      message: '',
      color: '',
      timeout: 4000,
      top: true
    }
  },

  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'snackbar/showMessage') {
        this.message = state.snackbar.content
        this.color = state.snackbar.color
        this.show = true
        this.timeout = state.snackbar.time
      }
    })
  }
}
</script>
