<template>
  <div>
      <el-form ref="form" label-width="80px">
         <el-form-item label="SPU名称">
           {{ spu.spuName }}
         </el-form-item>
        <el-form-item label="sku名称">
           <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
        </el-form-item>
        <el-form-item label="价格（元）">
          <el-input placeholder="价格（元）" v-model.number="skuInfo.price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="重量（千克）">
          <el-input placeholder="重量（千克）" v-model="skuInfo.weight"></el-input>
        </el-form-item>
        <el-form-item label="规格描述">
          <el-input type="textarea" rows="4"   placeholder="规格描述" v-model="skuInfo.skuDesc"></el-input>
        </el-form-item>
        <el-form-item label="平台属性">
            <el-form :inline="true" ref="form1" label-width="80px">
                 <el-form-item     :label="attrInfo.attrName" v-for="(attrInfo,index) in attrInfoList" :key="attrInfo.id">
                     <el-select    placeholder="请选择" v-model="attrInfo.attrIdAndValueId" >
                       <el-option  :label="attrValue.valueName"  :value="`${attrInfo.id}:${attrValue.id}`"       v-for="(attrValue,index)  in attrInfo.attrValueList" :key="attrValue.id" ></el-option>
                     </el-select>
                 </el-form-item>
            </el-form>
        </el-form-item>

        <el-form-item label="销售属性">
          <el-form :inline="true" ref="form1" label-width="80px">
            <el-form-item :label="spuSale.saleAttrName"  v-for="(spuSale,index)   in spuSaleAttrList" :key="spuSale.id">
              <el-select    placeholder="请选择" v-model="spuSale.attrIdAndValueId">
                <el-option  :label="spuSaleAttrValue.saleAttrValueName"        :value="`${spuSale.id}:${spuSaleAttrValue.id}`" v-for="(spuSaleAttrValue,index) in  spuSale.spuSaleAttrValueList" :key="spuSaleAttrValue.id"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-form-item>

        <el-form-item label="图片列表">
            <el-table style="width: 100%" border :data="spuImageList"  @selection-change="handleSelectionChange">>
               <el-table-column type="selection"  prop="prop"  width="80">
               </el-table-column>
               <el-table-column prop="prop" label="图片" width="width">
                 <template v-slot="{row,$index}">
                   <img :src="row.imgUrl" style="height: 100px;width: 100px"/>
                 </template>
               </el-table-column>
              <el-table-column prop="imgName" label="名称" width="width"></el-table-column>
               <el-table-column prop="prop" label="操作" width="width">
                 <template v-slot="{row,$index}">
                   <el-button type="primary" size="mini" v-if="row.isDefault == 0" @click="changeDefault(row)">设置默认</el-button>
                   <el-button size="mini" v-else>默认</el-button>
                 </template>
               </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>

      </el-form>
  </div>
</template>
<script>
export default {
  name:'SkuForm',
  data(){
    return{
      category1Id:'',
      category2Id:'',
      spuImageList:[],
      spuSaleAttrList:[],
      attrInfoList:[],
      // 收集sku数据的字段
      skuInfo:{
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        weight: '',
        price: 0,
        // 平台属性
        skuAttrValueList: [
          // {
          //    attrId: 0,
           //   valueId: 0,
          // }
        ],
        // 设置默认图片
        skuDefaultImg: "",
        skuDesc: "",
        // 收集图片的字段
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "",
          //   imgUrl: "",
          //   isDefault: "",
          //   skuId: 0,
          //   spuImgId: 0
          // }
        ],
        skuName: "",
        // sku 销售属性的列表
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "",
          //   skuId: 0,
          //   spuId: 0
          // }
        ],
      },
      spu:{},
      // 收集图片,但是需要注意缺少 isDefault字段
      imageList:[],

    }
  },
  methods:{
   async getData(spu,category1Id,category2Id){
     // 收集父组件的数据
     this.skuInfo.category3Id=spu.category3Id;
     this.skuInfo.spuId = spu.id;
     this.skuInfo.tmId = spu.tmId;
     this.spu = spu;
     // 获取图片信息
     let result = await this.$API.spu.reqSpuImageList(spu.id);
     if(result.code ==200){
       let list = result.data;
       list.forEach(item=>{
         item.isDefault = 0;
       });
       this.spuImageList = list;
     }
     // 获取销售属性的数据
     let resultSpuSaleAttrList =  await this.$API.spu.reqSpuSaleAttrList(spu.id);
     if(resultSpuSaleAttrList.code == 200){
       this.spuSaleAttrList = resultSpuSaleAttrList.data;
     }
     // 获取平台属性数据
     let resultAttrInfoList = await this.$API.spu.reqAttrInfoList(category1Id,category2Id,spu.category3Id);
     if(resultAttrInfoList.code == 200){
       this.attrInfoList = resultAttrInfoList.data;
     }
    },
    // table 选择框数据变化回调函数
    handleSelectionChange(params){
     // 获取用户选中的图片信息，但是当前缺少isDefault字段
      this.imageList = params;
    },
    changeDefault(row){
      this.spuImageList.forEach(item=>{
        item.isDefault = 0;
      });
      row.isDefault = 1;
      // 收集默认图片地址
      this.skuInfo.skuDefaultImg =row.imgUrl;
    },
    cancel(){
      this.$emit('changeScenes',0);
      Object.assign(this._data,this.$options.data());
    },
    async save(){
     // 整理参数
      const {attrInfoList,spuSaleAttrList,imageList,skuInfo} = this;

      // 整理平台数据方法一
      // let arr =[];
      // // 收集到数据
      //   attrInfoList.forEach(item=>{
      //   if(item.attrIdAndValueId){
      //    const [attrId,valueId] = item.attrIdAndValueId.split(':');
      //     arr.push({attrId,valueId});
      //   }
      // });
      //skuInfo.skuAttrValueList = arr;
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev,item)=>{
        if(item.attrIdAndValueId){
          const [attrId,valueId] = item.attrIdAndValueId.split(':');
          prev.push({attrId,valueId})
        }
        return prev;
      },[]);

      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev,item)=>{
        if(item.attrIdAndValueId){
          const [saleAttrId,saleAttrValueId] = item.attrIdAndValueId.split(':');
          prev.push({saleAttrId,saleAttrValueId});
        }
        return prev;
      },[]);
      // 整理图片数据
      skuInfo.skuImageList = imageList.map((item)=>{
              return{
                  imgName: item.imgName,
                  imgUrl: item.imgUrl,
                  isDefault: item.isDefault,
                  spuImgId: item.id,
              }
      });
     let result =  await this.$API.spu.reqAddSku(skuInfo);
     if(result.code ==200){
       this.$message({type:'success',message:'添加sku成功'});
       this.$emit('changeScenes',0);
     }
    },
  },
}
</script>
<style>

</style>
