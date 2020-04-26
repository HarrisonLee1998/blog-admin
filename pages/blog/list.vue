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
        <v-card
          v-for="(article, i) in pageUtil.list"
          :id="'item' + i"
          :key="article.id"
          class="article-card"
          max-height="500"
          hover
          :to="'/blog/entry/' + article.id"
        >
          <!-- :to="'/blog/entry/' + article.id"-->
          <v-card-title
            class="article-title"
            v-html="article.title"
          ></v-card-title>
          <v-card-text>
            <div class="article-info">
              <div>
                <span class="article-info-field">归档:</span>
                <span class="pr-4" v-html="article.archive_title"></span>
                <span class="article-info-field">标签:</span>
                <span
                  v-for="tag in article.tags"
                  :key="tag"
                  class="pr-2"
                  v-html="tag"
                ></span>
              </div>
            </div>
            <p
              class="article-content"
              v-html="
                article.pure_txt ? article.pure_txt : parseContent(article.html)
              "
            ></p>
          </v-card-text>
        </v-card>
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
    <v-row
      id="article-title-nav"
      :class="drawer ? 'title-nav-show' : 'title-nav-hidden'"
    >
      <v-col class="ma-0 pa-0">
        <v-list class="ma-0 pa-0" width="100%" height="100%" :dense="dense">
          <v-subheader>文章标题导航</v-subheader>
          <v-list-item
            v-for="(article, i) in pageUtil.list"
            :key="article.id"
            :dense="dense"
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
export default {
  data() {
    return {
      pageUtil: {},
      mode: 0, // 0表示普通模式，1表示搜索
      pageNo: 1,
      pageSize: 5,
      visiblePages: 5,
      drawer: false,
      dense: true,
      keyword: ''
    }
  },
  watch: {
    pageNo() {
      if (this.mode === 0) {
        this.getArticles()
      } else {
        this.searchArticles()
      }
    }
  },
  beforeMount() {
    this.getArticles()
  },
  methods: {
    getArticles() {
      this.mode = 0
      this.$axios
        .get(`/api/admin/article/${this.pageNo}/${this.pageSize}`)
        .then((res) => {
          this.pageUtil = res.data.map.pageUtil
          window.scrollTo({ top: 0, behavior: 'smooth' })
        })
    },
    searchArticles() {
      if (this.mode === 0) {
        this.mode = 1
        this.pageNo = 1
      }
      this.$axios
        .get('/api/admin/article/search', {
          params: {
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            keyword: this.keyword
          }
        })
        .then((res) => {
          this.pageUtil = res.data.map.pageUtil
          window.scrollTo({ top: 0, behavior: 'smooth' })
        })
    },
    parseContent(html) {
      return html.replace(/<\/?[^>]*>/g, '')
    },
    resetSearch() {
      this.mode = 0
      this.pageNo = 1
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
    }
  },
  head() {
    return {
      title: '文章列表'
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
.article-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: inherit;
}

.article-content {
  max-height: 500px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
}

#article-list-icon {
  position: fixed;
  bottom: 5%;
  right: 1%;
  cursor: pointer;
  z-index: 999;
}

.v-toolbar__content {
  position: relative;
}
#article-title-nav {
  width: 300px;
  height: calc(100vh, -$navbar-height);
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
.tag-title {
  display: inline;
}
</style>
