import { message as MessageUtils } from '@fepkg/components/Message';
import { BondQuoteType, ProductType, QuoteDraftDetailStatus, Side } from '@fepkg/services/types/enum';
import { LocalQuoteDraftMessage } from '@/common/services/hooks/local-server/quote-draft/types';
import {
  getDefaultTagsByProduct,
  justifyTradedDateLaterThanDeListing,
  liqSpeedListAddTradeDay
} from '@/common/utils/liq-speed';
import { QuoteParamsType, checkQuoteSideParams } from '@/pages/Quote/SingleQuote/QuoteOper/QuoteOperProvider';
import { QuoteReminder, checkQuoteReminder } from '@/pages/Quote/SingleQuote/Reminder';
import { CalcPriceQueryVar } from '@/pages/Quote/SingleQuote/hooks/useCalcPriceQuery';
import { getGroupDetailIndexCache, isOtherProcessing, reorderDetailIndexCache } from '.';
import { CheckErrorItem, showCheckErrorModal } from '../components/CheckErrorModal';
import { DraftGroupTableMessageData } from '../types/table';

/** 检查是否有其他用户正在编辑 */
const checkOtherProcessing = ({
  message,
  otherProcessing
}: {
  message?: LocalQuoteDraftMessage;
  otherProcessing?: boolean;
}) => {
  let res = !!otherProcessing;

  if (message) {
    const { operator_info, modified_status } = message;
    res = isOtherProcessing(operator_info?.user_id, modified_status);
  }

  if (res) MessageUtils.warning('其他用户正在编辑！');
  return res;
};

/** 检查是否有选中数据 */
const checkSelected = (selected?: DraftGroupTableMessageData): selected is DraftGroupTableMessageData => {
  const res = !!selected;
  if (!res) MessageUtils.error('未选中可编辑数据！');
  return res;
};

/** 检查基础信息 */
const checkBasic = (target?: DraftGroupTableMessageData) => {
  if (!checkSelected(target)) return false;

  // 检查必填字段
  const { inst_info, trader_info, broker_info } = target.original;

  let msg = '';
  if (!inst_info?.inst_id) msg = '未获取到机构数据！请核对后重新录入！';
  else if (!trader_info?.trader_id) msg = '未获取到交易员数据！请核对后重新录入！';
  else if (!broker_info?.user_id) msg = '未获取到经纪人数据！请核对后重新录入！';

  if (msg) MessageUtils.error(msg);
  return !msg;
};

/** 检查报价是否合法 */
const checkQuote = (target?: DraftGroupTableMessageData) => {
  if (!checkSelected(target)) return false;

  const details = target.original?.detail_list ?? [];

  const invalidIdxList: number[] = [];

  for (let i = 0, len = details.length; i < len; i++) {
    const detail = details[i];
    const { side, status } = detail;

    if (status !== QuoteDraftDetailStatus.QuoteDraftDetailStatusIgnored) {
      if (!side || !checkQuoteSideParams(side, { [side]: detail }, detail?.price)) invalidIdxList.push(i + 1);
    }
  }

  const invalid = invalidIdxList.length;
  if (invalid) MessageUtils.error(`第${invalidIdxList.join('、')}行，报价不合法`);
  return !invalid;
};

/** 检查重复报价 */
const checkRepeat = (target?: DraftGroupTableMessageData) => {
  if (!checkSelected(target)) return false;

  const details = target.original?.detail_list ?? [];

  const repeatedList: CheckErrorItem[] = [];
  const repeatedCache = new Map<string, CheckErrorItem>();

  for (let i = 0, len = details.length; i < len; i++) {
    const { side, flag_internal, bond_info, status } = details[i];
    if (status === QuoteDraftDetailStatus.QuoteDraftDetailStatusIgnored) continue;

    // 找是否有同一方向，同明暗的重复报价
    if (bond_info?.key_market && side) {
      const cacheKey = `${bond_info.key_market}_${side}_${flag_internal}`;

      const cache = repeatedCache.get(cacheKey);
      repeatedCache.set(cacheKey, {
        bondCode: bond_info.display_code,
        bondName: bond_info.short_name,
        idx: [...(cache?.idx || []), i + 1]
      });
    }
  }

  // 遍历 repeatedCache，找到所存储 list 长度不为 1 的 key，并把相应的 list 丢进 repeatedIdxList 内
  repeatedCache.forEach(cache => {
    if (cache.idx.length > 1) repeatedList.push(cache);
  });

  const repeated = repeatedList.some(v => v.idx.length);

  if (repeated) showCheckErrorModal({ title: '报价失败，存在相同的产品：', value: repeatedList });
  return !repeated;
};

