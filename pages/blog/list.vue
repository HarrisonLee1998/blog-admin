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
              搜索关键词为: {{ keyword }}
            </p>
            <p
              style="display:flex;justify-content:space-between; align-items:center;"
            >
              <span
                >共 <strong>{{ pageUtil.total }}</strong
                >篇相关文章</span
              >
              <v-btn text @click="resetSearch">重置搜索</v-btn>
            </p>
          </v-card-text>
        </v-card>
        <!--文章卡片-->
        <!-- <v-card
          v-for="(article, i) in pageUtil.list"
          :id="'item' + i"
          :key="article.id"
          class="article-card"
          max-height="500"
          hover
        >
          <v-card-title
            ><nuxt-link
              class="article-title"
              :to="'/blog/entry/' + article.id"
              v-html="article.title"
            ></nuxt-link
          ></v-card-title>
          <v-card-text>
            <div class="article-info my-4">
              <p class="article-info-box">
                <span class="article-info-field"
                  >归档:
                  <span>
                    <nuxt-link
                      :to="/archive/ + parseContent(article.archive_title)"
                      class="article-archive-title"
                      v-html="article.archive_title"
                    >
                    </nuxt-link>
                  </span>
                </span>
                <span class="article-info-field">
                  标签:
                  <span v-for="tag in article.tags" :key="tag" class="mr-2">
                    <nuxt-link
                      :to="/tag/ + parseContent(tag)"
                      class="article-tag"
                      v-html="tag"
                    >
                    </nuxt-link>
                  </span>
                </span>
              </p>
              <p class="article-info-box">
                <span class="article-info-field"
                  >是否公开: {{ article.is_open > 0 ? '公开' : '隐私' }}</span
                >
                <span class="article-info-field"
                  >打赏: {{ article.is_reward > 0 ? '开启' : '关闭' }}</span
                >
                <span class="article-info-field"
                  >点赞: {{ article.star }} 次</span
                >
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
            </div>
            <p
              class="article-content"
              v-html="
                article.pure_txt ? article.pure_txt : parseContent(article.html)
              "
            ></p>
          </v-card-text>
          <v-row justify="end">
            <v-card-actions>
              <v-btn
                outlined
                fab
                small
                color="primary"
                title="修改文章"
                :href="'/blog/modify/' + article.id"
                ><v-icon>edit</v-icon></v-btn
              >
              <v-btn
                outlined
                fab
                small
                color="red"
                title="加入回收站"
                class="mx-4"
                ><v-icon>delete</v-icon></v-btn
              >
            </v-card-actions>
          </v-row>
        </v-card> -->
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
  data() {
    return {
      pageUtil: {},
      mode: 0, // 0表示普通模式，1表示搜索
      pageNo: 1,
      pageSize: 5,
      visiblePages: 5,
      drawer: false,
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
      // return html.replace(/<[^>]+>/g, '')
    },
    resetSearch() {
      this.mode = 0
      this.pageNo = 1
      this.keyword = ''
      this.getArticles()
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
// .article-title {
//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: nowrap;
//   color: inherit;
//   text-decoration: none;
// }

// .article-title:hover {
//   text-decoration: underline;
// }

// .article-content {
//   max-height: 500px;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   display: -webkit-box;
//   -webkit-box-orient: vertical;
//   -webkit-line-clamp: 5;
// }

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

// .v-list-item__content {
//   display: inline;
// }
// .tag-title {
//   display: inline;
// }
// .article-info {
//   font-size: 14px;
// }
// .article-info-box {
//   margin-bottom: 2px;
// }
// .article-info-box > .article-info-field:not(:last-child) {
//   border-right-width: 2px;
//   border-right-style: solid;
//   border-right-color: inherit;
//   padding-right: 3px;
// }

// .article-archive-title,
// .article-tag {
//   color: inherit;
//   text-decoration: none;
// }
// .article-archive-title:hover,
// .article-tag:hover {
//   text-decoration: underline;
// }
</style>
