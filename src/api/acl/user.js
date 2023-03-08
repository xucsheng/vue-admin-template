// 平台管理属性模块的管理数据
// 引入axios（axios进行二次封装）
import request from '@/utils/request'
const api_name='/admin/user'
/**登录**/
export function login({username,password}){
  return request({
    url:`${api_name}/login`,
    method:'post',
    data:{username,password}
  })
}
/**获取用户信息**/
export function getInfo(){
  return request({
    url:`${api_name}/info`,
    method:'get'
  })
}
/**退出信息**/
export function logout() {
  return request({
    url: `${api_name}/logout`,
    method: 'post'
  })
}
  /***删除用户**/
  export function removeById(id) {
    return request({
      url: `${api_name}/removeById/${id}`,
      method: 'delete'
    })
  }

/***分页查询用户**/
export function getPageList(page,limit,searchObj) {
  return request({
    url: `${api_name}/${page}/${limit}`,
    method: 'get',
    params:searchObj
  })
}




