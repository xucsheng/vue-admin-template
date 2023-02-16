<template>
  <div>
    <el-card style="margin: 20px 0px ">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>
     <el-card>
        <div v-show="isShowTable">
          <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
          <el-table style="width: 100%"  :data="attrList">
            <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
            <el-table-column  prop="attrName" label="属性名称" width="150"></el-table-column>
            <el-table-column  prop="prop" label="属性值列表" width="width">
              <template v-slot="{row,$index}">
                <el-tag type="success" v-for="(attrValue,index) in  row.attrValueList" :key="attrValue.id" style="margin: 0px 10px">{{attrValue.valueName}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column  prop="prop" label="操作" width="width">
              <template v-slot="{row,$index}">
                <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)">编辑</el-button>
              </template>
            </el-table-column>

          </el-table>
        </div>
       <!--添加或者修改属性的结构-->
       <div v-show="!isShowTable">
            <el-form  :inline="true"  ref="form" label-width="80px">
                <el-form-item label="属性名">
                  <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
                </el-form-item>
            </el-form>
         <el-button type="primary" icon="el-icon-plus" size="mini" @click="addAttrValue" :disabled="!attrInfo.attrName"> 添加属性值</el-button>

         <el-button size="mini" @click="isShowTable=true"> 取消</el-button>
         <el-table style="width: 100%;margin: 20px 0px"  border  :data="attrInfo.attrValueList">
                <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
                <el-table-column prop="prop"  label="属性值名称" width="width" >
                  <template v-slot="{row,$index}">
                     <!--这里的结构需要span与input还回切换-->
                    <el-input placeholder="请输入属性值名称" v-model="row.valueName"
                              size="mini" v-if="row.flag"  @blur="toLook(row)"
                              @keyup.native.enter="toLook(row)"
                              :ref="$index"
                    ></el-input>
                    <span v-else @click="toEdit(row,$index)" style="display: block">{{row.valueName}}</span>
                  </template>
                </el-table-column>
                <el-table-column  label="操作" width="width" >
                  <template v-slot="{row,$index}">
                     <!--气泡确认框-->
                    <el-popconfirm  :title="`确定删除${row.valueName}？`" @onConfirm="deleteAttrValue($index)">
                         <el-button type="danger" icon="el-icon-delete" size="mini"
                                    slot="reference">删除</el-button>
                      </el-popconfirm>
                  </template>

                </el-table-column>
         </el-table>
           <el-button type="primary" size="mini" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length < 1">保存</el-button>
           <el-button size="mini" @click="isShowTable=true">取消</el-button>
       </div>
     </el-card>

  </div>
</template>
<script>
// 按需引入lodash当中的深拷贝
import cloneDeep from 'lodash/cloneDeep';
export default {
  name: 'Attr',
  data(){
    return{
      category1Id:'',
      category2Id:'',
      category3Id:'',
      attrList:[],
      isShowTable:true,
      // 收集属性值:添加或者修改
      attrInfo:{
        attrName: "",
        attrValueList: [],
          categoryId: 0,// 三级分类id
          categoryLevel: 3,
       },

    }
  },
  methods:{
    // 获取平台属性的数据
    async getAttrList(){
      const{category1Id,category2Id,category3Id}=this;
      let result = await this.$API.attr.reqAttrInfoListList(category1Id,category2Id,category3Id);
       if(result.code== 200){
         this.attrList = result.data;
       }
      },
    // 自定义事件的回调
    getCategoryId( {categoryId,level}){
       if(level == 1){
         this.category1Id = categoryId;
         this.category2Id='';
         this.category3Id='';
       }else if(level == 2){
         this.category2Id = categoryId;
         this.category3Id='';
       }else{
         // 代表三级分类的Id有了
         this.category3Id = categoryId;
         // 发送请求获取平台属性
         this.getAttrList();
       }
    },
    addAttrValue(){
      // 向属性属性数组添加元素
      // attrId 属性的Id
      // valueName 属性名称
      this.attrInfo.attrValueList.push({
        attrId:this.attrInfo.id, // 对于修改某个属性的时候，可以在已有的属性值基础上新增的属性值（新增属性值的时候，需要把已有id带上）
        valueName:'',
        flag:true, // flag给每天属性值添加一个标记，用户切换模式，好吃，每一个属性可以控制自己的模式切换
      });
    },
    // 添加属性按钮的回调
    addAttr(){
      this.isShowTable = false;
      // 清除添加属性数据
      this.attrInfo ={
           attrName: "",
           attrValueList: [],
           categoryId: this.category3Id,// 三级分类id
           categoryLevel: 3,
      }
    },
    // 修改莫个属性
    updateAttr(row){
      this.isShowTable = false;
      // 修改浅赋值 由于数据结构中对象有数组，数组里面有对象，使用深拷贝解决这类问题
      // 深拷贝和浅拷贝
      this.attrInfo = cloneDeep(row);
      // 在修改某个属性的时候，将相应的属性元素添加上flag标记
      this.attrInfo.attrValueList.forEach(item=>{
        // 这个书写可以给属性添加flag属性，但是flag不是相应式数据
        // Vue 无法探测p普通数据property，这样不是响应式数据,
        // 第一个参数：对象，第二个参数：添加新的响应式属性，第三个参数，属性的值
        this.$set(item,'flag',false);
      })
    },
    // 失去角度的事件--切换查看模式
    toLook(row){
      if(row.valueName.trim()=='') {
        this.$message('请输入正常值');
        return;
      }
      // 新增的属性值不能和已有属性值重复
      let isRepat = this.attrInfo.attrValueList.some(item=>{
        // 需要将row从数组中去除
        if(row !== item){
          return row.valueName == item.valueName;
        }
      })
      if(isRepat){
        return;
      }
      row.flag = false;
    },
    // 点击span的回调函数
    toEdit(row,index){
      row.flag = true;
      // 需要注意，点击span的时候，切换input的为响应模式，但是需要注意，对于浏览器，页面重绘需要时间
      // $nextTick,当节点渲染完毕，会执行一次
      this.$nextTick(()=>{
        this.$refs[index].focus();
      })
    },
    // 气泡确认框确定按钮的回调
    // 版本问题 onConfirm
    deleteAttrValue(index){
      // 当前删除删除属性值不需要发送请求
      this.attrInfo.attrValueList.splice(index,1);
    },
    // 保存或者修改属性操作
   async addOrUpdateAttr(){
      // 整理参数 1:空数据去除 2：flag字段去除
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item=>{
        if(item.valueName !=''){
          delete item.flag;
          return true;
        }
      });
      // 发送请求
    try{
         await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
         this.$message({type:'success',message:'保存成功'});
         // 保存成功以后，再次刷新数据
         this.isShowTable =true;
          this.getAttrList();
      }catch (error){
         this.$message('保存失败');
      }
    }
  }

}

</script>
<style>

</style>
