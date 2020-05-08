<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="10" md="8" lg="7" xl="5">
        <div class="article-title mb-4" v-text="article.title"></div>
        <!-- <div class="article-info my-4">
          <p class="article-info-box">
            <span class="article-info-field"
              >归档:
              <span>
                <nuxt-link
                  :to="/archive/ + article.archive_title"
                  class="article-archive-title"
                  >{{ article.archive_title }}</nuxt-link
                >
              </span>
            </span>
            <span class="article-info-field">
              标签:
              <span v-for="tag in article.tags" :key="tag" class="mr-2"
                ><nuxt-link :to="/tag/ + tag" class="article-tag">{{
                  tag
                }}</nuxt-link></span
              >
            </span>
          </p>
          <p class="article-info-box">
            <span class="article-info-field"
              >是否公开: {{ article.is_open > 0 ? '公开' : '隐私' }}</span
            >
            <span class="article-info-field"
              >打赏: {{ article.is_reward > 0 ? '开启' : '关闭' }}</span
            >
            <span class="article-info-field">点赞: {{ article.star }} 次</span>
            <span class="article-info-field"
              >查看过: {{ article.view_times }}次</span
            >
          </p>
          <p class="article-info-box">
            <span>发布日期: {{ article.post_date }}</span>
          </p>
          <p v-if="article.edited" class="article-info-box">
            <span>上次修改日期: {{ article.last_update_date }}</span>
          </p>
        </div> -->
        <BlogInfo :article="article"></BlogInfo>
        <v-divider></v-divider>
        <div id="content" v-html="article.html"></div>
      </v-col>
    </v-row>
    <!--标题导航开始-->
    <v-row
      id="article-title-nav"
      :class="drawer ? 'title-nav-show' : 'title-nav-hidden'"
    >
      <v-col class="ma-0 pa-0">
        <v-list class="ma-0 pa-0" width="100%" height="100%" dense>
          <v-subheader>文章标题</v-subheader>
          <v-list-item
            v-for="(title, i) in titles"
            :key="i"
            dense
            hover
            :href="'#heading' + i"
          >
            <v-list-item-content v-text="title"></v-list-item-content>
          </v-list-item>
          <v-list-item v-if="titles.length === 0">没有内容~</v-list-item>
        </v-list>
      </v-col>
    </v-row>
    <v-icon id="title-list-icon" @click="drawer = !drawer">{{
      drawer ? 'clear' : 'reorder'
    }}</v-icon>
    <!--标题导航结束-->
  </v-container>
</template>

<script>
import BlogInfo from '~/components/BlogInfo'
export default {
  components: {
    BlogInfo
  },
  async asyncData({ $axios, redirect, route, $moment }) {
    const id = route.params.id.trim()
    if (id && id.length !== 12) {
      redirect('/404')
    } else {
      const { data } = await $axios.get(`/api/admin/article/entry/${id}`)
      const article = data.map.article
      let d = $moment(new Date(article.post_date), 'Asia/ShangHai').utc()
      article.post_date = $moment(d)
        .local()
        .format('YYYY/MM/DD HH:mm:ss')
      d = $moment(new Date(article.last_update_date), 'Asia/ShangHai').utc()
      article.last_update_date = $moment(d)
        .local()
        .format('YYYY/MM/DD HH:mm:ss')
      if (article.post_date === article.last_update_date) {
        article.edited = false
      } else {
        article.edited = true
      }
      return { article: data.map.article }
    }
  },
  data() {
    return {
      drawer: false,
      titles: [],
      unsubscribe: null
    }
  },
  mounted() {
    this.handleTitle()
  },
  created() {
    this.unsubscribe = this.$store.subscribe((mutation, state) => {
      const type = mutation.type
      if (type === 'blog/setDeleted') {
        this.$router.push('/blog/recycle')
      }
    })
  },
  beforeDestroy() {
    this.unsubscribe()
  },
  methods: {
    handleTitle() {
      const content = document.querySelector('#content')
      const h = /h|H[1-6]/g
      let i = 0
      content.childNodes.forEach((ele) => {
        if (h.test(ele.nodeName)) {
          ele.setAttribute('id', 'heading' + i)
          const titleText =
            i + 1 + '. ' + ele.innerHTML.replace(/<\/?[^>]*>/g, '')
          const titleId = 'heading' + i
          ele.setAttribute('id', titleId)
          this.titles.push(titleText)
          ++i
        }
      })
    }
  },
  head() {
    return {
      title: this.article.title
    }
  }
}
</script>

<style lang="scss" scoped>
$navbar-height: 64px;
#title-list-icon {
  position: fixed;
  bottom: 50px;
  right: 0.5%;
  cursor: pointer;
  z-index: 999;
}
.article-title {
  font-size: 20px;
  font-weight: bolder;
}

#article-title-nav {
  width: 300px;
  height: calc(100vh - 64px);
  overflow: auto;
  position: fixed;
  top: $navbar-height;
  bottom: 0;
  color: inherit;
  border-left: 1px solid #ccc;
  transition: all 0.3s;
}
.title-nav-show {
  right: 0;
}
.title-nav-hidden {
  right: -100%;
}
</style>

<style>
#content {
  margin-top: 64px;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  position: relative;
  margin-top: -64px;
  padding-top: 64px;
}
h1 {
  font-size: 18px;
}
h2 {
  font-size: 16px;
}
h3 {
  font-size: 14px;
}
h4,
h5,
h6 {
  font-size: 12px;
}
</style>
