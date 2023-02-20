<template>
  <div>
    <!--表格-->
    <el-table style="width:100%" border>
      <el-table-column  type="index" prop="prop" label="序号" width="80" align="center"></el-table-column>
      <el-table-column  prop="prop" label="名称" width="width"></el-table-column>
      <el-table-column  prop="prop" label="描述" width="width"></el-table-column>
      <el-table-column  prop="prop" label="默认图片" width="110"></el-table-column>
      <el-table-column  prop="prop" label="重量" width="80"></el-table-column>
      <el-table-column  prop="prop" label="价格" width="80"></el-table-column>
      <el-table-column  prop="prop" label="操作" width="width"></el-table-column>
    </el-table>
    <!--分页器-->
    <el-pagination
      style="margin-top:20px;textAlign: center"
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-count="7"
      :page-sizes="[3,5,10]"
      layout="prev, pager, next,jumper,->,sizes,total">
    </el-pagination>
    <!--      @current-change="getPageList"-->
    <!--      @size-change="handleSizeChange"-->

  </div>
</template>
<script>
export default {
  name:'Sku',
  data(){
    return{
      page:1,
      total:20,
      limit:10,
    }
  }
}


</script>
<style>

</style>
