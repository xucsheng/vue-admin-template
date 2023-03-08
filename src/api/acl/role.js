// 平台管理属性模块的管理数据
// 引入axios（axios进行二次封装）
import request from '@/utils/request'
/**
 * 角色管理相关API请求函数
 * ***/
const  api_name ='/admin/acl/role'
export default {
  /**获取角色分页列表（带搜索）***/
  getPageList(page,limit,searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },
  /**获取某个角色***/
  getById(id){
    return request({
      url:`${api_name}/get/${id}`,
      method:'get'
    })
  },
  /**保存某个角色***/
  save(role){
    return request({
      url:`${api_name}/save`,
      method:'post',
      data:role
    })
  },
  /**更新某个角色***/
  update(role){
    return request({
      url:`${api_name}/update`,
      method:'post',
      data:role
    })
  },
}
