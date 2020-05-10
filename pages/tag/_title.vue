<template>
  <v-container>
    <v-row class="title" justify="end">
      <v-col cols="auto"> <v-icon>local_offer</v-icon> {{ title }} </v-col>
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
      该标签下还没有文章~
    </v-row>
    <v-row>
      <v-pagination
        v-if="pageInfo.pages > 1"
        v-model="page"
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
  async asyncData({ $axios, route, redirect }) {
    const title = route.params.title.trim()
    if (title === '') {
      redirect('/404')
    } else {
      // 分页大小为10条数据
      await $axios.get(`/api/admin/tag/test/${encodeURI(title)}`)
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
      totalVisible: 1,
      pageSize: 10,
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
          `/api/admin/article/tag/${encodeURI(this.title)}/${this.pageNo}/${
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
      title: '标签详情: ' + this.title
    }
  }
}
</script>
