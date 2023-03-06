<template>
  <div class="charts" ref="charts">

  </div>
</template>

<script>

export default {
  name: "BarChart",
  mounted() {
    this.drawLine();
  },
  methods:{
    drawLine(){
      // 初始化echarts实例
      let lineCharts = this.$echarts.init(this.$refs.charts);
      // 配置数据
      lineCharts.setOption({
        xAxis:{
          // 均分
          type:'category',
          // 隐藏x轴
          show:false,
        },
        yAxis:{
          // 隐藏y轴
          show:false,
        },
        // 系列
        series:[
          {
            // 图表形式
            type:'bar',
            data:[10,7,33,12,48,9,29,10,44,33,22,8],
            color:'cyan',
          }
        ],
        // 布局调试
        grid:{
          left:0,
          top:0,
          right:0,
          bottom:0,
        },
        tooltip:{},
      })
    }
  }
}
</script>

<style scoped>
.charts{
  width: 100%;
  height: 100%;
}
</style>
