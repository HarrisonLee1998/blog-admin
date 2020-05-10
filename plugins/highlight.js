import Vue from 'vue'
// import '@/assets/css/markdown.css' // 引入代码高亮的css
import hljs from '@/static/highlight'

// 封装成一个指令
Vue.directive('highlight', (el) => {
  const blocks = el.querySelectorAll('pre code')
  blocks.forEach((block) => {
    hljs.highlightBlock(block)
  })
})
