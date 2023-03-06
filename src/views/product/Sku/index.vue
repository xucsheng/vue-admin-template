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
          <el-button v-if="row.isSale == 0"  type="success" icon="el-icon-sort-down" size="mini" @click="sale(row)"></el-button>
          <el-button  v-else type="success" icon="el-icon-sort-up" size="mini" @click="cancelSale(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(row)"></el-button>
          <el-button type="primary" icon="el-icon-info" size="mini" @click="getSkuInfo(row)"></el-button>
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
    <!--抽屉效果-->
    <el-drawer
      title="我是标题"
      :visible.sync="show"
      size="50%"
      :show-close="false">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{skuInfo.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{skuInfo.price}}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template >
              <el-tag type="success" v-for="(attr,index) in skuInfo.skuAttrValueList" :key="attr.id" style="margin-right: 10px;">{{attr.attrId}}-{{attr.valueId}}</el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="150px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl"/>
            </el-carousel-item>
          </el-carousel>

        </el-col>
      </el-row>
    </el-drawer>

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
      skuInfo:[], // 存储sku的信息
      show:false,

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
    // 上架
   async sale(row){
     let result = await this.$API.sku.reqSale(row.id);
     if(result.code==200){
       row.isSale = 1;
       this.$message({type:'success',message:'上架成功'});
       this.getSkuList();
     }

    },
   async cancelSale(row){
     let result = await this.$API.sku.reqCancelSale(row.id);
      if(result.code==200){
        row.isSale = 0;
        this.$message({type:'success',message:'下架成功'});
        this.getSkuList();
      }
    },
   async edit(sku){
      this.$message({type:'success',message:'正在开发中'});
    },
    async getSkuInfo(sku){
      this.show = true;
      // 获取sku的数据
      let result = await this.$API.sku.reqSkuById(sku.id);
      if(result.code==200){
        this.skuInfo = result.data;
      }
    },

  },

}


</script>
<style >

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}


</style>

<style scoped>
  .el-row .el-col-5{
     font-size: 18px;
     text-align: right;
   }
  .el-col{
    margin: 10px 10px;
    }
  >>>.el-carousel__button{
    width: 10px;
    height: 10px;
    background: red;
    border-radius: 50%;
  }

</style>
