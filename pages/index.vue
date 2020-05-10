<template>
  <v-container fluid>
    <client-only>
      <v-row justify="space-between" align="center">
        <v-col cols="12" lg="6">
          <Archive />
        </v-col>
        <v-col cols="12" lg="6">
          <PVTrend />
        </v-col>
        <v-col cols="12" lg="6">
          <UVTrend />
        </v-col>
        <v-col cols="12">
          <Visitor />
        </v-col>
      </v-row>
    </client-only>
  </v-container>
</template>
<script>
import Archive from '~/components/statistics/Archive'
import PVTrend from '~/components/statistics/PVTrend'
import UVTrend from '~/components/statistics/UVTrend'
import Visitor from '~/components/statistics/Visitor'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
export default {
  components: {
    Archive,
    PVTrend,
    UVTrend,
    Visitor
  }
}
</script>
