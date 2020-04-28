<template>
  <div class="article-info my-4">
    <p class="article-info-box">
      <span class="article-info-field"
        >归档:
        <span>
          <nuxt-link
            :to="/archive/ + parseContent(articleBak.archive_title)"
            class="article-archive-title"
            v-html="articleBak.archive_title"
          >
          </nuxt-link>
        </span>
      </span>
      <span class="article-info-field">
        标签:
        <span v-for="tag in articleBak.tags" :key="tag" class="mr-2">
          <nuxt-link
            :to="/tag/ + parseContent(tag)"
            class="article-tag"
            v-html="tag"
          >
          </nuxt-link>
        </span>
      </span>
    </p>
    <p class="article-info-box">
      <span class="article-info-field"
        >是否公开: {{ articleBak.is_open > 0 ? '公开' : '隐私' }}</span
      >
      <span class="article-info-field"
        >打赏: {{ articleBak.is_reward > 0 ? '开启' : '关闭' }}</span
      >
      <span class="article-info-field">点赞: {{ articleBak.star }} 次</span>
      <span class="article-info-field"
        >查看过: {{ articleBak.view_times }}次</span
      >
    </p>
    <p class="article-info-box">
      <span>发布日期: {{ articleBak.post_date }}</span>
    </p>
    <p v-if="articleBak.edited" class="article-info-box">
      <span>上次修改日期: {{ articleBak.last_update_date }}</span>
    </p>
    <p class="class-info-box">
      <v-btn text class="px-0" @click="handleAction">actions</v-btn>
    </p>
    <v-dialog v-model="dialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">Actions</v-card-title>
        <v-card-subtitle v-html="articleBak.title"></v-card-subtitle>
        <v-card-text>
          <v-container>
            <v-row dense justify="space-between">
              <v-col cols="auto">
                <v-checkbox v-model="isOpen" label="公开"></v-checkbox>
              </v-col>
              <v-col cols="auto">
                <v-checkbox v-model="isDelete" label="回收站"></v-checkbox>
              </v-col>
            </v-row>
            <v-row dense justify="space-between">
              <v-col cols="auto">
                <v-checkbox v-model="isReward" label="打赏"></v-checkbox>
              </v-col>
            </v-row>
            <v-row dense justify="space-between">
              <v-col cols="auto">
                <v-btn
                  text
                  class="pa-2 pl-0"
                  color="primary"
                  :href="'/blog/modify/' + articleBak.id"
                  ><v-icon class="pr-1">edit</v-icon>Modify</v-btn
                >
              </v-col>
              <v-col v-if="articleBak.is_delete === 1" cols="auto">
                <v-btn text color="red" class="pa-2 pl-0" @click="handleDelete"
                  ><v-icon class="pr-1">delete</v-icon>Delete</v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text @click="dialog = false">
            取消
          </v-btn>

          <v-btn text @click="handleUpdate">
            保存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog2" max-width="400">
      <v-card>
        <v-card-title class="headline">确认删除文章</v-card-title>
        <v-card-text v-html="articleBak.title"></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="indigo" text @click="dialog2 = false">
            取消
          </v-btn>
          <v-btn color="red" text @click="deleteAction">
            删除
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dialog: false,
      dialog2: false,
      articleBak: {},
      isOpen: this.article.is_open,
      isDelete: this.article.is_delete,
      isReward: this.article.is_reward
    }
  },
  watch: {
    article: {
      handler() {
        this.articleBak = JSON.parse(JSON.stringify(this.article))
      },
      deep: true
    },
    articleBak: {
      handler() {},
      deep: true
    }
  },
  created() {
    this.articleBak = JSON.parse(JSON.stringify(this.article))
  },
  methods: {
    parseContent(html) {
      return html.replace(/<\/?[^>]*>/g, '')
      // return html.replace(/<[^>]+>/g, '')
    },
    handleAction() {
      this.dialog = true
    },
    handleUpdate() {
      this.updateAction()
    },
    updateAction() {
      this.$axios({
        url: '/api/admin/article',
        method: 'patch',
        data: {
          id: this.article.id,
          is_open: this.isOpen ? 1 : 0,
          is_delete: this.isDelete ? 1 : 0,
          is_reward: this.isReward ? 1 : 0
        },
        headers: { 'Content-Type': 'application/json' }
      }).then((res) => {
        if (res.data.status === 'OK') {
          this.dialog = false
          this.articleBak.is_open = this.isOpen ? 1 : 0
          this.articleBak.is_reward = this.isReward ? 1 : 0
          this.$notifier.showMessage({
            content: '修改保存成功',
            color: 'success',
            time: 1000
          })
          this.articleBak.is_delete = this.isDelete ? 1 : 0
          // 是否删除字段的操作会导致不同的行为，通过Vuex来实现
          if (this.article.is_delete !== this.articleBak.is_delete) {
            this.$store.commit('blog/setIsDelete', this.isDelete)
          }
        }
      })
    },
    handleDelete() {
      this.dialog = false
      this.dialog2 = true
    },
    /* */
    deleteAction() {
      this.$axios
        .delete('/api/admin/article', {
          params: {
            id: this.article.id
          }
        })
        .then((res) => {
          if (res.data.status === 'OK') {
            this.$notifier.showMessage({
              content: '删除成功',
              color: 'success',
              time: 1000
            })
            this.$store.commit('blog/setDeleted', true)
            this.dialog2 = false
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.article-info {
  font-size: 14px;
}
.article-info-box {
  margin-bottom: 2px;
}
.article-info-box > .article-info-field:not(:last-child) {
  border-right-width: 2px;
  border-right-style: solid;
  border-right-color: inherit;
  padding-right: 3px;
}

.article-archive-title,
.article-tag {
  color: inherit;
  text-decoration: none;
}
.article-archive-title:hover,
.article-tag:hover {
  text-decoration: underline;
}
</style>
