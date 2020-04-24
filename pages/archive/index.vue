<template>
  <!-- <ssr-only>
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
          <v-expansion-panel
            v-for="archive in archives"
            :key="archive.title"
            aria-expanded="true"
          >
            <v-expansion-panel-header
              v-text="archive.title + '(' + archive.articles.length + ')'"
            ></v-expansion-panel-header>
            <v-expansion-panel-content v-if="archive.articles.length > 0">
              <v-row v-for="article in archive.articles" :key="article.id"
                ><nuxt-link
                  :to="'/blog/archive/' + article.id"
                  class="archive-content article-link"
                  v-text="article.title"
                ></nuxt-link>
              </v-row>
            </v-expansion-panel-content>
            <v-expansion-panel-content v-else>
              <v-row class="archive-content empty">什么也没有~</v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>
    </v-container>
  </ssr-only> -->
  <!-- <v-container>
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
        <v-expansion-panel
          v-for="archive in archives"
          :key="archive.title"
          aria-expanded="true"
        >
          <v-expansion-panel-header
            v-text="archive.title + '(' + archive.articles.length + ')'"
          ></v-expansion-panel-header>
          <v-expansion-panel-content v-if="archive.articles.length > 0">
            <v-row
              v-for="article in archive.articles"
              :key="article.id"
              class="archive-content article-link"
              ><nuxt-link
                :to="'/blog/archive/' + article.id"
                v-text="article.title"
              ></nuxt-link>
            </v-row>
          </v-expansion-panel-content>
          <v-expansion-panel-content v-else>
            <v-row class="archive-content empty">什么也没有~</v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </v-container> -->
  <v-row wrap justify="center">
    <v-col
      v-for="archive in archives"
      :key="archive.title"
      lg="5"
      sm="6"
      cols="12"
    >
      <v-card outlined raised>
        <v-card-title
          ><v-icon class="mr-2">folder</v-icon>{{ archive.title }}</v-card-title
        >
        <v-list-item
          v-for="article in archive.articles"
          :key="article.id"
          dense
          nuxt
          :to="'/blog/entry/' + article.id"
        >
          <p class="article-title">{{ article.title }}</p>
        </v-list-item>
        <v-card-text v-if="archive.articles.length === 0"
          >什么也没有~
        </v-card-text>
        <v-card-actions v-if="archive.articleNums > 5">
          <v-row justify="end" class="pr-2">
            <v-btn text depressed nuxt :to="'/archive/' + archive.title"
              >More&gt;&gt;</v-btn
            >
          </v-row>
        </v-card-actions>
      </v-card>
    </v-col>
    <!-- <div id="archive-overview">
      共有{{ archives.length }}个归档，{{ articleTotalCount }}篇文章
    </div>
    <div v-for="archive in archives" :key="archive.title" class="archive">
      <div class="archive-title">
        <v-icon class="mr-2">folder</v-icon>{{ archive.title }}({{
          archive.articles.length
        }})
      </div>
      <ul class="archive-content">
        <li v-for="article in archive.articles" :key="article.id">
          <nuxt-link :to="'/article/entry/' + article.id" class="article-link">
            {{ article.title }}
          </nuxt-link>
        </li>
      </ul>
    </div> -->
  </v-row>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    const { data } = await $axios.get('/api/admin/archive')
    let archives = data.map.archives
    archives = archives.sort((x, y) => y.articles.length - x.articles.length)
    archives.forEach((a) => {
      a.articleNums = a.articles.length
      if (a.articleNums > 5) {
        a.articles = a.articles.slice(0, 5)
      }
    })
    return { archives }
  },
  data() {
    return {
      panel: [0],
      accordion: false,
      popout: false,
      inset: false,
      multiple: false,
      disabled: false,
      readonly: false,
      focusable: true,
      flat: false,
      hover: true,
      tile: false,
      articleTotalCount: 0
    }
  },
  created() {
    this.archives.forEach((a) => {
      this.articleTotalCount += a.articles.length
    })
  },
  methods: {}
}
</script>
