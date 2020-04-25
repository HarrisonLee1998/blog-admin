<template>
  <v-container>
    <client-only>
      <v-card>
        <v-data-table
          :headers="headers"
          :items="items"
          class="elevation-1"
          fixed-header
        >
          <!--
        加了外部分页就不能用搜索了
        :sort-by.sync="customSort"
        :custom-sort="customSort"
        @update:sort-by="updateSortBY"
        @update:sort-desc="updateSortDesc"
        :footer-props.sync="footerProps"
        :server-items-length="pageInfo.total"

          :footer-props.sync="footerProps"
          :loading="loading"
          loading-text="loading..."
          no-data-text="没有任何数据"
          must-sort
          :options.sync="options"
          :search="search"
          @pagination="handlePagination"
          @update:sort-by="customSort"
          @update:sort-desc="customSort"
          @click:row="updateTag"
      -->
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>标签</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on }">
                  <v-btn color="primary" dark class="mb-2" v-on="on"
                    >New Item</v-btn
                  >
                </template>
                <!-- <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.title"
                            label="名称"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.createDate"
                            label="创建日期"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.viewTimes"
                            label="点击次数"
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
                </v-card> -->
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.name"
                            label="Dessert name"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.calories"
                            label="Calories"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.fat"
                            label="Fat (g)"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.carbs"
                            label="Carbs (g)"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.protein"
                            label="Protein (g)"
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
            <v-icon small @click="deleteItem(item)">
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">Reset</v-btn>
          </template>
        </v-data-table>
      </v-card>
    </client-only>
  </v-container>
</template>

<script>
export default {
  async asyncData({ $axios, $moment }) {
    // const pageNo = 1
    // const pageSize = 10
    const { data } = await $axios.get(
      // `/api/admin/tag/${pageNo}/${pageSize}/articleNums/DESC`
      '/api/admin/tag'
    )
    // const pageInfo = data.map.pageInfo
    // return { pageInfo }
    return { tags: data.map.tags }
  },
  data() {
    return {
      headers: [
        // { text: 'id', value: 'id', searchable: true },
        { text: '标签名称', value: 'title', sortable: false, align: 'start' },
        { text: '创建日期', value: 'createDate' },
        { text: '点击次数', value: 'viewTimes' },
        { text: '文章数量', value: 'articleNums' }
      ],
      items: [],
      editedItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0
      },
      defaultItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0
      },
      editedIndex: -1,
      loading: false,
      dialog: false,
      footerProps: {
        showFirstLastPage: true,
        showCurrentPage: true,
        disableItemsPerPage: false,
        itemsPerPageOptions: [10, 20, 50, 100, -1]
      },
      options: {
        sortBy: ['articleNums'],
        sortDesc: [true]
      },
      sortBy: 'articleNums', // 排序字段编号 [0:createDate, 1:viewTimes, 2: articleNums]
      sortDesc: 'DESC', // 是否降序排序
      search: ''
    }
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },
  created() {
    // this.parsePageInfo(this.pageInfo)
    this.items = this.tags
  },
  methods: {
    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        this.desserts.push(this.editedItem)
      }
      this.close()
    },
    editItem() {},
    handlePagination(newPagination) {
      /**
       * vuetify已经做了如下优化：
       * 当pageSize变化时，默认回到第一页
       */
      // const newPageNo = newPagination.page
      // const newPageSize = newPagination.itemsPerPage
      // const curPageNo = this.pageInfo.pageNum
      // const curPageSize = this.pageInfo.pageSize
      // if (newPageNo !== curPageNo || newPageSize !== curPageSize) {
      //   this.getTags(newPageNo, newPageSize)
      // }
    },
    getTags(pageNo, pageSize) {
      if (!this.validateParams(pageNo, pageSize)) {
        return
      }
      this.loading = true
      this.$axios
        .get(
          `/api/admin/tag/${pageNo}/${pageSize}/${this.sortBy}/${this.sortDesc}`
        )
        .then((res) => {
          this.parsePageInfo(res.data.map.pageInfo)
        })
    },
    parsePageInfo(pageInfo) {
      const pagination = {}
      pagination.page = pageInfo.pageNum
      pagination.itemsLength = pageInfo.total
      // const x = this.pageInfo.endRow - this.pageInfo.startRow + 1
      pagination.itemsPerPage = pageInfo.size
      pagination.pageStart = pageInfo.startRow - 1
      pagination.pageStop = pageInfo.endRow
      pagination.pageCount = pageInfo.pages
      this.footerProps.pagination = {}
      const footerProps = JSON.parse(JSON.stringify(this.footerProps))
      footerProps.pagination = pagination
      this.footerProps = footerProps
      this.loading = false
      pageInfo.list.forEach((tag) => {
        tag.createDate = this.$moment
          .tz(new Date(tag.createDate), 'Asia/ShangHai')
          .format('YYYY/MM/DD')
      })
      this.pageInfo = pageInfo
      if (process.client) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        })
      }
    },
    validateParams(pageNo, pageSize) {
      let err = ''
      if (pageNo === undefined) {
        err = '页码未定义'
      } else if (pageSize === undefined) {
        err = '页大小未定义'
      } else if (pageNo < 0 || pageNo > this.pageInfo.pages) {
        err = '页号无效'
      }
      if (err !== '') {
        this.$notifier.showMessage({ content: err, color: 'error' })
        return false
      }
      return true
    },
    customSort() {
      this.options.sortBy.forEach((e) => {
        this.sortBy = e
      })
      this.options.sortDesc.forEach((e) => {
        if (e) {
          this.sortDesc = 'DESC'
        } else {
          this.sortDesc = 'ASC'
        }
      })
      this.getTags(1, this.pageInfo.size)
    },
    updateTag(item) {
      console.log(item)
    }
  }
}
</script>
