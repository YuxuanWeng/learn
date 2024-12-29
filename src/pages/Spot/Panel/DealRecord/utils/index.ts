import { ExerciseTypeMap } from '@fepkg/business/constants/map';
import { getNextTradedDate } from '@fepkg/business/hooks/useDealDateMutation';
import { dealDateManager } from '@fepkg/business/utils/data-manager/deal-date-manager';
import { getCP, getInstName } from '@fepkg/business/utils/get-name';
import { SERVER_NIL } from '@fepkg/common/constants';
import { formatDate } from '@fepkg/common/utils/date';
import {
  Counterparty,
  DealConfirmSnapshot,
  DealConfirmTradeInfo,
  DealRecord,
  FiccBondBasic,
  LiquidationSpeed,
  User
} from '@fepkg/services/types/common';
import {
  BondCategory,
  BondDealStatus,
  BondQuoteType,
  DealHandOverStatus,
  DealReadStatus,
  DealType,
  ExerciseType,
  LiquidationSpeedTag,
  OperationSource,
  ProductType
} from '@fepkg/services/types/enum';
import { isEmpty, isEqual, max } from 'lodash-es';
import moment from 'moment';
import { isFRALiquidation } from '@packages/utils/liq-speed';
import { isLGB } from '@/components/IDCBoard/utils';
import { DetailShowConfig } from '@/components/IDCDealDetails/hooks/usePreference';
import { DiffDealType } from '@/components/IDCDealDetails/type';
import { BuySold, DealRecordContextEnum, RecordContextMenuItem } from '@/components/IDCHistory/types';
import { miscStorage } from '@/localdb/miscStorage';
import { getDiffModalDataBySnapshot } from '@/pages/Deal/Detail/components/DiffModal.tsx/util';
import { TypeDealRecord } from '../types';

/**
 * 判断我是买方还是卖方，我的指定人拥有跟我一样的逻辑
 * @param info 成交记录
 * @param ids 代表我方的id集合
 * @returns 买方或者卖方的判断
 */
export const getBuySold = (info?: DealRecord, ids?: string[], needForceSelf = false): BuySold => {
  if (ids?.length === 0 || !info) return BuySold.None;
  const { spot_pricinger, spot_pricingee, deal_type } = info;

  // needForceSelf: 若其中一方直接为本人，则忽略授权人配置，本人一定仅视为其中一方
  const spot =
    ids?.includes(spot_pricinger?.broker?.user_id ?? '') &&
    (miscStorage.userInfo?.user_id !== spot_pricingee?.broker?.user_id || !needForceSelf);

  const beSpot =
    ids?.includes(spot_pricingee?.broker?.user_id ?? '') &&
    (miscStorage.userInfo?.user_id !== spot_pricinger?.broker?.user_id || !needForceSelf);

  // 即是点价又是被点价，我即是买方又是卖方
  if (spot && beSpot) return BuySold.All;
  // 即不是点价也不是被点价，我即不是买方也不是卖方，这种情况暂不考虑
  if (!spot && !beSpot) return BuySold.None;
  let result: BuySold;

  switch (deal_type) {
    case DealType.TRD:
    case DealType.GVN: {
      // 我是点价方，我GVN/出给对方，我是卖方，反之我是买方
      if (spot) result = BuySold.Sold;
      else result = BuySold.Buy;
      break;
    }

    case DealType.TKN: {
      // 我是点价方，我TKN对方，我是买方，反之我是卖方
      if (spot) result = BuySold.Buy;
      else result = BuySold.Sold;
      break;
    }
    default:
      result = BuySold.None;
      break;
  }
  return result;
};

