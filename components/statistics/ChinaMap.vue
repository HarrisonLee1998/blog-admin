<template>
  <v-container>
    <v-row justify="center" align="center">
      <div>自2020/05/01以来，国内共{{ total }}次访问</div>
      <v-col cols="12">
        <v-simple-table height="500px">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  省（直辖市、少数名族自治区、特别行政区）
                </th>
                <th class="text-left">访问量</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in data" :key="item.name">
                <td>{{ item.name }}</td>
                <td>{{ item.value }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      // options: {
      //   title: {
      //     text: '各地区访问量',
      //     left: 'center'
      //   },
      //   tooltip: {
      //     trigger: 'item'
      //   },
      //   visualMap: {
      //     min: 0,
      //     max: 100000,
      //     left: 'left',
      //     top: 'bottom',
      //     text: ['高', '低'], // 文本，默认为数值文本
      //     calculable: true
      //   },
      //   toolbox: {
      //     show: true,
      //     orient: 'vertical',
      //     left: 'right',
      //     top: 'center',
      //     feature: {
      //       mark: { show: true },
      //       dataView: { show: true, readOnly: false },
      //       restore: { show: true },
      //       saveAsImage: { show: true }
      //     }
      //   },
      //   series: {
      //     name: '各地区浏览量统计',
      //     type: 'map',
      //     mapType: 'china',
      //     roam: false,
      //     label: {
      //       normal: {
      //         show: false
      //       },
      //       emphasis: {
      //         show: true
      //       }
      //     },
      //     emphasis: {
      //       itemStyle: {
      //         areaColor: '#e84393' // 地图区域的颜色
      //       }
      //     },
      //     data: []
      //   }
      // }
      data: [],
      total: 0
    }
  },
  mounted() {
    this.getMapData()
  },
  methods: {
    getMapData() {
      this.$axios.get('/api/admin/visit/district').then((res) => {
        if (res.data.status === 'OK') {
          this.parseData(res.data.map.count)
          // this.echartsRender()
        }
      })
    },
    parseData(count) {
      count = JSON.parse(count)
      const items = count.result.items
      const len = items[0].length
      for (let i = 0; i < len; ++i) {
        const d = {}
        d.name = items[0][i][0].name
        d.value = items[1][i][0]
        this.total += d.value
        this.data.push(d)
      }
    }
    // echartsRender() {
    //   const chinaMap = this.$echarts.init(document.getElementById('chinaMap'))
    //   chinaMap.setOption(this.options)
    // }
  }
}
</script>

<style scoped>
#chinaMap {
  width: 100%;
  height: 500px;
}
</style>
