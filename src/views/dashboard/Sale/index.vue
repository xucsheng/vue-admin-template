<template>
     <el-card class="box-card" style="margin: 10px 0px">
     <div slot="header" class="clearfix">
       <el-tabs class="tab" v-model="activeName">
         <!--头部左侧内容-->
         <el-tab-pane label="销售额" name="sale"></el-tab-pane>
         <el-tab-pane label="访问量" name="visits"></el-tab-pane>
       </el-tabs>
       <!--头部右侧内容-->
       <div class="right">
         <span @click="setDay">今日</span>
         <span @click="setWeek">本周</span>
         <span @click="setMonth">本月</span>
         <span  @click="setYear">本年</span>
         <el-date-picker
           class="date"
           v-model="data"
           type="daterange"
           range-separator="-"
           start-placeholder="开始日期"
           end-placeholder="结束日期"
           size="mini"
           value-format="yyyy-MM-dd"
         >
         </el-date-picker>
       </div>
     </div>
       <div>
            <el-row :gutter="10">
              <el-col :span="18">
                <div class="charts" ref="charts"></div>
              </el-col>
              <el-col :span="6" class="right">
                  <h3>门店{{title}}排名</h3>
                 <ul>
                   <li>
                     <span class="rindex">0</span>
                     <span>肯德基</span>
                     <span class="rvalue">123456</span>
                   </li>
                   <li>
                     <span class="rindex">1</span>
                     <span>肯德基</span>
                     <span class="rvalue">123456</span>
                   </li>
                   <li>
                     <span class="rindex">2</span>
                     <span>肯德基</span>
                     <span class="rvalue">123456</span>
                   </li>
                   <li>
                     <span class="rindex">3</span>
                     <span>肯德基</span>
                     <span class="rvalue">123456</span>
                   </li>
                   <li>
                     <span class="rindex">4</span>
                     <span>肯德基</span>
                     <span class="rvalue">123456</span>
                   </li>
                   <li>
                     <span class="rindex">5</span>
                     <span>肯德基</span>
                     <span class="rvalue">123456</span>
                   </li>
                   <li>
                     <span class="rindex">6</span>
                     <span>肯德基</span>
                     <span class="rvalue">123456</span>
                   </li>
                   <li>
                     <span class="rindex">7</span>
                     <span>肯德基</span>
                     <span class="rvalue">123456</span>
                   </li>
                 </ul>
              </el-col>
            </el-row>
       </div>

   </el-card>
</template>

<script>
import dayjs from "dayjs";
import lang from 'element-ui/lib/locale/lang/zh-CN';
import locale from 'element-ui/lib/locale';

// 引入中文语言包
locale.use(lang);

export default {
  name: "Sale",
  data(){
    return{
      activeName:'sale',
      myCharts:null,
      // 收集数据
      data:[],
    }
  },
  mounted() {
     this.myCharts = this.$echarts.init(this.$refs.charts);
     // 配置项
     this.myCharts.setOption({
      title:{
          text: this.title+'趋势',
        },
        tooltip: {
        trigger: 'axis',
          axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月','8月','9月','10月','11月','12月'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
        yAxis: [
      {
        type: 'value'
      }
    ],
      series: [
      {
        name: 'Direct',
        type: 'bar',
        barWidth: '60%',
        data: [10, 52, 200, 334, 390, 330, 220,110,98,167,123,44],
        color:'yellowgreen'
      }
    ]
    })
  },
  computed:{
    title(){
      return this.activeName =='sale'?'销售额':'访问量';
    }
  },
  // 监控属性
  watch:{
    title(){
      // 重新修改图表的配置数据
      // 图表配置数据再次修改，如果有新的数据，没有新的数据，还是用以前的
      this.myCharts.setOption({
        title:{
          text: this.title+'趋势',
        }
      })
    }
  },
  methods: {
    // 当天
    setDay() {
      const day = dayjs().format('YYYY-MM-DD');
      this.data = [day, day];
    },
    // 本周
    setWeek() {
      const start = dayjs().day(1).format('YYYY-MM-DD');
      const end = dayjs().day(7).format('YYYY-MM-DD');
      this.data =[start,end];
    },
    // 本月
    setMonth(){
      const start = dayjs().startOf('month').format('YYYY-MM-DD');
      const end = dayjs().endOf('month').format('YYYY-MM-DD');
      this.data =[start,end];
    },
    // 本年
    setYear(){
      const start = dayjs().startOf('year').format('YYYY-MM-DD');
      const end = dayjs().endOf('year').format('YYYY-MM-DD');
      this.data =[start,end];
    }
  }
}
</script>

<style scoped>
.clearfix{
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab{
  width: 100%;
}
.right{
  position: absolute;
  right: 0px;
}
.date{
  width: 250px;
  margin: 0px 2px;
}
.right span{
  margin: 0px 10px;
}
.charts{
  width: 100%;
  height: 300px;
}
ul{
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0px;
}
ul li{
  height: 8%;
  margin: 10px 0px;
}
.rindex{
  float:  left;
  width:  20px;
  height: 20px;
  border-radius: 50% ;
  background: black;
  color: #d9d9d9;
  text-align: center;
}
.rvalue{
  float: right;
}
</style>