/** 获取查看按钮状态 */
export const getViewDiffState = (historyInfo?: DealRecord, ids?: string[]) => {
  const canShow = Math.abs(+(historyInfo?.create_time ?? 0) - Date.now()) >= 5 * 60 * 1000;
  const buySold = getBuySold(historyInfo, ids);

  const bidStatus = {
    showViewBtn: !!historyInfo?.bid_deal_read_status && historyInfo?.bid_deal_read_status !== DealReadStatus.Read,
    hightLight: !!historyInfo?.bid_deal_read_status && historyInfo?.bid_deal_read_status === DealReadStatus.CurUnread
  };

  const ofrStatus = {
    showViewBtn: !!historyInfo?.ofr_deal_read_status && historyInfo?.ofr_deal_read_status !== DealReadStatus.Read,
    hightLight: !!historyInfo?.ofr_deal_read_status && historyInfo?.ofr_deal_read_status === DealReadStatus.CurUnread
  };

  switch (buySold) {
    // 买方对应bid
    case BuySold.Buy:
      return {
        ...bidStatus,
        canShow
      };
    // 卖方对应ofr
    case BuySold.Sold:
      return {
        ...ofrStatus,
        canShow
      };
    default:
      if ((bidStatus.showViewBtn && bidStatus.hightLight) || (ofrStatus.showViewBtn && ofrStatus.hightLight)) {
        return {
          showViewBtn: true,
          hightLight: true,
          canShow
        };
      }

      return {
        showViewBtn: false,
        hightLight: false,
        canShow
      };
  }
};

/** 全部确认和部分确认都是确认状态 */
export const confirmedStatus = [BondDealStatus.DealConfirmed, BondDealStatus.DealPartConfirmed];

// 根据结算方式获取交易日交割日
// 暂不支持周几的形式
export const getTrdAndDelDate = (liq: LiquidationSpeed, listedDate?: string) => {
  const range = dealDateManager.getDealDateRange();

  const isUnlisted = !!listedDate && +listedDate > moment().startOf('day').valueOf();
  const today = isUnlisted ? listedDate : moment().startOf('day').valueOf().toString();
  // 未上市债券的明天+0/明天+1与+0/+1相同
  const tomorrow = isUnlisted
    ? today
    : moment(getNextTradedDate(formatDate(today)))
        .valueOf()
        .toString();

  const tradedDate =
    {
      [LiquidationSpeedTag.Today]: today,
      [LiquidationSpeedTag.Tomorrow]: tomorrow
    }[liq.tag ?? ''] ?? liq.date;

  const index = range.findIndex(i => i === tradedDate);

  if (tradedDate == null || index === -1)
    return {
      tradedDate: '',
      deliveryDate: ''
    };

  const deliveryDate = range[index + (liq.offset ?? 0)];

  return {
    tradedDate,
    deliveryDate
  };
};

const formatNum = (num = 0) => num.toFixed(4).replace(/0{1,2}$/, '');

/**
 * 判断两个交割方式是否相同，然后再返回格式化后的交割方式。交易日有现成的，不需要通过工具函数转换
 * @param bid bid方交割方式
 * @param ofr ofr方交割方式
 * @param bidDate bid交易日
 * @param ofrDate ofr交易日
 * @param exchange 交易所
 * @returns 返回的结果只有+0/+1/T+1/T+0，没有明天和周几的情况
 */
export const getSettlementType = (
  bid?: LiquidationSpeed,
  ofr?: LiquidationSpeed,
  bidDate?: string,
  ofrDate?: string,
  exchange?: boolean
) => {
  const isSame = isEqual(bid, ofr);
  const bidTrdDate = formatDate(bidDate, 'MM.DD');
  const ofrTrdDate = formatDate(ofrDate, 'MM.DD');
  let bidRes = '';
  let ofrRes = '';

  const isLiqToday = (liq: LiquidationSpeed) => {
    return (
      (liq.tag === LiquidationSpeedTag.Today || liq.date === moment().startOf('day').valueOf().toString()) &&
      liq.offset <= 1
    );
  };

  if (bid) bidRes = isLiqToday(bid) ? `+${bid.offset}` : `${bidTrdDate}+${bid.offset}`; // +0/+1/3.8+1
  if (ofr) ofrRes = isLiqToday(ofr) ? `+${ofr.offset}` : `${ofrTrdDate}+${ofr.offset}`;

  // 是交易所，交割方式就一定一样，交割日期取一方即可
  if (exchange) {
    return `${bidTrdDate}交易所`;
  }

  // 交割方式一样但不是交易所，取其中一方展示
  // 交割方式可能形式不同但计算结果相等
  if (isSame || bidRes === ofrRes) return bidRes;
  return `${bidRes}/${ofrRes}`;
};

