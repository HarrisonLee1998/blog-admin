<template>
  <v-container class="pa-0">
    <v-row justify="space-between">
      <v-col cols="12" md="6" lg="4">
        <v-file-input
          v-model="file"
          label="File input"
          show-size
          class="my-0"
          prepend-icon="photo_camera"
          @change="uploadSingleFile"
        ></v-file-input>
      </v-col>
      <v-col cols="12" md="6" lg="8">
        <v-text-field
          id="file-addr-input"
          v-model="fileAddr"
          label="单击复制文件链接"
          readonly
          @mousedown="clipToBoard"
        ></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      qiniu_token: '',
      upload_url: 'https://upload.qiniup.com',
      cdn_url: 'https://cdn.harrisonlee.net/',
      file: undefined,
      fileAddr: '',
      timer: null
    }
  },
  beforeMount() {
    this.getQiniuUploadInfoFromStore()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    getQiniuUploadInfoFromStore() {
      const qiniu = this.$store.getters['qiniu/getQiniu']
      if (
        Object.keys(qiniu).length === 0 ||
        (Object.keys(qiniu).length > 0 &&
          // 定义超过50分钟，就重新获取token
          new Date().getTime() - new Date(qiniu.exprireDate) > 1000 * 60 * 50)
      ) {
        this.getQiniuUploadInfoFromServer()
      } else {
        this.qiniu_token = qiniu.token
        this.timer = setInterval(
          this.getQiniuUploadInfoFromServer,
          new Date().getTime() - new Date(qiniu.exprireDate).getTime()
        )
      }
    },
    getQiniuUploadInfoFromServer() {
      this.$axios.get('/api/admin/qiniu/token').then((res) => {
        if (res.data.status === 'OK') {
          this.qiniu_token = res.data.map.token
          const qiniu = {}
          qiniu.exprireDate = new Date()
          qiniu.token = res.data.map.token
          this.$store.commit('qiniu/setQiniu', qiniu)
          // 定义的50分钟
          this.timer = setInterval(
            this.getQiniuUploadInfoFromServer,
            1000 * 60 * 50
          )
        }
      })
    },
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
