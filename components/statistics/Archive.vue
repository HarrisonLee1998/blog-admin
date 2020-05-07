<template>
  <v-container fluid class="mt-1">
    <v-row justify="center">
      <div id="archive"></div>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      options: {
        title: {
          text: '各归档文章数量',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          // orient: 'vertical',
          left: 'center',
          top: 'bottom',
          data: []
        },
        series: {
          name: '归档及其文章数量',
          type: 'pie',
          radius: [20, 110],
          center: ['50%', '50%'],
          roseType: 'radius',
          label: {
            show: true
          },
          emphasis: {
            label: {
              show: true
            }
          },
          data: []
        }
      }
    }
  },
  watch: {
    isDark() {
      this.echartsRender()
    }
  },
  mounted() {
    this.getArchiveData()
  },
  methods: {
    getArchiveData() {
      this.$axios.get('/api/admin/archive/article/count').then((res) => {
        if (res.data.status === 'OK') {
          this.parseData(res.data.map.archives)
          this.echartsRender()
        }
      })
    },
    parseData(archives) {
      archives.forEach((archive) => {
        const arc = { name: archive.title, value: archive.articleNums }
        this.options.series.data.push(arc)
        this.options.legend.data.push(archive.title)
      })
    },
    echartsRender() {
      const archive = this.$echarts.init(
        document.getElementById('archive'),
        this.isDark ? 'dark' : 'macarons'
      )
      archive.setOption(this.options)
    }
  }
}
</script>

<style scoped>
#archive {
  width: 580px;
  height: 400px;
}
</style>
