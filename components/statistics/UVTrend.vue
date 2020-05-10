<template>
  <div id="uvTrend"></div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
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
      }
    }
  },
  mounted() {
    this.getPVTrend()
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
      const uvTrend = echarts.init(document.getElementById('uvTrend'))
      uvTrend.setOption(this.options)
    }
  }
}
</script>

<style scoped>
#uvTrend {
  width: 100%;
  height: 270px;
}
</style>
