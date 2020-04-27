<template>
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
      <span class="article-info-field">点赞: {{ article.star }} 次</span>
      <span class="article-info-field">查看过: {{ article.view_times }}次</span>
    </p>
    <p class="article-info-box">
      <span>发布日期: {{ article.post_date }}</span>
    </p>
    <p v-if="article.edited" class="article-info-box">
      <span>上次修改日期: {{ article.last_update_date }}</span>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  methods: {
    parseContent(html) {
      return html.replace(/<\/?[^>]*>/g, '')
      // return html.replace(/<[^>]+>/g, '')
    }
  }
}
</script>

<style lang="scss" scoped>
.article-info {
  font-size: 14px;
}
.article-info-box {
  margin-bottom: 2px;
}
.article-info-box > .article-info-field:not(:last-child) {
  border-right-width: 2px;
  border-right-style: solid;
  border-right-color: inherit;
  padding-right: 3px;
}

.article-archive-title,
.article-tag {
  color: inherit;
  text-decoration: none;
}
.article-archive-title:hover,
.article-tag:hover {
  text-decoration: underline;
}
</style>
