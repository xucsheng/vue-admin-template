<template>
  <div>
    <!--按钮-->
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0px" @click="showDialog">添加</el-button>
     <!--
       表格组件
       border：给表格添加边框
       column： label：的标题
       width：对应的列标宽度
       注意1：elementUI当中的table数据，展示一列
       prop：对应列的名称
    --->
    <el-table  style="width: 100%" border :data="list">
      <el-table-column  type="index"  label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
         <template v-slot="{row,$index}">
           <img :src="row.logoUrl" alt="" style="width: 100px;height: 100px">

         </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template v-slot="{row,$index}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <!--分页器
      @size-change="handleSizeChange"
       @current-change="handleCurrentChange"
      current-page:当前第几页
      total,代表分页器一共需要显示数据条数
      page-count:按钮的数量
    -->

    <el-pagination
      style="margin-top:20px;textAlign: center"
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-count="7"
      :page-sizes="[3,5,10]"
      @current-change="getPageList"
      @size-change="handleSizeChange"
      layout="prev, pager, next,jumper,->,sizes,total">
    </el-pagination>
    <!--对话框
    :visible.sync ：控制对话框显示和隐藏
    Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，
    并将 Form-Item 的 prop 属性设置为需校验的字段名即可。
    -->
    <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <!--展示表单 model属性，这个属性的作用，把表单的数据收集到对象上面，后面验证-->
      <el-form  :model="tmForm" style="width: 80%" :rules="rules"  ref="ruleForm">
        <el-form-item label="品牌名称"  label-width="100px"  prop="tmName">
          <el-input   v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <!--收集数据，不能使用v-model
        on-success:检查图片上传成功
        before-upload：上传之前检查
        -->
        <el-form-item label="品牌LOGO"  label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" >
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
export default {
  name:'TradeMark',
  data(){
    var validateTmName = (rule, value, callback) => {
      if (value === '' ||value.length <= 2 ||value.length >10) {
         callback(new Error('品牌名称2-10位'));
      } else {
        callback();
      }
    };
    return{
      page:1,
      limit:3,
      // 总价数据条数
      total:0,
      // 列表展示的数据
      list:[],
      // 控制对话框显示和隐藏
      dialogFormVisible:false,
      imageUrl: '',
      tmForm:{
        tmName:'',
        logoUrl:'',
      },
      // 表单验证规则对象
      rules: {
        tmName: [
          // required :必要字段验证
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          // 自定义校验规则
          {validator:validateTmName,trigger: 'changer'}
        ],
        logoUrl: [
          { required: true, message: '前选择品牌图片' }
        ],
      },
    }
  },
  methods:{
   async getPageList(pager=1){
     this.page = pager;
      // 解构参数
      const {page,limit} = this;
      // 当你向服务器需要参数
      let result = await this.$API.tradeMark.reqTrademarkList(page,limit);
      if(result.code ==200){
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    // 当分页器，展示条数发生变化触发
    handleSizeChange(limit){
      this.limit = limit;
      this.getPageList();
    },
    // 显示对话框
    showDialog(){
     this.dialogFormVisible = true;
     // 清理数据
      this.tmForm.tmName ='';
      this.tmForm.logoUrl ='';
    },
    updateTradeMark(row){
      this.dialogFormVisible = true;
      // 赋值数据
      this.tmForm= {...row};
    },
    // 上传图片相关的回调
    handleAvatarSuccess(res, file) {
     // res 上传成功返回前端数据
      // file 上传成功后服务返回前端数据
      // 收集品牌图片
      this.tmForm.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    // 添加或许修改品牌按钮
    addOrUpdateTradeMark(){
     this.$refs.ruleForm.validate(async (success) => {
       if (success) {
         this.dialogFormVisible = false;
         let result =  await this.$API.tradeMark.reqAddOrUpdateTrademark(this.tmForm);
         if(result.code == 200){
           // 弹出信息 ：添加或者修改删除成功
           this.$message({
             type:'success',
             message:this.tmForm.id?'修改成功':'添加品牌成功',
           });
           // 如果添加品牌
           this.getPageList(this.tmForm.id?this.page:1);
         }
       } else {
         console.log('error submit!!');
         return false;
       }
     });
    },
    // 删除品牌信息
    deleteTradeMark(row){
        this.$confirm(`你确定删除${row.tmName}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
         let result = await this.$API.tradeMark.reqDeleteTradeMark(row.id);
          if(result.code == 200){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getPageList(this.list.length > 1 ?this.page:this.page-1);
          }else{
            alert('删除失败！')
          }

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
  },
  mounted() {
    this.getPageList();
  }
}


</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
