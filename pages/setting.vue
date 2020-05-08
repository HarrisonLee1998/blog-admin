<template>
  <v-container>
    <Upload />
    <v-tabs class="elevation-2">
      <v-tabs-slider></v-tabs-slider>
      <v-tab>
        前台设置
      </v-tab>
      <v-tab-item>
        <v-card flat tile>
          <v-card-text>
            一些前台设置
          </v-card-text>
        </v-card>
      </v-tab-item>

      <v-tab>
        后台设置
      </v-tab>
      <v-tab-item>
        <v-card flat tile>
          <v-card-text>
            一些后台设置
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
import Upload from '~/components/Upload'
export default {
  components: {
    Upload
  }
}
</script>
