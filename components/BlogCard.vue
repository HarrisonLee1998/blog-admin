<template>
  <v-container class="pa-0">
    <v-card :id="'item' + no" max-height="500" hover>
      <v-card-title
        ><nuxt-link
          class="article-title"
          :to="'/blog/entry/' + article.id"
          v-html="article.title"
        ></nuxt-link
      ></v-card-title>
      <v-card-text>
        <!--文章信息-->
        <BlogInfo :article="article"></BlogInfo>
        <p
          class="article-content"
          v-html="
            article.pure_txt ? article.pure_txt : parseContent(article.html)
          "
        ></p>
      </v-card-text>
      <v-row justify="end">
        <v-card-actions>
          <!-- <v-btn
            outlined
            fab
            small
            color="primary"
            title="修改文章"
            :href="'/blog/modify/' + article.id"
            ><v-icon>edit</v-icon></v-btn
          >
          <v-btn outlined fab small color="red" title="加入回收站" class="mx-4"
            ><v-icon>delete</v-icon></v-btn
          > -->
          <v-btn text @click="handleAction">action</v-btn>
        </v-card-actions>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import BlogInfo from './BlogInfo'
export default {
  components: {
    BlogInfo
  },
  props: {
    article: {
      type: Object,
      required: true
    },
    no: {
      type: Number,
      required: true
    }
  },
  methods: {
    parseContent(html) {
      return html.replace(/<\/?[^>]*>/g, '')
    }
  }
}
</script>

<style lang="scss" scoped>
.article-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: inherit;
  text-decoration: none;
}

.article-title:hover {
  text-decoration: underline;
}

.article-content {
  max-height: 500px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
}
</style>
