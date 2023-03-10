// 平台管理属性模块的管理数据
// 引入axios（axios进行二次封装）
import request from '@/utils/request'

// 获取spu列表数据的接口   GET /admin/product/{page}/{limit}  category3Id
export const reqSpuList=(page,limit,category3Id)=>request({url:`/admin/product/${page}/${limit}`,params:{category3Id},method:'get'});

// 获取spu信息接口GET /admin/product/getSpuById/{spuId}
export const  reqSpu=(spuId)=>request({url:`/admin/product/getSpuById/${spuId}`,method:'get'});

// 获取品牌信息 /admin/product/baseTrademark/getTrademarkList
export const reqTrademarkList=()=>request({url:'/admin/product/baseTrademark/getTrademarkList',method:'get'});

// 获取spu图片 GET /admin/product/spuImageList/{spuId}
export const reqSpuImageList=(spuId)=>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'});

// 获取平台全部销售属性（一共3个）spu GET /admin/product/baseSaleAttrList
export const reqBaseSaleAttrList=()=>request({url:'/admin/product/baseSaleAttrList',method:'get'});

// 保存spu   /admin/product/saveSpuInfo   修改 POST /admin/product/updateSpuInfo
export const reqAddOrUpdateSpu=(spuInfo)=>{
  if(spuInfo.id){
    return request({url:'/admin/product/updateSpuInfo',data:spuInfo,method:'post'});
  }else{
    return request({url:'/admin/product/saveSpuInfo',data:spuInfo,method:'post'});
  }
};

// 删除spu DELETE /admin/product/deleteSpu/{spuId}
export const reqDeleteSpu=(spuId)=>request({url:`/admin/product/deleteSpu/${spuId}`,method:'delete'});


// 获取销售属性列表 GET /admin/product/spuSaleAttrList/{spuId}
export const reqSpuSaleAttrList = (spuId) => request({url:`/admin/product/spuSaleAttrList/${spuId}`,method:'get'});

// 获取平台属性的数据   GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrInfoList = (category1Id,category2Id,category3Id) => request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'});

// 添加sku  POST /admin/product/saveSkuInfo
export const reqAddSku = (skuInfo) =>request({url:'/admin/product/saveSkuInfo',data:skuInfo,method:'post'});

// 获取sku列表的数据  GET /admin/product/findBySpuId/{spuId}
export const reqSkuList=(spuId)=>request({url:`/admin/product/findBySpuId/${spuId}`,method:'get'});


























