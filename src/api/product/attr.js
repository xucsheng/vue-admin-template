// 平台管理属性模块的管理数据
// 引入axios（axios进行二次封装）
import request from '@/utils/request'

// 获取一级分类的数据接口  /admin/product/get/category1/{id}
export const reqCategory1List=()=>request({url:'/admin/product/getCategory1',method:'get'});

// 获取二级分类的数据接口
export  const  reqCategory2List=(category1Id)=>request({url:`/admin/product/getCategory2/${category1Id}`,method:'get'})

// 获取三级分类的数据接口
export  const  reqCategory3List=(category2Id)=>request({url:`/admin/product/getCategory3/${category2Id}`,method:'get'})

// 获取商品属性接口 GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrInfoListList=(category1Id,category2Id,category3Id)=>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})

// 添加属性接口 POST /admin/product/saveAttrInfo
export const reqAddOrUpdateAttr=(data)=>request({url:'/admin/product/saveAttrInfo',data,method:'post'});
// {
//   "attrName": "string", 属性名
//   "attrValueList": [    属性名中属性值，因为属性值可以是多个，因此需要是数组
//   {
//     "attrId": 0,  属性的Id
//     "valueName": "string"
//   }
// ],
//   "categoryId": 0,
//   "categoryLevel": 3,
// }
