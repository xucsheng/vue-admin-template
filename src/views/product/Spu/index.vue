<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="scene!=0"></CategorySelect>
    </el-card>
    <!--底部这里进行三部分切换-->
    <el-card>
      <div v-show="scene==0">
        <!--展示spu列表数据-->
        <el-button type="primary" icon="el-icon-plus"  :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table style="width: 100%" border :data="records">
           <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
           <el-table-column prop="spuName" label="spu名称" width="width"></el-table-column>
           <el-table-column prop="description" label="spu描述" width="width"></el-table-column>
           <el-table-column prop="prop" label="操作" width="width">
             <template v-slot="{row,$index}">
                 <hint-button  type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)"></hint-button>
                 <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)"></hint-button>
                 <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表" @click="handler(row)"></hint-button>
                 <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                   <hint-button  slot="reference"  type="danger" icon="el-icon-delete" size="mini" title="删除spu"> </hint-button>
                 </el-popconfirm>
             </template>
           </el-table-column>
        </el-table>

        <el-pagination
          style="margin-top:20px;textAlign: center"
          :page-sizes="[3,5,10]"
          :current-page="page"
          :total="total"
          :page-size="limit"
          layout="prev, pager, next,jumper,next,->,sizes,total"
          @current-change="getSpuList"
          @size-change="handlerSizeChange"
        >
        </el-pagination>

      </div>
        <SpuForm v-show="scene==1" @changeScene="changeScene" ref="spu"></SpuForm>

        <SkuForm v-show="scene==2" ref="sku" @changeScenes="changeScenes"></SkuForm>

    </el-card>
    <el-dialog :title="`${spu.spuName}的sku的列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <el-table :data="skuList" style="width: 100%" border  v-loading="loading">
        <el-table-column property="skuName" label="姓名" width="width"></el-table-column>
        <el-table-column property="price" label="价格" width="width"></el-table-column>
        <el-table-column property="weight" label="重量" width="width"></el-table-column>
        <el-table-column property="" label="默认图片" width="width">
          <template v-slot="{row,$index}" >
            <img :src="row.skuDefaultImg" style="width: 100px;height: 100px"/>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import SpuForm from "@/views/product/Spu/SpuForm";
import SkuForm from "@/views/product/Spu/SkuForm";
export default {
  name:'Spu',
  components:{
    SpuForm,
    SkuForm
  },
  data(){
    return{
      category1Id:'',
      category2Id:'',
      category3Id:'',
      page:1,
      limit:3,
      total:0,
      records:[],
      scene:0,// 0代码展示SPU列表数据  1：添加SPU|修改SPU 2：添加SKU
      spuInfo:{},
      dialogTableVisible:false, // 控制对话框显示和隐藏
      spu:{},
      skuList:[],
      loading:true,
    }
  },
  methods:{
    // 自定义事件的回调
    getCategoryId( {categoryId,level}){
      if(level == 1){
        this.category1Id = categoryId;
        this.category2Id='';
        this.category3Id='';
        this.records=[];
      }else if(level == 2){
        this.category2Id = categoryId;
        this.category3Id='';
        this.records=[];
      }else{
        // 代表三级分类的Id有了
        this.category3Id = categoryId;
        // 发送请求获取平台属性
        this.getSpuList();
      }
    },
    async getSpuList(pager = 1){
      this.page = pager;
      const {page,limit,category3Id} = this;
      let  result  = await this.$API.spu.reqSpuList(page,limit,category3Id);
      if(result.code == 200){
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    // 分页大小发生变化
    handlerSizeChange(limit){
      this.limit = limit;
      this.getSpuList();
    },
    // 添加Spu按钮回调
    addSpu(){
      this.scene = 1;
      this.$refs.spu.addSpuData(this.category3Id);
    },
    // 修改某个spu
    updateSpu(row){
      this.scene = 1;
      // 在父组件中科院通ref可以通知子组件
      this.$refs.spu.initSpuData(row);
    },
    // 子组件，自定义事件回调
    changeScene({scene,flag}){
     this.scene = scene;
      // 父组件需要再次刷新数据
     if(flag=='添加'){
       this.getSpuList();
     }else{
       this.getSpuList(this.page);
     }
    },
    // 子组件，自定义事件回调
    changeScenes(scene,){
      this.scene = scene;
    },
    // 删除spu按钮回调
    async deleteSpu(row){
       let result = await this.$API.spu.reqDeleteSpu(row.id);
       if(result.code == 200){
         this.$message({type:'success',message:'删除成功'});
         this.getSpuList(this.records.length > 1 ? this.page:this.page-1);
       }
    },
    // 添加sku按钮的回调
    addSku(row){
      // 切换场景2
      this.scene = 2;
      // 父组件调用子组件发送请求
      this.$refs.sku.getData(row,this.category1Id,this.category2Id);
    },
    // 查看sku按钮的回调
    async handler(spu){
      this.dialogTableVisible =true;
      // 保存spu的信息
      this.spu = spu;
      let result = await this.$API.spu.reqSkuList(spu.id);
      if(result.code==200){
        this.skuList = result.data;
        // 加载loading隐藏还是显示
        this.loading = false;
      }
    },
    // 关闭对话会
    close(done){
     this.loading = true;
     // 清除sku列表数据
      this.skuList =[];
      done();
    }
  }
}


</script>
<style>

</style>
