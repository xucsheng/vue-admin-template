// 这个模块注意获取品牌管理数据
// 引入axios（axios进行二次封装）
import request from '@/utils/request'
// 获取品牌列表接口
// /admin/product/baseTrademark/{page}/{limit}
export const reqTrademarkList=(page,limit)=>request({url:`/admin/product/baseTrademark/${page}/${limit}`,method:'get'});

// 处理添加平台接口 POST /admin/product/baseTrademark/save
// 修改平台 /admin/product/baseTrademark/update put

export const reqAddOrUpdateTrademark=(tradeMark)=>{
  // 修改品牌
  if (tradeMark.id) {
    return  request ({url: '/admin/product/baseTrademark/update', data: tradeMark, method: 'put'});
  } else {
    // 新增品牌
    return  request ({url: '/admin/product/baseTrademark/save', data: tradeMark, method: 'post'});
  }
}
// 删除品牌信息 DELETE /admin/product/baseTrademark/remove/{id}
export const reqDeleteTradeMark=(id)=>request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'});


