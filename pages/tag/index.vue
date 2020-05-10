<template>
  <div>
    <div id="tag-overview">共有{{ tags.length }}个标签</div>
    <div>
      <nuxt-link
        v-for="tag in tags"
        :key="tag.id"
        :to="'/tag/' + tag.title"
        class="tag-link"
        v-text="tag.title + '(' + tag.articleNums + ')'"
      ></nuxt-link>
      <!-- :class="isDark ? 'dark' : 'light'" -->
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    const { data } = await $axios.get('/api/admin/tag')
    return { tags: data.map.tags }
  },
  data() {
    return {
      isDark: false
    }
  },
  created() {
    // this.$store.subscribe((mutation, state) => {
    //   if (mutation.type === 'theme/toggleTheme') {
    //     this.isDark = state.theme.isDark
    //   }
    // })
  },
  head() {
    return {
      title: '标签列表'
    }
  }
}
</script>

<style scoped>
#tag-overview {
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  text-align: right;
  border-bottom: 1px solid #ccc;
  margin-bottom: 3%;
}
.tag-link {
  color: inherit;
}
a {
  display: inline-block;
  background-color: inherit;
  margin: 5px 2%;
  overflow-wrap: break-word;
  text-decoration: none;
  font-family: 'Microsoft YaHei';
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5rem;
}
a:hover {
  transform: scale(1.2);
  transition: all 0.3s linear;
}
</style>
