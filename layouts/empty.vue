<template>
  <div>
    <nuxt></nuxt>
    <Snackbar></Snackbar>
  </div>
</template>

<script>
import Snackbar from '~/components/Snackbar.vue'
export default {
  components: {
    Snackbar
  }
}
</script>
