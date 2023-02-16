<template>
  <div>
     <el-form ref="form" label-width="80px">
       <el-form-item label="Spu名称">
          <el-input placeholder="Spu名称" v-model="spu.spuName"></el-input>
       </el-form-item>

       <el-form-item label="品牌" >
         <el-select placeholder="请选择品牌" v-model="spu.tmId">
           <el-option :value="tm.id"  v-for="(tm,index) in trademarkList" :key="tm.id"  :label="tm.tmName"></el-option>
         </el-select>
       </el-form-item>

       <el-form-item label="品牌">
             <el-input type="textarea" rows="4" placeholder="描述" v-model="spu.description"></el-input>
       </el-form-item>
       <el-form-item label="spu的图片">
         <!--上传图片，action：图片上传地址 list-type：文件列表的类型 on-preview：图片预览时候触发 on-remove：删除图片触发-->
         <el-upload
           action="/dev-api/admin/product/upload"
           list-type="picture-card"
           :file-list="spuImageList"
           :on-preview="handlePictureCardPreview"
           :on-remove="handleRemove"
           :on-success="handleSuccess"
         >
           <i class="el-icon-plus"></i>
         </el-upload>
         <el-dialog :visible.sync="dialogVisible">
           <img width="100%" :src="dialogImageUrl" alt=""/>
         </el-dialog>

       </el-form-item>
       <el-form-item label="销售属性" >
         <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrIdAndAttrName" >
           <el-option :value="`${unSelectSale.id}:${unSelectSale.name}`" :label="unSelectSale.name" v-for="(unSelectSale,index) in unSelectSaleAttr" :key="unSelectSale.id"></el-option>
         </el-select>
         <el-button type="primary" icon="el-icon-plus" :disabled="attrIdAndAttrName ==''" @click="addSaleAttr">添加销售属性</el-button>
         <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
            <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
            <el-table-column prop="saleAttrName" label="属性名" width="width"></el-table-column>
            <el-table-column prop="prop" label="属性值名称列表" width="width">
              <template v-slot="{row,$index}">
                <el-tag
                  :key="tag.id"
                  v-for="(tag,index) in row.spuSaleAttrValueList"
                  closable
                  :disable-transitions="false"
                  @close="row.spuSaleAttrValueList.splice(index,1)">
                  {{tag.saleAttrValueName}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native=""
                  @blur="handleInputConfirm(row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="prop" label="操作" width="width">
                <template v-slot="{row,$index}">
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
                </template>
            </el-table-column>
         </el-table>
       </el-form-item>
        <el-form-item >
                  <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
                  <el-button @click="cancel">取消</el-button>
        </el-form-item>

     </el-form>
  </div>
</template>
<script>
export default {
  name:'SpuForm',
  computed:{
    // 计算出来未选择的销售属性
    unSelectSaleAttr(){
      // 整个平台的销售属性是3个：颜色、尺寸、版本
      // saleAttrList  spu.spuSaleAttrList
      let result = this.saleAttrList.filter(item=>{
        return this.spu.spuSaleAttrList.every(i=>{
          return item.name !=i.saleAttrName;
        })
      });
      return result;
    },
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      spu:{
        category3Id: 0,
        description: "",
        spuName: "",
        spuImageList: [
          //{
          // "id": 0,
          // "imgName": "string",
          // "imgUrl": "string",
          // "spuId": 0
         //}
         ],
        tmId: '',  // 品牌Id
        spuSaleAttrList: [
          // {
          //    "baseSaleAttrId": 0,
          //     "id": 0,
          //     "saleAttrName": "string",
          //     "spuId": 0,
          //     "spuSaleAttrValueList": [{
          //       "baseSaleAttrId": 0,
          //       "id": 0,
          //       "isChecked": "",
          //        "saleAttrName": "",
          //        "saleAttrValueName": "",
          //        "spuId": 0
          //      }]
          //  }
           ]
        },
      trademarkList:[], //  获取品牌信息列表数据
      spuImageList:[],//  获取spu图片的列表数据
      saleAttrList:[],// 销售属性的列表数据
      attrIdAndAttrName:'',// 收集未选择的销售Id....
    };
  },
  methods: {
    // 照片墙删除某个图片触发
    handleRemove(file, fileList) {
      // file参数：代表删除的照片
      // fileList 剩余的其它照片
      // 收集照片墙数据,照片墙中有 name url 字段，照片墙显示需要的属性
      this.spuImageList = fileList;
    },
    // 照片墙图片预览的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      // 对话框显示
      this.dialogVisible = true;
    },
    // 初始化数据
   async initSpuData(spu){
     let spuResult =  await this.$API.spu.reqSpu(spu.id);
     if(spuResult.code == 200){
       this.spu = spuResult.data;
     }
     // 获取品牌信息
     let trademarkListResult = await this.$API.spu.reqTrademarkList()
     if(trademarkListResult.code == 200){
       this.trademarkList = trademarkListResult.data;
     }
     // 获取spu图片的数据
     let spuImageListResult = await this.$API.spu.reqSpuImageList(spu.id);
     if(spuImageListResult.code == 200){
       let listArr = spuImageListResult.data;
       // 由于照片墙显示需要 name url
       listArr.forEach(item=>{
         item.name = item.imgName;
         item.url = item.imgUrl;
       })
       this.spuImageList =listArr;

      }
     // 获取品牌所以销售数据
     let saleAttrListResult = await this.$API.spu.reqBaseSaleAttrList();
     if(saleAttrListResult.code == 200){
       this.saleAttrList = saleAttrListResult.data;
     }
   },
    // 照片墙图片上传成功对的回调
    handleSuccess(response, file, fileList){
      this.spuImageList = fileList;
    },
    // 添加新的销售属性
    addSaleAttr(){
      const[baseSaleAttrId,saleAttrName] = this.attrIdAndAttrName.split(':');
      this.spu.spuSaleAttrList.push({
        baseSaleAttrId,saleAttrName,
        spuSaleAttrValueList:[]
      })
      // 重置数据
      this.attrIdAndAttrName ='';
    },
    // 添加按钮的回调函数
    addSaleAttrValue(row){
      this.$set(row,'inputVisible',true);
      // 通过响应式数据inputValue字段收集新增的销售属性值
      this.$set(row,'inputValue','');
    },
    // el-input 失去焦点
    handleInputConfirm(row){
      // 新增销售属性值
      const{baseSaleAttrId,inputValue}= row;
      // 新增销售属性名称不能为空
      if(inputValue.trim() ==''){
        this.$message('属性值不能为空');
        return;
      };
      // 属性值不能重复
      let flag = row.spuSaleAttrValueList.every(item=>item.saleAttrValueName!= inputValue);
      if(!flag){
         this.$message('属性值不能重复');
         return;
       }
      row.spuSaleAttrValueList.push( {baseSaleAttrId,saleAttrValueName:inputValue});
      row.inputVisible = false;
    },
    async addOrUpdateSpu(){
      this.spu.spuImageList = this.spuImageList.map(item=>{
        return {
               imgName:item.name,
               imgUrl: (item.response && item.response.data)||item.url
               }
          });
       let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
       if(result.code == 200){
         this.$message({type:'success',message:'更新成功！'});
         // 通知父组件场景0
         this.$emit('changeScene',{scene:0,flag:this.spu.id ? '修改':'添加'});
         // this.$options当前对象配置对象为空对象
         Object.assign(this._data,this.$options.data());
       }else {
          this.$message('更新失败');
        }
      },
    // 添加按钮触发回调函数
   async addSpuData(category3Id){
     this.spu.category3Id = category3Id;
      // 获取品牌信息
      let trademarkListResult = await this.$API.spu.reqTrademarkList();
      if(trademarkListResult.code == 200){
        this.trademarkList = trademarkListResult.data;
      }
      // 获取品牌所以销售数据
      let saleAttrListResult = await this.$API.spu.reqBaseSaleAttrList();
      if(saleAttrListResult.code == 200){
        this.saleAttrList = saleAttrListResult.data;
      }
    },
    cancel(){
      this.$emit('changeScene',{scene:0,flag:this.spu.id ? '修改':'添加'});
      // 清理数据
      // Object.assign:es6合并对象
      // 组件实例 this._data可以操作data中响应式数据
      // this.$options当前对象配置对象为空对象
      Object.assign(this._data,this.$options.data());

    },
  },

}
</script>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
