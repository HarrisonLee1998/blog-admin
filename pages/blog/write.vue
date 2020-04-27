<template>
  <v-container>
    <blog-editor :blog="blog" @postBlog="postBlog"></blog-editor>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">文章发布成功</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="clearBlog">
            再写一篇
          </v-btn>

          <v-btn color="green darken-1" text @click="viewDetails">
            查看详情
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import BlogEditor from '@/components/BlogEditor.vue'

export default {
  components: {
    BlogEditor
  },
  data() {
    return {
      blog: {
        title: '',
        markdown: '',
        html: '',
        archiveTitle: '',
        tags: [],
        isOpen: true,
        isReward: false
      },
      emptyBlog: {},
      dialog: false,
      url: '/'
    }
  },
  beforeMount() {
    this.emptyBlog = JSON.parse(JSON.stringify(this.blog))
  },
  methods: {
    postBlog(blog) {
      this.$axios({
        url: '/api/admin/article',
        method: 'post',
        data: JSON.stringify(blog),
        headers: { 'Content-Type': 'application/json' }
      }).then((res) => {
        if (res.data.status === 'OK') {
          const url = '/blog/entry/' + res.data.map.id
          this.url = url
          this.dialog = true
        }
      })
    },
    clearBlog() {
      this.blog = this.emptyBlog
      this.dialog = false
    },
    viewDetails() {
      this.dialog = false
      this.$router.push(this.url)
    }
  },
  head() {
    return {
      title: '写博客'
    }
  }
}
</script>

//
<style lang="css">
textarea,
pre {
  -moz-tab-size: 4;
  -o-tab-size: 4;
  tab-size: 4;
}
</style>