/** 获取对手方的信息 */
export const getOtherInfo = (info?: DealRecord | undefined) => {
  const { userInfo } = miscStorage;
  // 这里应该根据我是否为点价方来判断对手方，而不是通过我是不是买方来判断
  const mySide = info?.spot_pricinger?.broker?.user_id === userInfo?.user_id;
  let result = info?.spot_pricinger;
  if (mySide) result = info?.spot_pricingee;
  return result;
};

/**
 *【地方债类型】“一般债”、“普通专项”、特殊专项（专项类型名称，去除“专项”2字）。
 * @param bond
 * @returns 地方债类型为一般债券、普通专项，则直接显示这两个词。其余是取category，去掉“专项”二字
 */
export const getIdcLGB = (bond?: FiccBondBasic) => {
  if (bond?.bond_category !== BondCategory.LGB) return '';
  if (bond.fund_objective_sub_category === '一般债券' || bond.fund_objective_sub_category === '普通专项')
    return bond.fund_objective_sub_category;
  return bond.fund_objective_category?.replace('专项', '');
};

/** 获取复制的机构-a机构出给b机构 */
export const getCopyInst = (
  spotInst?: Counterparty,
  beSpotInst?: Counterparty,
  dealType?: DealType,
  productType?: ProductType
) => {
  const aInst = spotInst?.inst ? getInstName({ inst: spotInst.inst, productType }) : '机构待定';
  const bInst = beSpotInst?.inst ? getInstName({ inst: beSpotInst.inst, productType }) : '机构待定';
  switch (dealType) {
    case DealType.GVN:
    case DealType.TRD:
      return `${aInst} 出给 ${bInst}`;
    case DealType.TKN:
      return `${bInst} 出给 ${aInst}`;
    default:
      return '';
  }
};

/**
 * 话术信息 --发送/复制
 * @param info 成交记录信息
 * @param isHistory 是否是历史成交
 * @param isBid 是否复制bid方信息
 * @param dealDetailConfig 成交明细相关设置，没有则不考虑
 * @returns 返回话术信息list
 */
export const getDialoguesText = (info: TypeDealRecord, isBid = false, dealDetailConfig?: DetailShowConfig) => {
  const {
    bond_info,
    bid_traded_date,
    ofr_traded_date,
    send_order_msg,
    bid_send_order_msg,
    ofr_send_order_msg,
    deal_type,
    flag_bridge
  } = info;
  const { spot_pricinger, spot_pricingee } = info;
  const settlementType = isBid ? info.bid_settlement_type?.at(0) : info.ofr_settlement_type?.at(0);
  const trdDate =
    (isBid
      ? info?.bid_settlement_type?.at(0)?.date ?? bid_traded_date
      : info?.ofr_settlement_type?.at(0)?.date ?? ofr_traded_date) ?? '';

  const isFar = isFRALiquidation(settlementType);

  // 【交割方式】+0、+1、日期+0、日期+1。备注为“交易所”，则展示为“交易日+交易所”（11.04交易所）。
  const settlement = getSettlementType(settlementType, settlementType, trdDate, trdDate, info.flag_exchange);

  // 剩余期限
  const remainingPeriod = bond_info?.time_to_maturity ?? '';
  // 债券代码 银行间债券若无跨市场，则隐藏".IB‘’后缀。续发债在债券代码后显示“X续发次数”，以表示和现券的区别。远期交易则在债券代码后标注，“（交易日 远）”
  const bondCode = isFar ? `${bond_info?.display_code}(${formatDate(trdDate, 'MM.DD')} 远)` : bond_info?.display_code;
  // 债券简称
  const bondShortName = bond_info?.short_name ?? '';

  // 【成交价】净价或全价有特殊标注，收益率包含返点。行权或到期有特殊标注，默认则不显示。
  const price = () => {
    const remark =
      info.price_type === BondQuoteType.Yield
        ? ExerciseTypeMap[info.exercise_type ?? ExerciseType.ExerciseTypeNone]
        : '';
    switch (info.price_type) {
      case BondQuoteType.CleanPrice:
        return `${formatNum(info.price)}净价${remark}`;
      case BondQuoteType.FullPrice:
        return `${formatNum(info.price)}全价${remark}`;
      case BondQuoteType.Yield: {
        const noRebate = info.return_point == null || new Set([0, SERVER_NIL]).has(info.return_point);
        const rebate = noRebate ? '' : `F${formatNum(info.return_point)}`;
        return `${formatNum(info.price)}${rebate}${remark}`;
      }
      default:
        return '';
    }
  };

  // 成交量
  const volume = info.confirm_volume?.toString() ?? '';

  // 发单信息
  const message = (bid: boolean) => {
    // 不是过桥，返回发单信息
    if (!flag_bridge) {
      return send_order_msg ?? '';
    }
    if (bid) return bid_send_order_msg ?? '';
    return ofr_send_order_msg ?? '';
  };

  const result = [
    dealDetailConfig?.showSide && (isBid ? '买入' : '卖出'),
    (dealDetailConfig == null || dealDetailConfig?.showTimeRange) && remainingPeriod,
    bondCode,
    (dealDetailConfig == null || dealDetailConfig?.showShortName) && bondShortName,
    getIdcLGB(bond_info),
    price(),
    volume,
    settlement,
    getCopyInst(spot_pricinger, spot_pricingee, deal_type, info.bond_info?.product_type),
    message(isBid)
  ].filter(Boolean);

  return result.join('  ');
};

