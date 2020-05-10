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
  <v-container>
    <v-row wrap justify="end" class="pr-3">
      <v-dialog v-model="dialog" max-width="500px" dense>
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="my-4" v-on="on"
            ><v-icon class="mr-2">add</v-icon>添加归档</v-btn
          >
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">添加归档</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row justify="center">
                <v-col cols="12">
                  <v-text-field
                    v-model="newArchive.title"
                    label="名称"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="newArchive.imgUrl"
                    label="图片"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="newArchive.order"
                    label="顺序"
                    readonly
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row justify="space-between">
      <ArchiveCard
        v-for="archive in archives"
        :key="archive.title"
        :archive="archive"
      />
    </v-row>
  </v-container>
</template>

<script>
import ArchiveCard from '~/components/ArchiveCard'
export default {
  components: {
    ArchiveCard
  },
  async asyncData({ $axios }) {
    const { data } = await $axios.get('/api/admin/archive')
    const archives = data.map.archives
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
      articleTotalCount: 0,
      dialog: false,
      newArchive: {
        title: '',
        imgUrl: ''
      }
    }
  },
  created() {
    this.newArchive.order = this.archives.length
  },
  methods: {
    close() {
      this.dialog = false
    },
    save() {
      const valid = this.validate()
      if (valid) {
        this.$axios({
          url: '/api/admin/archive',
          method: 'post',
          data: JSON.stringify(this.newArchive),
          headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
          if (res.data.status === 'OK') {
            this.$notifier.showMessage({
              content: '添加成功',
              color: 'success'
            })
            this.newArchive.articleNums = 0
            this.newArchive.articles = []
            this.archives.push(this.newArchive)
            this.newArchive = {}
          }
        })
      }
      this.close()
    },
    validate() {
      let err = ''
      this.newArchive.title = this.newArchive.title.trim()
      this.newArchive.imgUrl = this.newArchive.imgUrl.trim()
      if (this.newArchive.title === '') {
        err = '归档名称不能为空'
      } else if (this.newArchive.imgUrl === '') {
        err = '归档图片不能为空'
      }
      this.archives.forEach((archive) => {
        if (archive.title === this.newArchive.title) {
          err = `归档${archive.title}已存在`
        }
      })
      if (err.trim() !== '') {
        this.$notifier.showMessage({ content: err, color: 'error' })
        return false
      }
      return true
    }
  },
  head() {
    return {
      title: '归档列表'
    }
  }
}
</script>
