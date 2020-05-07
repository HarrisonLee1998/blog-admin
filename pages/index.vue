<template>
  <v-container fluid class="ma-0 pa-0">
    <v-row justify="space-between" align="center">
      <v-col cols="12" lg="6" class="ma-0 pa-0">
        <Archive />
      </v-col>
      <v-col cols="12" lg="6" class="ma-0 pa-0">
        <PVTrend />
      </v-col>
      <v-col cols="12" lg="6" class="ma-0 pa-0">
        <UVTrend />
      </v-col>
      <v-col cols="12">
        <Visitor />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import Archive from '~/components/statistics/Archive'
import PVTrend from '~/components/statistics/PVTrend'
import UVTrend from '~/components/statistics/UVTrend'
import Visitor from '~/components/statistics/Visitor'
export default {
  components: {
    Archive,
    PVTrend,
    UVTrend,
    Visitor
  }
}
</script>