/**
 * 计算出成交记录的背景颜色
 * @param list 成交记录列表
 * @returns 带有背景颜色的成交记录列表
 */
export const getDealRecordList = (list?: DealRecord[], currentTime?: number): TypeDealRecord[] => {
  const today = moment(0, 'HH').valueOf();
  if (!list || list?.length === 0) return [];

  const result = [] as TypeDealRecord[];

  let lastSameGroupDeals = [] as TypeDealRecord[];

  list.forEach(cur => {
    const res: TypeDealRecord = { ...cur, isHistory: true };

    const hasRecordId = !isEmpty(cur.spot_pricing_record_id);
    const isOld = cur.create_time && +cur.create_time < today;
    if (!isOld) {
      res.isHistory = false;
      res.isDark = true;
      const prevSpotPricing = result?.[result.length - 1];
      const nextSpotPricing = list?.[result.length + 1];
      if (hasRecordId && prevSpotPricing?.spot_pricing_record_id === cur.spot_pricing_record_id) {
        res.isDark = prevSpotPricing?.isDark;
        lastSameGroupDeals.push(res);
      } else {
        lastSameGroupDeals = [res];
        if (prevSpotPricing?.isDark) {
          res.isDark = false;
        }
      }

      if (
        nextSpotPricing != null &&
        hasRecordId &&
        nextSpotPricing.spot_pricing_record_id !== cur.spot_pricing_record_id
      ) {
        // 区块全部确认完成
        const isAllEnd = lastSameGroupDeals.every(
          d =>
            d.deal_status != null &&
            [BondDealStatus.DealConfirmed, BondDealStatus.DealPartConfirmed, BondDealStatus.DealRefuse].includes(
              d.deal_status
            )
        );

        const lastConfirm = max(lastSameGroupDeals.map(d => Number(d.confirm_time || d.update_time)));

        const someChanged = lastSameGroupDeals.some(d => d.flag_deal_has_changed);
        const hasClone = lastSameGroupDeals.some(d => d.source === OperationSource.OperationSourceOffline);

        const groupCanShowSum =
          !(isAllEnd && (Math.abs((lastConfirm ?? 0) - (currentTime ?? Date.now())) >= 5 * 60 * 1000 || someChanged)) &&
          !hasClone;

        lastSameGroupDeals.forEach(d => {
          d.canShowSum = groupCanShowSum;
        });
      }
    }

    result.push(res);
    return result;
  });
  return result;
};

/**
 * 输入债券信息，判断是否为地方债，如果是则按要求返回简称或者地方债类型
 * @param info 债券信息
 * @returns [地方债类型, 简称, 简称+地方债类型, 地方债类型+简称]
 */
export const getShortName = (info?: FiccBondBasic) => {
  const shortName = info?.short_name ?? '';
  const type = getIdcLGB(info);
  if (isLGB(info)) return [type, shortName, shortName + type, type + shortName] as const;
  return ['', '', '', ''] as const;
};

