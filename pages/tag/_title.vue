<template>
  <v-container>
    <v-row class="title" justify="end">
      <v-col cols="auto"> <v-icon>local_offer</v-icon> {{ title }} </v-col>
    </v-row>
    <v-divider class="my-2"></v-divider>
    <v-row
      v-for="article in pageInfo.list"
      :key="article.id"
      justify-space-between
    >
      <v-col cols="12" lg="8">
        <v-list-item nuxt :to="'/blog/entry/' + article.id" max-width="100%">
          <p class="article-title" v-text="article.title"></p>
        </v-list-item>
      </v-col>
      <v-col
        lg="2"
        class="d-none d-lg-flex d-xl-flex"
        :title="$moment(article.lastUpdateDate).format('YYYY/MM/DD HH:mm:ss')"
        v-text="$moment(article.lastUpdateDate).format('YYYY/MM/DD')"
      ></v-col>
    </v-row>
    <v-row>
      <v-pagination
        v-model="page"
        :circle="circle"
        :disabled="disabled"
        :length="length"
        :next-icon="nextIcon"
        :prev-icon="prevIcon"
        :page="page"
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
      const { data } = await $axios.get(`/api/admin/article/tag/${title}/1/10`)
      return { pageInfo: data.map.pageInfo, title }
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
      page: 1,
      totalVisible: 1,
      pageSize: 10
    }
  },
  methods: {
    getArticle() {
      this.$axios
        .get(
          `/api/admin/article/tag/${this.title}/${this.page}/${this.pageSize}`
        )
        .then((res) => {
          console.log(res)
        })
    }
  }
}
</script>
