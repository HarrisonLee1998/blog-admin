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
    <Upload class="my-2" />
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
      />
      <!-- :external-link="externalLink" 
            :ishijs="true"
        :code-style="codeStyle"-->
    </client-only>
  </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import Upload from '~/components/Upload'
export default {
  components: {
    mavonEditor,
    Upload
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
      isDark: false,
      markdown: this.doc
    }
  },
  watch: {
    doc(newVal) {
      this.markdown = newVal
    }
  },
  beforeMount() {
    this.isDark = this.$store.getters['theme/getTheme']
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'theme/toggleTheme') {
        this.isDark = state.theme.isDark
      }
    })
  },
  methods: {
    postContent(markdown, html) {
      this.$emit('getContent', markdown, html)
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