type Permissions = {
  send: boolean;
  copy: boolean;
  clone: boolean;
  remind: boolean;
  del: boolean;
};

/**
 * 获取右键菜单选项
 * @param permissions 权限配置
 * @param val 单条成交记录
 */
export const getContextMenuOptions = (
  permissions: Permissions,
  val?: DealRecord,
  isBrokerSame = false,
  authIds: string[] = []
): RecordContextMenuItem[] => {
  const copyOptions: RecordContextMenuItem[] = [];
  const buySold = getBuySold(val, authIds);
  const productType = val?.bond_info?.product_type;

  const pricingee = val?.spot_pricingee;
  const pricinger = val?.spot_pricinger;

  if (permissions.copy) {
    const isBid = buySold === BuySold.All || buySold === BuySold.Buy;
    const isOfr = buySold === BuySold.All || buySold === BuySold.Sold;

    const isSpotter = (isBid && val?.deal_type === DealType.TKN) || (isOfr && val?.deal_type !== DealType.TKN);
    const isSpotted = (isBid && val?.deal_type !== DealType.TKN) || (isOfr && val?.deal_type === DealType.TKN);

    if (isSpotter) {
      copyOptions.push({
        label: `复制${getCP({ productType, inst: pricinger?.inst, trader: pricinger?.trader })}`,
        key: DealRecordContextEnum.SpotCopy
      });
    }

    if (isSpotted) {
      copyOptions.push({
        label: `复制${getCP({ productType, inst: pricingee?.inst, trader: pricingee?.trader })}`,
        key: DealRecordContextEnum.BeSpotCopy
      });
    }
  }

  const options = [...copyOptions];

  const bidBridgeOperator = val?.bid_add_bridge_operator;
  const ofrBridgeOperator = val?.ofr_add_bridge_operator;

  const hasBridge = bidBridgeOperator != null || ofrBridgeOperator != null;

  const bidCp = val?.deal_type === DealType.TKN ? val?.spot_pricinger : val?.spot_pricingee;
  const ofrCp = val?.deal_type !== DealType.TKN ? val?.spot_pricinger : val?.spot_pricingee;

  switch (val?.deal_status) {
    case BondDealStatus.DealRefuse:
    case BondDealStatus.DealConfirming:
      return [{ label: '删除', key: DealRecordContextEnum.Delete, disabled: !permissions.del }];
    default:
      if (bidCp?.trader && buySold !== BuySold.Sold) {
        options.unshift({
          label: `发送${buySold === BuySold.All ? ['-', bidCp.trader?.name_zh, '(Bid)'].join('') : ''}`,
          key: val?.deal_type === DealType.TKN ? DealRecordContextEnum.SpotSend : DealRecordContextEnum.BeSpotSend,
          disabled: !permissions.send
        });
      }

      if (ofrCp?.trader && buySold !== BuySold.Buy) {
        options.unshift({
          label: `发送${buySold === BuySold.All ? ['-', ofrCp.trader?.name_zh, '(Ofr)'].join('') : ''}`,
          key: val?.deal_type === DealType.TKN ? DealRecordContextEnum.BeSpotSend : DealRecordContextEnum.SpotSend,
          disabled: !permissions.send
        });
      }

      if (buySold === BuySold.All && !isBrokerSame) {
        options.push(
          {
            label: `克隆-${getCP({ productType, inst: pricinger?.inst, trader: pricinger?.trader })}`,
            key: DealRecordContextEnum.SpotClone,
            disabled: !permissions.clone
          },
          {
            label: `克隆-${getCP({ productType, inst: pricingee?.inst, trader: pricingee?.trader })}`,
            key: DealRecordContextEnum.BeSpotClone,
            disabled: !permissions.clone
          }
        );
      } else {
        options.push({ label: '克隆', key: DealRecordContextEnum.Clone, disabled: !permissions.clone });
      }

      if (val?.flag_bridge) {
        // 点亮过桥标识，但没有桥，则无催单项
        if (hasBridge) {
          const currentUserId = miscStorage.userInfo?.user_id;
          if (
            bidBridgeOperator?.user_id === ofrBridgeOperator?.user_id &&
            ofrBridgeOperator?.user_id !== currentUserId
          ) {
            options.push({
              label: `催单-${bidBridgeOperator?.name_cn}(加桥用户)`,
              key: DealRecordContextEnum.BothReminder,
              disabled: !permissions.remind
            });
          } else {
            if (bidBridgeOperator?.user_id !== currentUserId) {
              options.push({
                label: `催单-${bidBridgeOperator?.name_cn}(加桥用户)`,
                key:
                  val.deal_type === DealType.TKN
                    ? DealRecordContextEnum.SpotReminder
                    : DealRecordContextEnum.BeSpotReminder,
                disabled: !permissions.remind
              });
            }

            if (ofrBridgeOperator?.user_id !== currentUserId) {
              options.push({
                label: `催单-${ofrBridgeOperator?.name_cn}(加桥用户)`,
                key:
                  val.deal_type !== DealType.TKN
                    ? DealRecordContextEnum.SpotReminder
                    : DealRecordContextEnum.BeSpotReminder,
                disabled: !permissions.remind
              });
            }
          }
        }
      } else {
        const isDirectSpotter = miscStorage.userInfo?.user_id === val?.spot_pricinger?.broker?.user_id;
        const isAuthSpotter = !isDirectSpotter && authIds.includes(val?.spot_pricinger?.broker?.user_id ?? '');
        const isDirectSpotted = miscStorage.userInfo?.user_id === val?.spot_pricingee?.broker?.user_id;
        const isAuthSpotted = !isDirectSpotted && authIds.includes(val?.spot_pricingee?.broker?.user_id ?? '');

        const spotterName = val?.spot_pricinger?.broker?.name_cn;
        const spottedName = val?.spot_pricingee?.broker?.name_cn;

        const spotterId = val?.spot_pricinger?.broker?.user_id;
        const spottedId = val?.spot_pricingee?.broker?.user_id;

        // 双方经纪人都为本人，不展示催单项
        const isSelf = spotterId === spottedId && spotterId === miscStorage.userInfo?.user_id;

        if (!isSelf) {
          if (isDirectSpotted && !isDirectSpotter) {
            options.push({
              label: `催单-${spotterName}(对手方)`,
              key: DealRecordContextEnum.SpotReminder,
              disabled: !permissions.remind
            });
          } else if (!isDirectSpotted && isDirectSpotter) {
            options.push({
              label: `催单-${spottedName}(对手方)`,
              key: DealRecordContextEnum.BeSpotReminder,
              disabled: !permissions.remind
            });
            // 此处开始一定是双方均非直接本人
          } else if (spotterId === spottedId) {
            options.push({
              label: `催单-${spottedName}(对手方)`,
              key: DealRecordContextEnum.BothReminder,
              disabled: !permissions.remind
            });
          } else {
            if (isAuthSpotted) {
              options.push({
                label: `催单-${spotterName}(对手方)`,
                key: DealRecordContextEnum.SpotReminder,
                disabled: !permissions.remind
              });
            }
            if (isAuthSpotter) {
              options.push({
                label: `催单-${spottedName}(对手方)`,
                key: DealRecordContextEnum.BeSpotReminder,
                disabled: !permissions.remind
              });
            }
          }
        }
      }
      options.push({ label: '删除', key: DealRecordContextEnum.Delete, disabled: !permissions.del });

      return options;
  }
};

