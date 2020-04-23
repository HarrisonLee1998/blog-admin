<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-text-field v-model="blog.title" label="文章标题"></v-text-field>
        <Editor
          id="editor-wrapper"
          :doc="blog.markdown"
          @getContent="getContent"
        />
        <!-- <div id="test" style="box-shadown:none;" v-html="blog.html"></div> -->
      </v-col>
    </v-row>
    <v-row justify="space-between" justify-md="end">
      <v-btn class="ma-2" outlined color="indigo" @click="dialog = true"
        >发布文章</v-btn
      >
      <v-btn class="ma-2">保存为草稿</v-btn>
    </v-row>
    <v-dialog v-model="dialog" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">文章属性设置</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-select
                v-model="blog.archiveTitle"
                :items="archives"
                label="归档"
              ></v-select>
            </v-row>
            <v-row>
              <v-text-field
                v-model="tagStr"
                label="标签"
                hint="以’#‘分隔"
                @blur="handleTags"
              ></v-text-field>
            </v-row>
            <v-row>
              <v-col>
                <v-checkbox v-model="isOpen" label="是否公开"></v-checkbox>
              </v-col>
              <v-col>
                <v-checkbox v-model="isReward" label="是否打赏"></v-checkbox>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">取消</v-btn>
          <v-btn color="blue darken-1" text @click="ok">发布</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div id="test" style="box-shadown:none;" v-html="blog.html"></div>
  </v-container>
</template>

<script>
import Editor from '@/components/Editor.vue'

export default {
  components: {
    Editor
  },
  data() {
    return {
      blog: {
        title: '',
        markdown: '',
        html: '',
        archiveTitle: '',
        tags: []
      },
      dialog: false,
      tagStr: '',
      archives: [],
      isOpen: true,
      isReward: false
    }
  },
  mounted() {
    this.getArchivesFromStore()
  },
  methods: {
    getContent(markdown, html) {
      this.blog.markdown = markdown
      this.blog.html = html
      // this.catalog()
    },
    catalog() {
      const tocs = this.blog.html.match(/<[hH][1-6]>.*?<\/[hH][1-6]>/g)
      if (tocs) {
        tocs.forEach((item, index) => {
          const _toc = `<div name='toc-title' id='header${index}'>${item} </div>`
          // console.log(_toc)
          this.html = this.html.replace(item, _toc)
        })
      }
    },
    clearBlog() {
      this.isOpen = true
      this.isReward = false
      this.tagStr = ''
      this.blog = {
        title: '',
        archiveTitle: 'Select',
        tags: []
      }
      this.$set(this.blog, 'markdown', '')
    },
    ok() {
      const isValid = this.validate()
      if (!isValid) {
        return
      }
      this.blog.title = this.blog.title.trim()
      this.blog.isOpen = this.isOpen ? 1 : 0
      this.blog.isReward = this.isReward ? 1 : 0
      this.$axios({
        url: '/api/admin/article',
        method: 'post',
        data: JSON.stringify(this.blog),
        headers: { 'Content-Type': 'application/json' }
      }).then((res) => {
        if (res.data.status === 'OK') {
          // 弹出成功消息
          this.$notifier.showMessage({ content: '发布成功', color: 'success' })
          this.clearBlog()
        } else {
          // 弹出错误消息
          this.$notifier.showMessage({ content: '发布失败', color: 'error' })
        }
      })
    },
    handleTags() {
      const ts = this.tagStr.split('#')
      let rs = ts.filter((t) => t.trim() !== '')
      rs = rs.map((t) => t.trim())
      this.blog.tags = rs
    },
    validate() {
      let err = ''
      if (this.blog.title.trim() === '') {
        err = '文章标题不能为空'
      } else if (this.blog.markdown.trim() === '') {
        err = '文章内容不能为空'
      } else if (
        this.blog.archiveTitle === undefined &&
        this.blog.archiveTitle.trim() === ''
      ) {
        err = '文章归档不能为空'
      } else if (this.blog.tags.length === 0) {
        err = '文章标签不能为空'
      }
      if (err !== '') {
        // 弹出错误消息
        this.$notifier.showMessage({ content: err, color: 'error' })
        return false
      } else {
        return true
      }
    },
    cancel() {},
    getArchivesFromStore() {
      const archives = this.$store.getters['archive/getArchives']
      if (archives === undefined || archives.length === 0) {
        this.getArchivesFromServer()
      } else {
        archives.forEach((a) => {
          this.archives.push(a.title)
        })
      }
    },
    getArchivesFromServer() {
      this.$axios.get('/api/admin/archive').then((res) => {
        res.data.map.archives.forEach((a) => {
          this.archives.push(a.title)
        })
        this.$store.commit('archive/setArchives', res.data.map.archives)
      })
    }
  }
}
</script>

//
<style lang="css">
textarea,
pre {
  -moz-tab-size: 4;
  -o-tab-size: 4;
  tab-size: 4;
}
</style>
