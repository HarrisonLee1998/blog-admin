<template>
  <div id="archive"></div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
export default {
  data() {
    return {
      options: {
        title: {
          text: '各归档文章数量',
          left: 'left'
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
  mounted() {
    this.getArchiveData()
  },
  methods: {
    getArchiveData() {
      this.$axios.get('/api/admin/archive').then((res) => {
        if (res.data.status === 'OK') {
          this.parseData(res.data.map.archives)
          this.echartsRender()
        }
      })
    },
    parseData(archives) {
      archives.forEach((archive) => {
        if (archive.articleNums > 0) {
          const arc = { name: archive.title, value: archive.articleNums }
          this.options.series.data.push(arc)
          this.options.legend.data.push(archive.title)
        }
      })
    },
    echartsRender() {
      const archive = echarts.init(document.getElementById('archive'))
      archive.setOption(this.options)
    }
  }
}
</script>

<style scoped>
#archive {
  width: 100%;
  height: 400px;
}
</style>
