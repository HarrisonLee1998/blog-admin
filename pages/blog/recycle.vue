<template>
  <BlogList :normal="false" />
</template>

<script>
import BlogList from '~/components/BlogList'
export default {
  components: {
    BlogList
  },
  head() {
    return {
      title: '博客回收站'
    }
  }
}
</script>
