<template>
  <v-container class="ma-0 pa-0">
    <v-tabs class="elevation-2">
      <v-tabs-slider></v-tabs-slider>

      <v-tab>
        按省
      </v-tab>
      <v-tab-item>
        <v-card flat tile>
          <v-card-text class="pa-2">
            <ChinaMap />
          </v-card-text>
        </v-card>
      </v-tab-item>

      <v-tab>
        按国家
      </v-tab>
      <v-tab-item>
        <v-card flat tile>
          <v-card-text class="pa-2">
            <WorldMap />
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>
<script>
import ChinaMap from '~/components/statistics/ChinaMap'
import WorldMap from '~/components/statistics/WorldMap'
export default {
  components: {
    ChinaMap,
    WorldMap
  },
  methods: {
    data() {
      return {}
    }
  }
}
</script>
