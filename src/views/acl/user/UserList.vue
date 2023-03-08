<template>
   <div class="app-container">
     <!--表单元素-->
      <el-form inline>
           <el-form-item>
             <el-input v-model="tempSearchObj.keyword" placeholder="用户名"></el-input>
           </el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
            <el-button type="primary" @click="resetSearch">清空</el-button>
      </el-form>
      <div style="margin-bottom: 20px">
        <el-button type="primary" @click="showAddUser">添加</el-button>
        <el-button type="primary" @click="removeUsers" :disabled="selectedIds.length===0">批量删除</el-button>
      </div>
     <el-table
       :data="users"
       v-loading="listLoading"
       @selection-change="handleSelectionChange"
     >
       <el-table-column
         type="selection"
         label="序号"
         width="80"
         align="center">
       </el-table-column>
       <el-table-column
         prop="username"
         label="用户名"
         width="150">
       </el-table-column>
       <el-table-column
         prop="nickName"
         label="用户昵称">
       </el-table-column>
       <el-table-column
         prop="roleName"
         label="权限列表">
       </el-table-column>
       <el-table-column
         prop="createTime"
         label="创建时间">
       </el-table-column>
       <el-table-column
         prop="operateTime"
         label="更新时间">
       </el-table-column>
        <el-table-column label="操作" width="300" align="center">
               <template v-slot="{row}">
                 <HintButton type="info" size="mini" icon="el-icon-user-solid" title="分配角色" @click="showAssignRole(row)"/>
                 <HintButton type="primary" size="mini" icon="el-icon-user-edit" title="修改用户" @click="showUpdateUser(row)"/>
                 <el-popconfirm :title="`确认删除 ${row.username}吗？`" @onConfirm="removeUser(row.id)">
                   <HintButton style="margin-left: 10px"   type="danger" slot="reference"  size="mini" icon="el-icon-user-delete" title="删除用户"/>
                 </el-popconfirm>
               </template>
        </el-table-column>
     </el-table>
     <el-pagination
     :current-page="page"
     :total="total"
     :page-size="limit"
     :page-sizes="[3,10,20,30,40,50,100]"
     style="padding: 20px 0;"
     layout="prev,pager,next,jumper,->,sizes,total"
     @current-change="getUsers"
     @size-change="handleSizeChange"
     />
     <el-dialog :title="user.id?'修改用户':'添加用户'" :visible.sync="dialogUserVisible">
        <el-form ref="userForm" :model="user" :rules="userRules" label-width="120px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="user.username"></el-input>
            </el-form-item>
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="user.nickName"></el-input>
          </el-form-item>
          <el-form-item v-if="!user.id"  label="用户密码" prop="password">
            <el-input v-model="user.password"></el-input>
          </el-form-item>
        </el-form>
       <div slot="footer" class="dialog-footer">
         <el-button @click="cancel">取消</el-button>
         <el-button  type="primary" @click="addOrUpdate">确定</el-button>
       </div>
     </el-dialog>
     <el-dialog title="设置角色" :visible.sync="dialogRoleVisible" :before-close="resetRoleData">
       <el-form label-width="80px">
          <el-form-item label="用户名">
            <el-input disabled :value="user.username"></el-input>
          </el-form-item>
          <el-form-item label="角色列表">
              <el-checkbox :indeterminate="indeterminate" v-model="checkAll" @click="handleCheckAllChange">全选</el-checkbox>
                <div style="margin:15px 0;"></div>
                 <el-checkbox-group v-model="userRoles" @change="handleCheckedChange">
                    <el-checkbox v-for="role in allRoles" :key="role.id" :label="role.id">{{role.roleName}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
         </el-form>
         <div slot="footer">
           <el-button type="primary" @click="assignRole"> 保存</el-button>
           <el-button  @click="resetRoleData"> 取消</el-button>
         </div>
     </el-dialog>
   </div>
</template>

<script>
// 按需引入lodash当中的深拷贝
import cloneDeep from 'lodash/cloneDeep';
export default {
  name: "UserList",
  data(){
    return{
      listLoading:false, // 是否显示列表加载的提示
      searchObj:{
        keyword:''
      },
      page:1,
      limit:10,
      total:0,
      users:[],
      tempSearchObj:{
        keyword:'',
      },
      selectedIds:[],
      dialogUserVisible:false,
      userRules:{

      },
      user:{},
      indeterminate:true,
      checkAll:[],
      userRoles:[],
      allRoles:[],
      dialogRoleVisible:false,

    }
  },
  // 发送一般情况下，我们都是在mounted去发送，但是也可以在created内部去发送
  created() {
    this.getUsers();
  },
  methods:{
    /**
     * 自定义密码效验
     * **/
    validatePassword(rule,value,callback){
      if(!value){
        callback('密码必须输入');
      }else if(!value||!value.length<6){
        callback('密码不能小于6位');
      }else {
        callback();
      }
    },
    search(){
      this.searchObj={...this.tempSearchObj};
      this.getUsers();
    },
    resetSearch(){
      this.searchObj={
        username: ''
      };
      this.tempSearchObj={
        username: ''
      };
      this.getUsers();
    },
    showAddUser(){
      this.user={};
      this.dialogUserVisible = true;
      this.$nextTick(()=>this.$refs.userForm.clearValidate());
    },
    removeUsers(){
      this.$confirm('确定删除吗？').then(async()=>{
        await this.$API.user.removeById(this.selectIds);
        this.$message.success('删除成功');
        await this.getUsers();
      }).catch(()=>{
        this.$message.info('取消删除');
      })
    },
    handleSelectionChange(selection){
      this.selectedIds = selection.map(item=>item.id);
    },
    showAssignRole(row){

    },
    showUpdateUser(row){

    },
    /**
     * 删除某个用户
     * **/
   async removeUser(id){
     await this.$API.user.removeById(id);
     this.$message.success('删除成功');
     this.getUsers(this.users.length===1?this.page-1:this.page);
    },
    // 获取分页列表
    async getUsers(page=1){
     this.page=page;
     const {limit,searchObj} =this;
     this.listLoading = true;
     const result= await this.$API.user.getPageList(page,limit,searchObj);
     this.listLoading =false;
     const{total,records}= result.data;
     this.users = records.filter(item=>item.username!=='admin');
     this.total = total;
     this.selectIds =[];
    },
    handleSizeChange(pageSize){
        this.limit = pageSize;
        this.getUsers();
    },
    addOrUpdate(){

    },
    cancel(){
       this.dialogUserVisible = false;
       this.user={};
    },
    handleCheckAllChange(){

    },
    handleCheckedChange(){

    },
    resetRoleData(){

    },
    assignRole(){

    },

  },
  mounted() {
  }


}
</script>

<style scoped>

</style>
