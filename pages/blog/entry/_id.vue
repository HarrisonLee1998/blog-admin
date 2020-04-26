<template>
  <div>
    <div v-html="article.html"></div>
  </div>
</template>

<script>
export default {
  async asyncData({ $axios, redirect, route }) {
    const id = route.params.id.trim()
    if (id && id.length !== 12) {
      redirect('/404')
    } else {
      const { data } = await $axios.get(`/api/admin/article/entry/${id}`)
      return { article: data.map.article }
    }
  },
  head() {
    return {
      title: this.article.title
    }
  }
}
</script>
