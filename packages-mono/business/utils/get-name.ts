/** 获取机构交易员 */
import { Institution, Trader } from '@fepkg/services/types/common';
import { ProductType } from '@fepkg/services/types/enum';
import { transformProductType } from '../constants/map';

// 只要是机构交易员组合，机构简称就一定优先展示业务简称
type InstProps = {
  inst?: Partial<Institution>;
  /** 当前场景的产品类型 */
  productType?: ProductType;
};

type CPProps = InstProps & {
  trader?: Partial<Trader>;
  /** 当机构交易员为空时占位的字符 */
  placeholder?: string;
};

export const CP_NONE = '机构待定';

/**
 * 传入机构，获取当前机构简称，优先返回当前机构对应产品的业务简称
 */
export const getInstName = ({ inst, productType = ProductType.ProductTypeNone }: InstProps) => {
  if (!inst) return '';
  const { biz_short_name_list, short_name_zh } = inst;
  const productCode = transformProductType(productType).en;
  // 对应产品类型的机构业务简称list
  const bizNameList = biz_short_name_list?.filter(i => {
    // 兜底----type和code有一个符合BNC就认为这个数据是需要的
    return i?.product?.product_code === productCode || i?.product?.product_type === productType;
  })[0]?.name_list;
  // 如果需要优先考虑业务简称且有业务简称就返回第一个业务简称
  if (bizNameList && bizNameList.length > 0) return bizNameList[0];
  // 默认返回机构简称
  return short_name_zh ?? '';
};

/**
 * 机构交易员中的机构永远都是优先展示机构业务简称，其次才展示机构简称
 * @returns 机构(交易员)
 */
export const getCP = ({ inst, trader, productType, placeholder }: CPProps) => {
  let result = '';
  let instName = getInstName({ inst, productType });
  // 优先展示inst中的结果，inst不存在时才使用trader中的inst_info
  if (trader?.inst_info) instName = instName || getInstName({ inst: trader.inst_info, productType });
  const traderName = trader?.name_zh ?? '';
  if (instName && traderName) result = `${instName}(${traderName})`;
  else if (instName) result = instName;
  else if (traderName) result = traderName;
  else if (placeholder) result = placeholder;
  return result;
};
