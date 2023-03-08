// 4个模块接口文件统一暴露
import * as tradeMark from "./product/tradeMark";
import * as attr from './product/attr';
import * as spu from './product/spu';
import * as sku from './product/sku';
// 引入权限接口文件
import * as user from'./acl/user'

import role from './acl/role'

import permission from './acl/permission'
// 对外暴露
export default {
  tradeMark,
  attr,
  spu,
  sku,
  user,
  role,
  permission
}
