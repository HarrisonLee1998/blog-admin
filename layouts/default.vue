<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-img
        :aspect-ratio="16 / 9"
        src="https://cdn.harrisonlee.net/material.png"
      >
        <v-row align="center" class="lightbox white--text pa-2 fill-height">
          <v-col align="center">
            <v-list-item-avatar size="50%">
              <img src="https://cdn.harrisonlee.net/hl.jpg" />
            </v-list-item-avatar>
            <div class="subheading pink--text darken-2 title">
              Harrison Lee
            </div>
            <!-- <div class="body-1">
              Real peace, is not the absence of conflict; it's the absence of
              justice.
            </div> -->
          </v-col>
        </v-row>
      </v-img>
      <v-list>
        <!--:prepend-icon="item.action"-->
        <v-list-group
          v-for="item in items"
          :key="item.title"
          v-model="item.active"
          no-action
          :append-icon="item.items.length > 0 ? '$expand' : ''"
          :expand="true"
        >
          <template v-if="item.items.length > 0" v-slot:activator>
            <v-list-item-action>
              <v-icon v-text="item.action"></v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </template>

          <template v-else v-slot:activator>
            <v-list-item nuxt link exact :to="item.link" class="px-0">
              <v-list-item-action>
                <v-icon v-text="item.action"></v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>

          <v-list-item
            v-for="subItem in item.items"
            :key="subItem.title"
            nuxt
            link
            exact
            :to="subItem.link"
          >
            <v-list-item-content>
              <v-list-item-title v-text="subItem.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app height="64px">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <!-- <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn> -->
      <!-- <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>mdi-minus</v-icon>
      </v-btn>-->
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn icon @click.stop="isDark = !isDark">
        <v-icon v-show="!isDark">wb_sunny</v-icon>
        <v-icon v-show="isDark">nights_stay</v-icon>
      </v-btn>
    </v-app-bar>
    <!-- 路由切换区 -->
    <v-content>
      <v-container>
        <v-row align="center" justify="center">
          <nuxt />
        </v-row>
      </v-container>
    </v-content>
    <!-- 抽屉 -->
    <!-- <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->
    <!-- 其他内容 -->
    <!-- <v-container fluid>
      <v-switch v-model="isDark" label="Toggle dark them"></v-switch>
    </v-container> -->
    <Snackbar></Snackbar>
    <v-icon v-show="scrolled" id="back-to-up" @click="backToUp"
      >arrow_upward</v-icon
    >
  </v-app>
</template>

<script>
import Snackbar from '~/components/Snackbar.vue'
export default {
  components: { Snackbar },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          action: 'dashboard',
          title: '首页',
          link: '/',
          items: []
        },
        {
          action: 'edit',
          title: '博客',
          items: [
            { title: '写博客', link: '/blog/write' },
            { title: '查看博客', link: '/blog' },
            { title: '回收站', link: '/blog/recycle' }
          ]
        },
        {
          action: 'folder',
          title: '归档',
          link: '/archive',
          items: []
          // items: [
          //   { title: '查看归档', link: '/archive' },
          //   { title: '归档管理', link: '/archive/manage' }
          // ]
        },
        {
          action: 'local_offer',
          title: '标签',
          items: [
            { title: '查看标签', link: '/tag' },
            { title: '标签管理', link: '/tag/manage' }
          ]
        },
        {
          action: 'people',
          title: '关于',
          link: '/about',
          items: []
        }
        // {
        //   action: 'settings',
        //   title: '系统设置',
        //   items: [
        //     { title: '基本设置', no: '5-1' },
        //     { title: '前台设置', no: '5-1' },
        //     { title: '后台设置', no: '5-1' }
        //   ]
        // }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'blog-admin',
      isDark: false,
      timer: '',
      scrolled: false
    }
  },
  watch: {
    isDark() {
      // if (process.client) {
      //   this.$vuetify.theme.dark = this.isDark
      // }
      this.$vuetify.theme.dark = this.isDark
      this.$store.commit('theme/toggleTheme', this.isDark)
    }
  },
  beforeMount() {
    const date = new Date()
    const h = date.getHours()
    if (h > 18 || h < 7) {
      this.$vuetify.theme.dark = true
      this.isDark = true
    } else {
      this.$vuetify.theme.dark = false
      this.isDark = false
    }
  },
  mounted() {
    this.initEvent()
  },
  beforeDestroy() {},
  methods: {
    backToUp() {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    },
    initEvent() {
      window.addEventListener('scroll', () => {
        const height =
          document.body.scrollTop || document.documentElement.scrollTop
        if (height > 0) {
          this.scrolled = true
        } else {
          this.scrolled = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#back-to-up {
  position: fixed;
  bottom: 20px;
  right: 0.5%;
  cursor: pointer;
  z-index: 999;
}
</style>
