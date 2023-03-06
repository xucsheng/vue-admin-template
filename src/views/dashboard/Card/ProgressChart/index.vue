<template>
  <div class="charts" ref="charts">

  </div>
</template>

<script>

export default {
  name: "ProgressChart",
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
          // 隐藏x轴
          show:false,
          // 最小值和最大值
          min:0,
          max:100
        },
        yAxis:{
          // 隐藏y轴
          show:false,
          // 均分
          type:'category',
        },
        // 系列
        series:[
          {
            // 图表形式
            type:'bar',
            data:[78],
            color:'yellowgreen',
            // 柱状图的宽度设置
            barWidth:10,
            // 背景颜色
            showBackground:true,
            // 设置背景颜色
            backgroundStyle:{
              color:'#eee',
            },
            // 文本 标签
            label:{
              show:true,
              // 改变文本的内容
              formatter:'|',
              // 文本标签位置的调整
              position:'right',
            }
          }
        ],
        // 布局调试
        grid:{
          left:0,
          top:0,
          right:0,
          bottom:0,
        },
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
