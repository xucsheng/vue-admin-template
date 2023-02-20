// 引入axios（axios进行二次封装）
import request from '@/utils/request'

// GET /admin/product/list/{page}/{limit}
export const reqSkuList=(page,limit)=>request({url:`/admin/product/list/${page}/${limit}`,method:'get'});
