<template>
  <v-container fluid class="mt-1">
    <v-row justify="center">
      <div id="uvTrend"></div>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      options: {
        title: { text: 'Unique Visitor Trend' },
        tooltip: {},
        xAxis: {
          name: '日期',
          data: [],
          axisLabel: {
            interval: 0,
            rotate: 50
          }
        },
        yAxis: {
          name: '访问量'
        },
        series: {
          type: 'line',
          data: [],
          areaStyle: {}
        }
      },
      isDark: false
    }
  },
  watch: {
    isDark() {
      this.echartsRender()
    }
  },
  mounted() {
    this.getPVTrend()
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'theme/toggleTheme') {
        this.isDark = state.theme.isDark
      }
    })
  },
  methods: {
    getPVTrend() {
      this.$axios.get('/api/admin/trend/uv/weekly').then((res) => {
        this.parseTrend(res.data.map.trend)
        this.echartsRender()
      })
    },
    parseTrend(trend) {
      trend = JSON.parse(trend)
      const date = trend.result.items[0]
      const pv = trend.result.items[1]
      const len = date.length
      for (let i = 0; i < len; ++i) {
        this.options.xAxis.data.push(date[i][0])
        this.options.series.data.push(pv[i][0])
      }
    },
    echartsRender() {
      const uvTrend = this.$echarts.init(
        document.getElementById('uvTrend'),
        this.isDark ? 'dark' : 'macarons'
      )
      uvTrend.setOption(this.options)
    }
  }
}
</script>

<style scoped>
#uvTrend {
  width: 480px;
  height: 270px;
  overflow: hidden;
}
</style>
