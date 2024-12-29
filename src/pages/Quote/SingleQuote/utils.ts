import { TraderWithPref } from '@fepkg/business/components/Search/TraderSearch';
import { getDefaultExerciseType } from '@fepkg/business/utils/bond';
import { SERVER_NIL } from '@fepkg/common/constants';
import { Broker, Institution, InstitutionTiny, TraderLite, User } from '@fepkg/services/types/common';
import { BondQuoteType, ProductMarkType, ProductType, Side } from '@fepkg/services/types/enum';
import { SingleQuoteDialogConfig } from 'app/types/dialog-config';
import { isNil, omit } from 'lodash-es';
import { transFormExerciseToBoolean } from '@/components/business/ExerciseGroup/utils';
import { PriceState } from '@/components/business/PriceGroup';
import { isBroker } from '@/components/business/Search/BrokerSearch';
import { miscStorage } from '@/localdb/miscStorage';
import { IntentionField } from './constants';
import { QuoteActionMode, SingleQuoteDialogContext } from './types';

export const getSingleQuoteDialogConfig = (productType: ProductType, ctx: SingleQuoteDialogContext) => {
  return {
    config: {
      ...SingleQuoteDialogConfig,
      custom: {
        ...SingleQuoteDialogConfig.custom,
        routePathParams: [productType.toString()],
        context: omit(ctx, 'onSuccess', 'onCancel')
      }
    },
    callback: {
      onSuccess: () => ctx.onSuccess?.(),
      onCancel: () => ctx.onCancel?.(),
      onError: () => ctx.onCancel?.()
    }
  };
};

/** 将 Broker 转换为 User */
export const transform2User = (broker?: Broker) => {
  if (!broker) return void 0;
  const { broker_id, name_zh, name_en, account, account_status, product_list } = broker;
  return { user_id: broker_id, name_cn: name_zh, name_en, account, account_status, product_list } as User;
};

/** 将 User 转换为 Broker */
export const transform2Broker = (user?: User) => {
  if (!user) return void 0;
  const { user_id, name_cn, name_en, account, account_status, product_list } = user;
  return { broker_id: user_id, name_zh: name_cn, name_en, account, account_status, product_list } as Broker;
};

/** 结合 TraderLite 和 InstitutionTiny 转换为 TraderWithTag */
export const transform2TraderWithTag = (trader?: TraderLite, inst?: InstitutionTiny) => {
  if (!trader) return void 0;
  const result = {
    ...trader,
    inst_info: inst as Institution,
    tag: trader?.trader_tag,
    key: `${trader.trader_id}${trader?.trader_tag}`
  } as unknown as TraderWithPref;
  return result;
};

/** 将 TraderWithTag 转换为 TraderLite */
export const transform2TraderLite = (productType: ProductType, trader?: TraderWithPref): TraderLite | undefined => {
  if (!trader) return void 0;
  return {
    ...trader,
    trader_tag_list: trader?.tags,
    is_vip:
      trader?.product_marks?.some(
        item => item.product.product_type === productType && item.marks?.includes(ProductMarkType.VIP)
      ) ?? false
  };
};

export const getDefaultInst = (mode?: QuoteActionMode, inst?: InstitutionTiny) => {
  switch (mode) {
    case QuoteActionMode.EDIT:
    case QuoteActionMode.EDIT_UNREFER:
      return inst;
    default:
      return void 0;
  }
};

export const getDefaultTraderWithTag = (mode?: QuoteActionMode, lite?: TraderLite) => {
  switch (mode) {
    case QuoteActionMode.EDIT:
    case QuoteActionMode.EDIT_UNREFER:
      // 这个方法原本在报价弹窗中是给交易员搜索用的，所以需要转为TraderWithTag
      // 现在给机构交易员搜索用了，仍然只在报价弹窗中，这里不用转为traderWithTag
      // return transform2TraderWithTag(lite);
      return lite;
    default:
      return void 0;
  }
};

