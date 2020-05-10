<template>
  <v-container>
    <v-row class="title" justify="end">
      <v-col cols="auto"> <v-icon>folder</v-icon> {{ title }} </v-col>
    </v-row>
    <v-divider class="my-2"></v-divider>
    <v-row
      v-for="article in pageInfo.list"
      :key="article.id"
      justify="space-between"
    >
      <v-col cols="12" lg="8" xl="8">
        <v-list-item nuxt :to="'/blog/entry/' + article.id" max-width="100%">
          <p class="article-title" v-text="article.title"></p>
        </v-list-item>
      </v-col>
      <v-col
        cols="auto"
        class="d-none d-lg-flex d-xl-flex"
        v-text="article.lastUpdateDate"
      ></v-col>
    </v-row>
    <v-row v-if="pageInfo.total === 0" class="ma-4" justify="center">
      该归档下还没有文章~
    </v-row>
    <v-row>
      <v-pagination
        v-if="pageInfo.pages > 1"
        v-model="pageNo"
        :circle="circle"
        :disabled="disabled"
        :length="pageInfo.pages"
        :next-icon="nextIcon"
        :prev-icon="prevIcon"
        :page="pageNo"
        :total-visible="totalVisible"
      ></v-pagination>
    </v-row>
  </v-container>
</template>

<script>
export default {
  /**
   * asyncData 检查该归档名称是否存在
   */
  async asyncData({ $axios, route, redirect }) {
    const title = route.params.title.trim()
    if (title === '') {
      redirect('/404')
    } else {
      // 如果不存在，会返回NOT-FOUND，从而会自动跳转到404
      await $axios.get(encodeURI(`/api/admin/archive/${title}`))
      return { title }
    }
  },
  data() {
    return {
      circle: false,
      disabled: false,
      length: 1,
      nextIcon: 'navigate_next',
      nextIcons: ['mdi-chevron-right', 'mdi-arrow-right', 'mdi-menu-right'],
      prevIcon: 'navigate_before',
      prevIcons: ['mdi-chevron-left', 'mdi-arrow-left', 'mdi-menu-left'],
      pageNo: 1,
      totalVisible: 5,
      pageSize: 4,
      pageInfo: {
        total: 1,
        pages: 0
      }
    }
  },
  watch: {
    pageNo() {
      this.getArticle()
    }
  },
  beforeMount() {
    this.getArticle()
  },
  methods: {
    getArticle() {
      this.$axios
        .get(
          `/api/admin/article/archive/${encodeURI(this.title)}/${this.pageNo}/${
            this.pageSize
          }`
        )
        .then((res) => {
          if (res.data.status === 'OK') {
            this.pageInfo = res.data.map.pageInfo
            this.handleDate()
          }
        })
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
      this.pageInfo.list.forEach((article) => {
        article.lastUpdateDate = new Intl.DateTimeFormat(
          'zh-CN',
          options
        ).format(new Date(article.lastUpdateDate))
      })
    }
  },
  head() {
    return {
      title: '归档详情: ' + this.title
    }
  }
}
</script>
