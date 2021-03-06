// const colors = require('vuetify/es5/util/colors').default

module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    // titleTemplate: '%s - ' + process.env.npm_package_name,
    titleTemplate: '%s - ' + 'blog-admin',
    // title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      // {
      //   rel: 'stylesheet',
      //   href:
      //     'https://cdn.bootcss.com/github-markdown-css/4.0.0/github-markdown.min.css'
      // },
      {
        rel: 'stylesheet',
        href:
          'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.0.0/styles/solarized-light.min.css'
      },
      {
        rel: 'stylesheet',
        href: 'https://cdn.bootcdn.net/ajax/libs/KaTeX/0.11.1/katex.min.css'
      },
      {
        rel: 'stylesheet',
        href:
          'https://cdn.jsdelivr.net/npm/material-design-icons-iconfont@5.0.1/dist/material-design-icons.min.css'
      }
    ],
    script: [
      { src: 'https://cdn.bootcdn.net/ajax/libs/KaTeX/0.11.1/katex.min.js' }
    ]
  },
  server: {
    host: '0.0.0.0',
    port: '3001'
  },
  /*
   ** Customize the progress-bar color
   */
  loading: '~/components/Loading.vue',
  /*
   ** Global CSS
   */
  css: [
    '@/assets/css/main.css',
    // '@/assets/css/animate.css',
    '@/assets/css/scrollbar.css',
    '@/assets/css/route.css'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/axios',
    // '@/plugins/icons',
    '@/plugins/notifier',
    '@/plugins/highlight'
    // '@/plugins/katex',
    // '@/plugins/echarts'
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
    // '@nuxtjs/moment'
  ],
  moment: {
    defaultTimezone: 'Asia/Shanghai'
  },
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth'
    // 'cookie-universal-nuxt'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    proxy: true,
    retry: false,
    credentials: true
  },
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8080/blog',
      pathRewrite: {
        '^/api': '/'
      }
    }
  },
  /**
   * 自定义渲染页面的运行时选项
   */
  render: {
    /**
     * 激活 HTTP2 push headers.
     */
    http2: {
      push: true
    }
  },
  /**
   * 路由属性配置
   */
  router: {
    middleware: ['auth'], // device
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'custom',
        path: '*',
        component: resolve(__dirname, 'pages/404.vue')
      })
    }
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/api/admin/login',
            method: 'post',
            propertyName: 'map.token'
          },
          logout: { url: '/api/admin/logout', method: 'post' },
          user: {
            url: '/api/auth/user',
            method: 'get',
            propertyName: 'map.user'
          }
        },
        tokenRequired: true,
        tokenType: 'bearer',
        autoFetchUser: true
      }
    },
    redirect: {
      login: '/login',
      logout: '/login',
      home: '/'
    }
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    options: {
      customProperties: true
    },
    // theme: {
    //   disable: true,
    //   dark: true,
    //   themes: {
    //     dark: {
    //       primary: colors.blue.darken2,
    //       accent: colors.grey.darken3,
    //       secondary: colors.amber.darken3,
    //       info: colors.teal.lighten1,
    //       warning: colors.amber.base,
    //       error: colors.deepOrange.accent4,
    //       success: colors.green.accent3
    //     }
    //   }
    // }
    optionsPath: './vuetify.options.js'
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    optimization: {
      splitChunks: {
        chunks: 'all',
        automaticNameDelimiter: '.',
        maxAsyncRequests: 7,
        cacheGroups: {
          vuetify: {
            test: /node_modules[\\/]vuetify/,
            chunks: 'all',
            priority: 20,
            name: true
          },
          echarts: {
            test: /node_modules[\\/]echarts/,
            chunks: 'all',
            priority: 20,
            name: true
          }
        }
      }
    },
    extend(config, ctx) {}
    // analyze: true
    // assetFilter(assetFilename) {
    //   return assetFilename.endsWith('.js')
    // }
  }
}
