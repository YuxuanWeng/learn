import { HTMLAttributes, forwardRef, useMemo } from 'react';
import cx from 'classnames';
import { Popover } from '@fepkg/components/Popover';
import { Product } from '@fepkg/services/types/bdm-common';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import IPCEventEnum from 'app/types/IPCEvents';
import { ProductType2AccessCodeMap } from '@/common/constants/auth';
import { useUserQuery } from '@/common/hooks/useUserQuery';
import { useAccess } from '@/common/providers/AccessProvider';
import { isProd } from '@/common/utils';
import { getNCDAccess } from '@/common/utils/access';
import { useProductParams } from '@/layouts/Home/hooks';
import { miscStorage } from '@/localdb/miscStorage';

type ProductItemProps = HTMLAttributes<HTMLDivElement> & {
  productType?: ProductType;
};

const ProductItemMap: Record<
  ProductType.BCO | ProductType.BNC | ProductType.NCDP | ProductType.NCD,
  { label: string; cls: string }
> = {
  [ProductType.BCO]: { label: '信用', cls: 'text-gray-000 bg-secondary-100 hover:bg-secondary-000' },
  [ProductType.BNC]: { label: '利率', cls: 'text-gray-700 bg-primary-100 hover:bg-primary-000' },
  [ProductType.NCDP]: { label: '存单', cls: 'text-gray-700 bg-orange-100 hover:bg-orange-000' },
  [ProductType.NCD]: { label: '存单', cls: 'text-gray-700 bg-orange-100 hover:bg-orange-000' }
};

const ProductItem = forwardRef<HTMLDivElement, ProductItemProps>(({ productType, className, ...restProps }, ref) => {
  if (!productType) return null;

  const item = ProductItemMap[productType];

  return (
    <div
      ref={ref}
      className={cx('flex-center w-9 h-9 text-sm font-bold rounded-lg select-none cursor-pointer', item.cls, className)}
      {...restProps}
    >
      {item.label}
    </div>
  );
});

/** 暂时只支持 BNC，BCO，NCDP，NCD */
const InitProductTypes = new Set([ProductType.BNC, ProductType.BCO, ProductType.NCDP, ProductType.NCD]);

const handleItemClick = (type: ProductType) => {
  miscStorage.productType = type;
  window.Main.invoke(IPCEventEnum.SwitchProductType, type);
};

export const ProductSwitch = () => {
  const { productType } = useProductParams();
  const { access } = useAccess();
  const { data, refetch } = useUserQuery();

  const products = useMemo<Product[]>(() => {
    let list = data?.product_list ?? [];
    list = list.filter(
      item =>
        InitProductTypes.has(item.product_type) &&
        item.product_type !== productType &&
        access?.has(ProductType2AccessCodeMap[item.product_type])
    );

    const ncdAccess = getNCDAccess();
    if (ncdAccess.ncdP && ncdAccess.ncd) {
      let removeProductType = ProductType.NCDP;
      // 如果同时有 NCD 一/二级权限，若选中了一/二级，需要将另一级选项移除
      if (productType === ProductType.NCDP) removeProductType = ProductType.NCD;
      else if (productType === ProductType.NCD) removeProductType = ProductType.NCDP;

      list = list.filter(item => item.product_type !== removeProductType);
    }

    return list;
  }, [data?.product_list, access, productType]);

  // const content = (isProd() ? products?.filter(v => v.product_type !== ProductType.BCO) : products)?.map(item => {
  const content = products?.map(item => {
    const { product_type } = item;
    return (
      <ProductItem
        key={product_type}
        productType={product_type}
        onClick={() => handleItemClick(product_type)}
      />
    );
  });

  const showPopover = !!content?.length;

  return (
    <Popover
      trigger="click"
      content={content}
      arrow={false}
      // 没有台子权限时不展示 popover，open 始终为 false
      open={showPopover ? undefined : false}
      offset={4}
      placement="top"
      floatingProps={{ className: '!min-w-[44px] !gap-1 !p-[3px] !rounded-[10px]' }}
    >
      <ProductItem
        productType={productType}
        onClick={() => {
          // 更新miscStorage.userInfo
          refetch();
        }}
      />
    </Popover>
  );
};
