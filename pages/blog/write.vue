<template>
  <v-container>
    <blog-editor
      :blog="blog"
      :new-blog="true"
      @postBlog="postBlog"
    ></blog-editor>
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
    <v-dialog v-model="dialog2" max-width="290">
      <v-card>
        <v-card-title class="headline">还有一篇草稿未处理</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="darken-1" text @click="dialog2 = false">
            忽略
          </v-btn>
          <v-btn color="darken-1" text @click="clearDraft">
            清空
          </v-btn>
          <v-btn color="darken-1" text @click="handleDraft">
            处理
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
      url: '/',
      dialog2: false,
      draft: null
    }
  },
  beforeMount() {
    this.emptyBlog = JSON.parse(JSON.stringify(this.blog))
    const draft = localStorage.getItem('draft')
    if (draft) {
      this.draft = JSON.parse(draft)
    }
  },
  mounted() {
    if (this.draft) {
      this.dialog2 = true
    }
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
    },
    handleDraft() {
      this.blog = this.draft
      this.dialog2 = false
    },
    clearDraft() {
      localStorage.removeItem('draft')
      this.dialog2 = false
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
