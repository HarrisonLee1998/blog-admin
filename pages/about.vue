<template>
  <v-container>
    <v-row justify="end">
      <v-btn v-show="mode === 0" @click="mode = 1"
        ><v-icon class="pr-2">create</v-icon>Edit</v-btn
      >
    </v-row>
    <v-row>
      <v-col cols="12">
        <Editor
          v-show="mode === 1"
          :doc="markdown"
          @getContent="getContentFromEditor"
        />
      </v-col>
    </v-row>
    <v-row v-show="mode === 1" justify="end">
      <v-btn class="mr-4"><v-icon class="pr-2">clear</v-icon>Cancel</v-btn>
      <v-btn @click="postContent"><v-icon class="pr-2">save</v-icon>Save</v-btn>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" lg="6">
        <div v-html="html"></div>
      </v-col>
    </v-row>
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
      markdown: '',
      html: '',
      mode: 0,
      newMarkdown: '',
      newHtml: ''
    }
  },
  beforeMount() {
    this.getContentFromServer()
  },
  methods: {
    getContentFromEditor(markdown, html) {
      this.newMarkdown = markdown
      this.newHtml = html
    },
    getContentFromServer() {
      this.$axios.get('/api/admin/about/markdown').then((res) => {
        if (res.data.status === 'OK') {
          this.markdown = res.data.map.markdown
        }
      })
      this.$axios.get('/api/admin/about/html').then((res) => {
        if (res.data.status === 'OK') {
          this.html = res.data.map.html
        }
      })
    },
    postContent() {
      this.$axios({
        url: '/api/admin/about',
        method: 'post',
        data: {
          markdown: this.newMarkdown,
          html: this.newHtml
        },
        headers: { 'Content-Type': 'application/json' }
      }).then((res) => {
        if (res.data.status === 'OK') {
          this.$notifier.showMessage({ content: '保存成功', color: 'success' })
          this.markdown = this.newMarkdown
          this.html = this.newHtml
          this.mode = 0
        }
      })
    }
  }
}
</script>
