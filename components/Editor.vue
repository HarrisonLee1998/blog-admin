/* eslint-disable prettier/prettier */
<template>
  <div id="editor">
    <!-- <v-row wrap justify-space-between>
      <v-col cols="12" sm="4" lg="3">
        <v-file-input
          v-model="file"
          label="File input"
          show-size
          dense
          class="my-0"
          @change="uploadSingleFile"
        ></v-file-input>
      </v-col>
      <v-col cols="12" sm="5" lg="6">
        <v-text-field
          id="file-addr-input"
          v-model="fileAddr"
          label="单击复制文件链接"
          readonly
          dense
          @mousedown="clipToBoard"
        ></v-text-field>
      </v-col>
      <v-col class="d-flex" cols="12" sm="3">
        <v-select
          v-model="codeStyle"
          :items="themes"
          label="code style(切换显示有延迟)"
          dense
        ></v-select>
      </v-col>
    </v-row> -->
    <div class="my-2">
      <v-btn @click="dialog = !dialog">附加设置</v-btn>
    </div>
    <client-only placeholder="Loading...">
      <mavonEditor
        id="mavon-editor"
        ref="md"
        v-model="markdown"
        :tab-size="tabSize"
        :toolbars-flag="true"
        :code-style="codeStyle"
        :subfield="false"
        :autofocus="false"
        :toolbars="markdownOption"
        :external-link="externalLink"
        :box-shadow="false"
        style="height: 500px;"
        :toolbars-background="isDark ? '#000' : '#fff'"
        :editor-background="isDark ? '#000' : '#fff'"
        :preview-background="isDark ? '#000' : '#fff'"
        :class="isDark ? 'dark' : 'light'"
        @change="postContent"
        @imgAdd="imgAdd"
        @imgDel="imgDel"
      />
      <!-- :external-link="externalLink" 
            :ishijs="true"
        :code-style="codeStyle"-->
    </client-only>
    <v-dialog v-model="dialog" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">编辑器附加设置</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-file-input
                v-model="file"
                label="File input"
                show-size
                class="my-0"
                @change="uploadSingleFile"
              ></v-file-input>
            </v-row>
            <v-row>
              <v-text-field
                id="file-addr-input"
                v-model="fileAddr"
                label="单击复制文件链接"
                readonly
                @mousedown="clipToBoard"
              ></v-text-field>
            </v-row>
            <v-row>
              <v-select
                v-model="codeStyle"
                :items="themes"
                label="code style(切换显示有延迟)"
              ></v-select>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false"
            >Close</v-btn
          >
          <v-btn color="blue darken-1" text @click="dialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
  components: {
    mavonEditor
  },
  props: {
    doc: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      codeStyle: 'solarized-light',
      tabSize: 4,
      markdownOption: {
        bold: false,
        italic: false, // 斜体
        header: false, // 标题
        underline: false, // 下划线
        strikethrough: false, // 中划线
        mark: false, // 标记
        superscript: false, // 上角标
        subscript: false, // 下角标
        quote: false, // 引用
        ol: false, // 有序列表
        ul: false, // 无序列表
        link: false, // 链接
        // imagelink: true, // 图片链接
        code: false, // code
        table: false, // 表格
        fullscreen: false, // 全屏编辑
        readmodel: false, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: false, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: false, // 左对齐
        aligncenter: false, // 居中
        alignright: false, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true // 预览
      },
      externalLink: {
        markdown_css() {
          // 这是你的markdown css文件路径
          // return 'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css';
          return 'https://cdn.bootcss.com/github-markdown-css/4.0.0/github-markdown.min.css'
          // return 'http://127.0.0.1:3001/github-markdown.css'
        },
        hljs_js() {
          // 这是你的hljs文件路径
          // return 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.18.1/highlight.min.js';
          return 'https://cdn.bootcss.com/highlight.js/9.18.1/highlight.min.js'
        },
        hljs_css(css) {
          // 这是你的代码高亮配色文件路径
          // return (
          //   'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.18.1/styles/' +
          //   css +
          //   '.min.css'
          // )
          // eslint-disable-next-line prettier/prettier
          return 'https://cdn.bootcss.com/highlight.js/9.18.1/styles/' + css + '.min.css'
        },
        hljs_lang(lang) {
          // 这是你的代码高亮语言解析路径
          // eslint-disable-next-line prettier/prettier
          return 'https://cdn.bootcss.com/highlight.js/9.18.1/languages/' + lang + '.min.js'
        },
        katex_css() {
          // 这是你的katex配色方案路径路径
          return 'https://cdn.bootcss.com/KaTeX/' + '0.11.1' + '/katex.min.css'
        },
        katex_js() {
          // 这是你的katex.js路径
          return 'https://cdn.bootcss.com/KaTeX/' + '0.11.1' + '/katex.min.js'
        }
      },
      themes: [
        'solarized-light',
        'solarized-dark',
        'atelier-sulphurpool-dark',
        'atelier-sulphurpool-light',
        'tomorrow-night-blue',
        'shades-of-purple',
        'gradient-dark'
      ],
      markdown: this.doc,
      qiniu_token: '',
      upload_url: 'https://upload.qiniup.com',
      cdn_url: 'https://cdn.harrisonlee.net/',
      file: undefined,
      fileAddr: '',
      timer: '',
      dialog: false,
      isDark: false
    }
  },
  watch: {
    doc(newVal) {
      this.markdown = newVal
    }
  },
  beforeMount() {
    this.getQiniuUploadInfoFromStore()
    this.isDark = this.$store.getters['theme/getTheme']
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'theme/toggleTheme') {
        this.isDark = state.theme.isDark
      }
    })
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  methods: {
    postContent(markdown, html) {
      this.$emit('getContent', markdown, html)
    },
    getQiniuUploadInfoFromStore() {
      // this.$store.commit('qiniu/removeQiniu')
      const qiniu = this.$store.getters['qiniu/getQiniu']
      if (
        Object.keys(qiniu).length === 0 ||
        (Object.keys(qiniu).length > 0 &&
          // 定义超过50分钟，就重新获取token
          new Date().getTime() - new Date(qiniu.exprireDate) > 3000)
      ) {
        this.getQiniuUploadInfoFromServer()
      } else {
        this.qiniu_token = qiniu.token
      }
    },
    getQiniuUploadInfoFromServer() {
      // this.$axios.get('/api/admin/qiniu').then((res) => {
      //   this.qiniu_token = res.data.map.token
      //   const qiniu = {}
      //   qiniu.exprireDate = new Date()
      //   qiniu.token = res.data.map.token
      //   this.$store.commit('qiniu/setQiniu', qiniu)
      //    请求成功后，设置定时器
      //   this.timer = setTimeout(this.getQiniuUploadInfoFromServer, 3000)
      // })
      this.qiniu_token =
        's2isdTfRNsqvGvE3ysU58S0UWCMRflkYhapdJTC2:oRwVSM1HHQOqEASHQ3DZB0P_fv8=:eyJzY29wZSI6ImhhcnJpc29uLWJsb2ciLCJkZWFkbGluZSI6MTU4NzU3NTMxOX0='
      const qiniu = {}
      qiniu.token = this.qiniu_token
      qiniu.exprireDate = new Date()
      this.$store.commit('qiniu/setQiniu', qiniu)
      this.timer = setTimeout(this.getQiniuUploadInfoFromServer, 3000)
    },
    imgAdd(pos, file) {},
    imgDel(filename) {},
    clipToBoard() {
      if (this.fileAddr.trim() === '') {
        return
      }
      const input = document.querySelector('#file-addr-input')
      input.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        this.$notifier.showMessage({
          content: '内容已复制到粘贴板',
          color: 'info'
        })
      } else {
        this.$notifier.showMessage({ content: '内容复制失败', color: 'error' })
      }
    },
    // 利用axios上传文件
    uploadSingleFile(file) {
      if (file === undefined) {
        return
      }
      const formdata = new FormData()
      formdata.append('file', file)
      formdata.append('token', this.qiniu_token)
      formdata.append('key', file.name)
      this.$axios({
        url: this.upload_url,
        method: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then((response) => {
        this.$notifier.showMessage({
          content: '文件上传成功',
          color: 'success'
        })
        this.fileAddr = this.cdn_url + response.data.key
        this.file = undefined
      })
    }
  }
}
</script>

<style>
#mavon-editor {
  z-index: 1;
}

.markdown-body .highlight pre,
.markdown-body pre {
  padding: 0 !important;
}

.dark {
  color: #fff;
}
.light {
  color: #000;
}

.v-note-wrapper,
.v-note-edit,
.auto-textarea-input {
  border: none !important;
  background-color: inherit !important;
  color: inherit !important;
}
/*加了过后，滚动条不正常*/
/* .content-input-wrapper {
  height: 100% !important;
} */
</style>
