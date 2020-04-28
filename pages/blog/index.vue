<template>
  <BlogList />
</template>

<script>
import BlogList from '~/components/BlogList'
export default {
  components: {
    BlogList
  },
  head() {
    return {
      title: '博客列表'
    }
  }
}
</script>
