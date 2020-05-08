<template>
  <v-container>
    <blog-editor
      :blog="article"
      :new-blog="false"
      @postBlog="postBlog"
    ></blog-editor>
  </v-container>
</template>

<script>
import BlogEditor from '@/components/BlogEditor.vue'
export default {
  components: {
    BlogEditor
  },
  async asyncData({ $axios, redirect, route, $moment }) {
    const id = route.params.id.trim()
    if (id && id.length !== 12) {
      redirect('/404')
    } else {
      const { data } = await $axios.get(`/api/admin/article/entry/${id}`)
      const article = data.map.article
      article.archiveTitle = article.archive_title
      article.isOpen = article.is_open
      article.isReward = article.is_reward
      return { article: data.map.article }
    }
  },
  methods: {
    postBlog(blog) {
      blog.postDate = this.article.post_date
      blog.lastUpdateDate = this.article.last_update_date
      blog.isDelete = this.article.is_delete
      blog.viewTimes = this.article.view_times
      this.$axios({
        url: '/api/admin/article',
        method: 'put', // 修改请求使用put
        data: JSON.stringify(blog),
        headers: { 'Content-Type': 'application/json' }
      }).then((res) => {
        if (res.data.status === 'OK') {
          this.$router.push('/blog/entry/' + this.article.id)
        }
      })
    }
  },
  head() {
    return {
      title: '修改博客：' + this.article.title
    }
  }
}
</script>
