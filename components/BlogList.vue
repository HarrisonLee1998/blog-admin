<template>
  <v-container>
    <v-row wrap justify="space-between">
      <v-col cols="12" lg="7">
        <v-text-field
          v-model="keyword"
          color="blue darken-2"
          label="根据关键词搜索"
          required
          append-icon="search"
          @click:append="handleSearch"
        ></v-text-field>
        <v-card v-show="mode === 1" class="my-4">
          <v-card-title>搜索详情</v-card-title>
          <v-card-text>
            <p
              style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"
            >
              搜索关键词为: {{ keyword2 }}
            </p>
            <p
              style="display:flex;justify-content:space-between; align-items:center;"
            >
              <span
                >共 <strong>{{ pageUtil.total }}</strong
                >篇相关文章</span
              >
              <v-btn text @click="getArticles">重置搜索</v-btn>
            </p>
          </v-card-text>
        </v-card>
        <!--文章卡片-->
        <BlogCard
          v-for="(article, i) in pageUtil.list"
          :key="i"
          :article="article"
          :no="i"
          class="article-card"
        />
        <div class="text-center">
          <v-pagination
            v-model="pageNo"
            :value="pageNo"
            :length="pageUtil.pages"
            :total-visible="visiblePages"
          ></v-pagination>
        </div>
      </v-col>
    </v-row>
    <!--标题导航-->
    <v-row
      id="article-title-nav"
      :class="drawer ? 'title-nav-show' : 'title-nav-hidden'"
    >
      <v-col class="ma-0 pa-0">
        <v-list class="ma-0 pa-0" width="100%" height="100%" dense>
          <v-subheader>文章标题导航</v-subheader>
          <v-list-item
            v-for="(article, i) in pageUtil.list"
            :key="article.id"
            dense
            :href="'#item' + i"
          >
            <v-list-item-content v-html="article.title"></v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
    <v-icon id="article-list-icon" @click="drawer = !drawer">{{
      drawer ? 'clear' : 'reorder'
    }}</v-icon>
  </v-container>
</template>

<script>
import BlogCard from '~/components/BlogCard'
export default {
  components: {
    BlogCard
  },
  props: {
    normal: {
      type: Boolean,
      default: () => {
        return true
      }
    }
  },
  data() {
    return {
      pageUtil: {},
      mode: 0, // 0表示普通模式，1表示搜索
      pageNo: 1,
      pageSize: 5,
      visiblePages: 5,
      drawer: false,
      keyword: '',
      keyword2: '',
      unsubscribe: null
    }
  },
  watch: {
    pageNo() {
      this.handleMode()
    }
  },
  created() {
    this.unsubscribe = this.$store.subscribe((mutation, state) => {
      const type = mutation.type
      if (type === 'blog/setIsDelete' || type === 'blog/setDeleted') {
        if (this.pageUtil.list.length === 1) {
          this.pageNo--
        }
        this.handleMode()
      }
    })
  },
  beforeMount() {
    this.handleMode()
  },
  beforeDestroy() {
    this.unsubscribe()
  },
  methods: {
    getArticles() {
      if (this.mode === 1) {
        this.mode = 0
        this.pageNo = 1
        this.keyword = ''
      }
      let url = ''
      if (this.normal) {
        url = `/api/admin/article/${this.pageNo}/${this.pageSize}`
      } else {
        url = `/api/admin/article/recycle/${this.pageNo}/${this.pageSize}`
      }
      this.$axios.get(url).then((res) => {
        this.pageUtil = res.data.map.pageUtil
        this.handleDate()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
    },
    searchArticles() {
      if (this.mode === 0) {
        this.mode = 1
        this.pageNo = 1
      }
      let url = ''
      if (this.normal) {
        url = '/api/admin/article/search'
      } else {
        url = '/api/admin/article/recycle/search'
      }
      this.$axios
        .get(url, {
          params: {
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            keyword: this.keyword
          }
        })
        .then((res) => {
          this.pageUtil = res.data.map.pageUtil
          window.scrollTo({ top: 0, behavior: 'smooth' })
          this.keyword2 = this.keyword
        })
    },
    parseContent(html) {
      return html.replace(/<\/?[^>]*>/g, '')
    },
    handleSearch() {
      this.keyword = this.keyword.trim()
      let err = ''
      if (this.keyword === '') {
        err = '关键词不能为空串'
      } else {
        let array = this.keyword.split(' ')
        array = array.filter((x) => x.trim() !== '')
        array.forEach((x) => {
          if (x.length === 1 && x.charCodeAt() < 128) {
            err = '关键词中不能包含单个ascaii字符'
            return false
          }
        })
      }

      if (this.keyword.includes('/')) {
        err = "关键词中不能有字符'/'"
      }
      if (this.keyword.includes('\\')) {
        err = "关键词中不能有字符'\\'"
      }
      if (err.trim() !== '') {
        this.$notifier.showMessage({
          content: err,
          color: 'error'
        })
      } else {
        this.searchArticles()
      }
    },
    handleMode() {
      if (this.pageNo < 1) {
        this.pageNo = 1
      }
      if (this.mode === 0) {
        this.getArticles()
      } else {
        this.searchArticles()
      }
    },
    handleDate() {
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }
      this.pageUtil.list.forEach((article) => {
        article.post_date = new Intl.DateTimeFormat('zh-CN', options).format(
          new Date(article.post_date)
        )
        article.last_update_date = new Intl.DateTimeFormat(
          'zh-CN',
          options
        ).format(new Date(article.last_update_date))
        if (article.post_date !== article.last_update_date) {
          article.edited = true
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$navbar-height: 64px;

.article-card {
  margin-bottom: $navbar-height;
  background-color: inherit;
}

#article-list-icon {
  position: fixed;
  bottom: 50px;
  right: 0.5%;
  cursor: pointer;
  z-index: 999;
}

.v-toolbar__content {
  position: relative;
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
.v-list-item__content {
  display: inline;
}
</style>