const getRemark = (
  remark?: Pick<
    DealRecord,
    | 'bid_traded_date'
    | 'bid_delivery_date'
    | 'bid_settlement_type'
    | 'ofr_traded_date'
    | 'ofr_delivery_date'
    | 'ofr_settlement_type'
    | 'flag_exchange'
    | 'exercise_type'
    | 'exercise_manual'
  >
) => {
  return [
    getSettlementType(
      remark?.bid_settlement_type?.at(0),
      remark?.ofr_settlement_type?.at(0),
      remark?.bid_traded_date,
      remark?.ofr_traded_date,
      remark?.flag_exchange
    ),
    remark?.exercise_type && ExerciseTypeMap[remark?.exercise_type]
  ]
    .filter(Boolean)
    .join('，');
};

export const getBrokersName = (brokerList: (User | undefined)[]) => {
  return brokerList
    .map(i => i?.name_cn)
    .filter(Boolean)
    .join(' ');
};

export const getShowHandOver = (historyInfo: DealRecord) => {
  return Boolean(
    historyInfo.bond_info?.key_market &&
      historyInfo.price &&
      historyInfo.confirm_volume &&
      historyInfo?.bid_delivery_date &&
      historyInfo?.ofr_delivery_date &&
      historyInfo.spot_pricinger?.inst?.inst_id &&
      historyInfo.spot_pricinger?.trader?.trader_id &&
      historyInfo.spot_pricinger?.broker?.user_id &&
      historyInfo.spot_pricingee?.inst?.inst_id &&
      historyInfo.spot_pricingee?.trader?.trader_id &&
      historyInfo.spot_pricingee?.broker?.user_id &&
      historyInfo?.hand_over_status === DealHandOverStatus.CanHandOver
  );
};

