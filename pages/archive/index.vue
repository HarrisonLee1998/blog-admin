<template>
  <v-container>
    <v-row>
      <v-expansion-panels
        v-model="panel"
        :accordion="accordion"
        :popout="popout"
        :inset="inset"
        :multiple="multiple"
        :focusable="focusable"
        :disabled="disabled"
        :readonly="readonly"
        :flat="flat"
        :hover="hover"
        :tile="tile"
      >
        <v-expansion-panel v-for="archive in archives" :key="archive.title">
          <v-expansion-panel-header
            v-text="archive.title + '(' + archive.articles.length + ')'"
          ></v-expansion-panel-header>
          <v-expansion-panel-content v-if="archive.articles.length > 0">
            <v-row v-for="article in archive.articles" :key="article.id">
              <a
                :href="'/blog/entry/' + article.id"
                justify-start
                class="article-link"
                v-text="article.title"
              ></a>
            </v-row>
          </v-expansion-panel-content>
          <v-expansion-panel-content v-else>
            <v-row class="empty">什么也没有~</v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </v-container>
</template>

<script>
export default {
  async fetch({ $axios, app }) {
    const { data } = await $axios.get('/api/admin/archive')
    app.store.commit('archive/setArchives', data.map.archives)
  },
  fetchOnServer: true,
  data() {
    return {
      panel: [0],
      archives: [],
      accordion: false,
      popout: false,
      inset: false,
      multiple: false,
      disabled: false,
      readonly: false,
      focusable: true,
      flat: false,
      hover: true,
      tile: false
    }
  },
  created() {
    this.getArchivesFromStore()
  },
  methods: {
    getArchivesFromStore() {
      const archives = this.$store.getters['archive/getArchives']
      if (archives === undefined || archives.length === 0) {
        this.getArchivesFromServer()
      } else {
        this.archives = archives
      }
    },
    getArchivesFromServer() {
      this.$axios.get('/api/admin/archive').then((res) => {
        this.archives = res.data.map.archives
        this.$store.commit('archive/setArchives', res.data.map.archives)
      })
    }
  }
}
</script>

<style scoped>
.article-link {
  text-decoration: none;
  color: inherit;
  padding: 10px;
}
.empty {
  padding: 10px;
  font-style: italic;
}
.article-link:hover {
  text-decoration: underline;
}
</style>
