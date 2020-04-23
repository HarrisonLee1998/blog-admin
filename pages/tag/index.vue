<template>
  <v-container>
    <div class="text-center">
      <v-chip
        v-for="tag in tags"
        :key="tag.id"
        class="ma-2"
        color="secondary"
        link
        :href="'/tag/entry/' + tag.id"
        v-text="tag.title + '(' + tag.articleNums + ')'"
      >
      </v-chip>
    </div>
  </v-container>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    const { data } = await $axios.get('/api/admin/tag')
    return { tags: data.map.tags }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>