/** 检查交易日信息 */
const checkTradeDate = async (productType: ProductType, target?: DraftGroupTableMessageData) => {
  if (!checkSelected(target)) return false;

  const details = target.original?.detail_list ?? [];

  const invalidList: CheckErrorItem[] = [];

  const judgeRes = await Promise.all(
    details.map(async detail => {
      const { bond_info, liquidation_speed_list = [], status } = detail;
      if (status === QuoteDraftDetailStatus.QuoteDraftDetailStatusIgnored) {
        return { bondCode: bond_info?.display_code, bondName: bond_info?.short_name, later: false };
      }

      const { liqSpeeds, hasDefault } = getDefaultTagsByProduct(liquidation_speed_list, productType);
      const liqSpeedList = await liqSpeedListAddTradeDay(liqSpeeds);
      const later = justifyTradedDateLaterThanDeListing(
        hasDefault,
        liqSpeedList,
        productType,
        bond_info?.delisted_date
      );
      return { bondCode: bond_info?.display_code, bondName: bond_info?.short_name, later };
    })
  );

  judgeRes.forEach((item, idx) => item.later && invalidList.push({ ...item, idx: [idx + 1] }));

  const invalid = invalidList.length;
  if (invalid) showCheckErrorModal({ title: '报价失败，交易日晚于或等于下市日：', value: invalidList });
  return !invalid;
};

/** 检查倒挂信息 */
const checkInvert = async (
  productType: ProductType,
  target?: DraftGroupTableMessageData
): Promise<[boolean, QuoteReminder[]]> => {
  if (!checkSelected(target)) return [false, []];

  const details = target.original?.detail_list ?? [];

  const orders = target.original?.detail_order_list ?? [];

  const detailIdxCache = reorderDetailIndexCache(getGroupDetailIndexCache(orders));

  const calcPriceQueryVars: CalcPriceQueryVar[] = [];

  for (let i = 0, len = details.length; i < len; i++) {
    const detail = details[i];
    const { bond_info: bond, side, status } = detail;
    if (status === QuoteDraftDetailStatus.QuoteDraftDetailStatusIgnored) continue;

    const quote = { ...detail, quote_price: detail?.price } as QuoteParamsType;
    if (detail?.quote_type === BondQuoteType.Yield) quote.yield = quote?.quote_price;
    else if (detail?.quote_type == BondQuoteType.CleanPrice) quote.clean_price = quote?.quote_price;

    const queryVar: CalcPriceQueryVar = {
      bond,
      bidIsValid: false,
      ofrIsValid: false,
      quoteParams: {}
    };

    const index = detailIdxCache.get(detail.detail_id);

    if (side === Side.SideBid) {
      queryVar.bidIsValid = true;
      queryVar.bidIndex = index;
      queryVar.quoteParams[Side.SideBid] = quote;
    } else if (side === Side.SideOfr) {
      queryVar.ofrIsValid = true;
      queryVar.ofrIndex = index;
      queryVar.quoteParams[Side.SideOfr] = quote;
    }

    if (bond) calcPriceQueryVars.push(queryVar);
  }

  return checkQuoteReminder({ batch: true, productType, calcPriceQueryVars });
};

export const checkUtils = {
  /** 检查是否有其他用户正在编辑 */
  checkOtherProcessing,
  /** 检查是否有选中数据 */
  checkSelected,
  /** 检查基础信息 */
  checkBasic,
  /** 检查报价是否合法 */
  checkQuote,
  /** 检查重复报价 */
  checkRepeat,
  /** 检查交易日信息 */
  checkTradeDate,
  /** 检查倒挂信息 */
  checkInvert
};
