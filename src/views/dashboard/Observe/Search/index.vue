<template>
  <el-card>
    <div   slot="header" class="header">
       <div class="search-header">
          <span> 线上热门搜索</span>
         <el-dropdown>
             <span class="el-dropdown-link">
                 <i class="el-icon-more"></i>
            </span>
           <el-dropdown-menu slot="dropdown">
             <el-dropdown-item>黄金糕</el-dropdown-item>
             <el-dropdown-item>狮子头</el-dropdown-item>
             <el-dropdown-item>螺蛳粉</el-dropdown-item>
             <el-dropdown-item>双皮奶</el-dropdown-item>
             <el-dropdown-item>蚵仔煎</el-dropdown-item>
           </el-dropdown-menu>
         </el-dropdown>
       </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="12">
          <LineChart> </LineChart>
        </el-col>
        <el-col :span="12">
             <LineChart> </LineChart>
        </el-col>
      </el-row>
      <!--table表格--->
      <el-table :data="tableData" style="width: 80%"   border>
        <el-table-column label="排名" width="180" type="index" ></el-table-column>
        <el-table-column label="搜索关键子" width="180"></el-table-column>
        <el-table-column label="用户数" sortable></el-table-column>
        <el-table-column label="周涨幅" sortable></el-table-column>
      </el-table>
      <!--分页器-->
      <el-pagination class="pagination"
        layout="prev, pager, next"
        :total="1000">
      </el-pagination>
    </div>
  </el-card>

</template>

<script>
import LineChart from "./LineChart";

export default {
  name: "Search",
  data(){
    return{
      tableData:[{}],
    }
  },
  components:{
    LineChart,
  }
}
</script>

<style scoped>
.search-header{
  display: flex;
  justify-content: space-between;
}
.header{
  border-bottom: 1px solid #eee;
  padding: 5px 0px;
}
.pagination{
  float: right;
}
</style>