export const getDefaultBroker = (mode?: QuoteActionMode, broker?: Broker) => {
  switch (mode) {
    case QuoteActionMode.EDIT:
    case QuoteActionMode.EDIT_UNREFER:
      return transform2User(broker);
    default:
      if (miscStorage?.userInfo?.post && isBroker(miscStorage.userInfo)) {
        return miscStorage.userInfo;
      }
      return void 0;
  }
};

/** 过滤掉服务端给的-1数据 */
export const filterServerNil = <T>(target?: Partial<T>) => {
  if (!target) return undefined;
  const filterValue: Partial<T> = {};
  for (const item in target) {
    if (target[item] === SERVER_NIL) filterValue[item] = undefined;
    else filterValue[item] = target[item];
  }
  return filterValue;
};

/** 根据当前报价信息，判断是否是意向价 */
export const formatFlagIntention = (pricePart?: PriceState, volume?: number, defaultIntention?: boolean) => {
  const quotePrice = pricePart?.quote_price;

  // case 1: 如果价格不存在 && 量不存在 && 未点亮返点，则认为是一条空报价
  if (!quotePrice && !volume && !pricePart?.flag_rebate) return defaultIntention;

  // case 2: 价格输入为0, 量为空/不为空都视为意向价
  if ((!quotePrice || !parseFloat(quotePrice ?? '') || quotePrice === '.') && !pricePart?.flag_rebate) return true;

  // case 3: 价格为意向价字样， 视为意向价
  if (IntentionField.includes(quotePrice || '')) return true;
  return defaultIntention;
};

export const has = <T>(val?: T): val is T => !isNil(val);
export const hasPrice = (val?: number): val is number => has(val) && val !== SERVER_NIL && val !== 0;

/** 换方向的执行函数 */
export const exchangeFn = <T>(draft: { [Side.SideBid]?: T; [Side.SideOfr]?: T }) => {
  const bid = draft[Side.SideBid];
  const ofr = draft[Side.SideOfr];
  draft[Side.SideBid] = ofr;
  draft[Side.SideOfr] = bid;
};

/** 将string | undefined 转换成支持后端的Number */
export const transformStrToNum = (val?: string) => {
  if (val === undefined || val === '' || val === '.' || val === '0') return SERVER_NIL;
  if (val !== undefined && Number(val) === 0) return SERVER_NIL;
  return Number(val);
};

/** 切换根元素透明度 */
export const toggleRootElOpacity = (open: boolean) => {
  const el = document.documentElement;

  if (open) el.style.opacity = '1';
  else el.style.opacity = '0';
};

/** 获取行权/到期
 * @param params
 * @param isHasOption boolean 是否是含权债，如果为false，则返回原始值
 * @param ignore boolean 是否忽略修改，如果为true，则返回原始值
 * @returns
 */
export const getExercise = (
  params: { productType: ProductType; quote_type?: BondQuoteType; is_exercise?: boolean; exercise_manual?: boolean },
  isHasOption: boolean,
  ignore = false
) => {
  const isCleanPrice = params.quote_type === BondQuoteType.CleanPrice;
  /** 如果为净价，则视为到期收益率 */
  if (isHasOption && isCleanPrice && !ignore) return { is_exercise: false, exercise_manual: false };
  const defaultExercise = getDefaultExerciseType(params.productType, params.quote_type ?? BondQuoteType.Yield);
  if (!params.exercise_manual && isHasOption) {
    return {
      is_exercise: transFormExerciseToBoolean(defaultExercise) as boolean,
      exercise_manual: params.exercise_manual
    };
  }

  return { is_exercise: params.is_exercise, exercise_manual: params.exercise_manual };
};

/** 意向价净价时，视为收益率 */
export const transformQuoteType = (flag_intention?: boolean, quote_type?: BondQuoteType) => {
  if (flag_intention && quote_type === BondQuoteType.CleanPrice) return BondQuoteType.Yield;
  return quote_type;
};