const cp2ConfirmTradeInfo = (
  cp: Counterparty,
  sendOrderInfo: string | undefined,
  productType: ProductType
): DealConfirmTradeInfo => {
  return {
    broker_id: cp.broker?.user_id,
    broker_name: cp.broker?.name_cn,
    broker_id_b: cp.broker_b?.user_id,
    broker_name_b: cp.broker_b?.name_cn,
    broker_id_c: cp.broker_c?.user_id,
    broker_name_c: cp.broker_c?.name_cn,
    broker_id_d: cp.broker_d?.user_id,
    broker_name_d: cp.broker_d?.name_cn,
    trader_id: cp.trader?.trader_id,
    trader_name: cp.trader?.name_zh,
    inst_id: cp.inst?.inst_id,
    inst_name: getInstName({ inst: cp.inst, productType }),
    send_order_info: sendOrderInfo ?? ''
  };
};

const dealRecord2Snapshot = (dealRecord: DealRecord, productType: ProductType): DealConfirmSnapshot | undefined => {
  const bidCp = dealRecord.deal_type === DealType.TKN ? dealRecord.spot_pricinger : dealRecord.spot_pricingee;
  const ofrCp = dealRecord.deal_type !== DealType.TKN ? dealRecord.spot_pricinger : dealRecord.spot_pricingee;

  if (bidCp == null || ofrCp == null) return undefined;

  const hasBridge = (dealRecord.bridge_list ?? []).length > 0;

  return {
    bid_deal_confirm_trade_info: cp2ConfirmTradeInfo(
      bidCp,
      hasBridge || dealRecord.flag_bridge ? dealRecord.bid_send_order_msg : dealRecord.send_order_msg,
      productType
    ),
    ofr_deal_confirm_trade_info: cp2ConfirmTradeInfo(
      ofrCp,
      hasBridge || dealRecord.flag_bridge ? dealRecord.ofr_send_order_msg : dealRecord.send_order_msg,
      productType
    ),
    bond_key_market: dealRecord.bond_info?.key_market ?? '',
    price: dealRecord.price ?? SERVER_NIL,
    confirm_volume: dealRecord.confirm_volume ?? SERVER_NIL,
    flag_bridge: (hasBridge || dealRecord.flag_bridge) ?? false,
    return_point: dealRecord.return_point,
    delivery_info_list: (dealRecord.child_deal_list ?? []).map(i => ({
      delivery_date: i.delivery_date ?? '',
      traded_date: i.traded_date ?? ''
    })),
    bid_delivery_info: {
      traded_date: dealRecord.bid_traded_date ?? '',
      delivery_date: dealRecord.bid_delivery_date ?? ''
    },
    ofr_delivery_info: {
      traded_date: dealRecord.ofr_traded_date ?? '',
      delivery_date: dealRecord.ofr_delivery_date ?? ''
    }
  };
};

export const getDealRecordSnapshotData = (
  dealRecord: TypeDealRecord,
  productType: ProductType,
  snapShot: DealConfirmSnapshot
): DiffDealType => {
  return getDiffModalDataBySnapshot(snapShot, dealRecord2Snapshot(dealRecord, productType));
};
