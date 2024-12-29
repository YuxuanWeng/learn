import { User } from '@fepkg/services/types/bdm-common';
import { Post, ProductType } from '@fepkg/services/types/bdm-enum';

/** 本系统相关的业务产品 */
export const AccessProductTypeList = [ProductType.BNC, ProductType.BCO, ProductType.NCD];

export const isPostBackstage = (user: User | undefined) => {
  return user?.post === Post.Post_Backstage;
};

export const getUserProductList = (user?: User) => {
  return isPostBackstage(user)
    ? AccessProductTypeList
    : user?.product_list
        ?.map(p => p.product_type)
        .filter(p => AccessProductTypeList.includes(p))
        .sort((a, b) => a - b);
};
