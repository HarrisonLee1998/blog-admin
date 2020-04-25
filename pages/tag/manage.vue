<template>
  <v-container>
    <client-only>
      <v-card>
        <v-row justify="end">
          <v-col cols="12" sm="8" md="6" lg="4">
            <v-card-title>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
          </v-col>
        </v-row>
        <v-data-table
          :headers="headers"
          :items="tags"
          class="elevation-1"
          fixed-header
          :search="search"
          :footer-props.sync="footerProps"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>标签</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <v-card>
                  <v-card-title>
                    <span class="headline">修改标签名称</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row justify="center">
                        <v-col cols="12">
                          <v-text-field
                            v-model="newTag.title"
                            label="名称"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="newTag.createDate"
                            label="创建日期"
                            readonly
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="newTag.viewTimes"
                            label="点击次数"
                            readonly
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close"
                      >Cancel</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
          </template>
        </v-data-table>
      </v-card>
    </client-only>
  </v-container>
</template>

<script>
export default {
  async asyncData({ $axios, $moment }) {
    const { data } = await $axios.get('/api/admin/tag')
    const tags = data.map.tags
    tags.forEach((t) => {
      t.createDate = $moment
        .tz(new Date(t.createDate), 'Asia/ShangHai')
        .format('YYYY/MM/DD')
    })
    return { tags: data.map.tags }
  },
  data() {
    return {
      headers: [
        { text: '标签名称', value: 'title', sortable: false, align: 'start' },
        { text: '创建日期', value: 'createDate' },
        { text: '点击次数', value: 'viewTimes' },
        { text: '文章数量', value: 'articleNums' },
        { text: '修改名称', value: 'actions', sortable: false }
      ],
      editedItem: {},
      newTag: {},
      dialog: false,
      footerProps: {
        showFirstLastPage: true,
        showCurrentPage: true,
        disableItemsPerPage: false,
        itemsPerPageOptions: [5, 10, 20, 50, 100, -1]
      },
      search: ''
    }
  },
  methods: {
    close() {
      this.dialog = false
    },
    save() {
      if (this.newTag.title.trim() === '') {
        this.$notifier.showMessage({
          content: '标签名称不能为空',
          color: 'error'
        })
        return
      }
      this.newTag.createDate = null // 避免后端序列化错误，和稀泥的做法
      this.close()
      this.$axios({
        url: '/api/admin/tag',
        method: 'patch',
        data: JSON.stringify(this.newTag),
        headers: { 'Content-Type': 'application/json' }
      }).then((res) => {
        if (res.data.status === 'OK') {
          this.$notifier.showMessage({ content: '修改成功', color: 'success' })
          this.editedItem.title = this.newTag.title
        }
      })
    },
    editItem(item) {
      this.editedItem = item
      this.newTag = JSON.parse(JSON.stringify(item))
      this.dialog = true
    }
  }
}
</script>
