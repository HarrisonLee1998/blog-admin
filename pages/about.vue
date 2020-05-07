<template>
  <v-container>
    <Editor :doc="doc" />
  </v-container>
</template>

<script>
import Editor from '~/components/Editor'
export default {
  components: {
    Editor
  },
  data() {
    return {
      doc: ''
    }
  }
}
</script>
