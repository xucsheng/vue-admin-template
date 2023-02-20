<template>
  <div>
    <!--表格-->
    <el-table style="width:100%" border :data="records">
      <el-table-column  type="index" prop="prop" label="序号" width="80" align="center"></el-table-column>
      <el-table-column  prop="skuName" label="名称" width="width"></el-table-column>
      <el-table-column  prop="skuDesc" label="描述" width="width"></el-table-column>
      <el-table-column  label="默认图片" width="110">
        <template v-slot="{row,$index}">
          <img :src="row.skuDefaultImg" style="width: 80px;height: 80px"/>
        </template>
      </el-table-column>
      <el-table-column  prop="weight" label="重量" width="80"></el-table-column>
      <el-table-column  prop="price" label="价格" width="80"></el-table-column>
      <el-table-column  prop="prop" label="操作" width="width">
        <template v-slot="{row,$index}">
          <el-button type="success" icon="el-icon-sort-down" size="mini"></el-button>
          <el-button type="success" icon="el-icon-sort-up" size="mini"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="primary" icon="el-icon-info" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>

      </el-table-column>
    </el-table>
    <!--分页器-->
    <el-pagination
      style="margin-top:20px;textAlign: center"
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-count="7"
      :page-sizes="[3,5,10]"
      layout="prev, pager, next,jumper,->,sizes,total"
      @current-change="getSkuList"
      @size-change="handleSizeChange"
    >
    </el-pagination>

  </div>
</template>
<script>
export default {
  name:'Sku',
  data(){
    return{
      page:1,
      total:0,
      limit:10,
      records:[],
    }
  },
  mounted() {
    this.getSkuList();
  },
  methods:{
    async getSkuList(pages =1){
      this.page = pages;
      const{page,limit}=this;
      let result =  await this.$API.sku.reqSkuList(page,limit);
      if(result.code == 200){
        this.records = result.data.records;
        this.page = result.data.current;
        this.total = result.data.total;
        this.limit = result.data.size;
      }
    },
    handleSizeChange(limit){
      this.limit = limit;
      this.getSkuList();
    },

  },

}


</script>
<style>

</style>
