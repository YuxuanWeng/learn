import { useLocalStorage } from '@fepkg/business/hooks/useLocalStorage';
import type { LiquidationSpeed } from '@fepkg/services/types/common';
import { LiquidationSpeedTag, ProductType } from '@fepkg/services/types/enum';
import { v4 as uuidv4 } from 'uuid';
import { LSKeys, getLSKey } from '@/common/constants/ls-keys';
import { CommentInputFlagValue } from '@/components/business/CommentInput';

// clear_speed 数据结构为 JSON.stringify(['周三 +1'])，序列化的字符串数组
export type Settlement = {
  /** 唯一标识符 */
  key: string;
  /** 显示文案 */
  label: string;
  /** 结算方法 */
  liq_speed_list?: LiquidationSpeed[];
  /** 备注 */
  comment?: string;
  /** 是否否选了结算方式复选框 */
  haveMethod?: boolean;
  /** 备注 flagValue */
  flagValue?: CommentInputFlagValue;
};

export const DEFAULT_SETTLEMENT_LIST: Settlement[] = [
  {
    key: uuidv4(),
    label: '+0',
    liq_speed_list: [{ tag: LiquidationSpeedTag.Today, offset: 0 }],
    comment: ''
  },
  {
    key: uuidv4(),
    label: '+1',
    liq_speed_list: [{ tag: LiquidationSpeedTag.Today, offset: 1 }],
    comment: ''
  },
  {
    key: uuidv4(),
    label: '明天+0',
    liq_speed_list: [{ tag: LiquidationSpeedTag.Tomorrow, offset: 0 }],
    comment: ''
  },
  {
    key: uuidv4(),
    label: '明天+1',
    liq_speed_list: [{ tag: LiquidationSpeedTag.Tomorrow, offset: 1 }],
    comment: ''
  }
];

const formatSettlementList = (settlementSettings: Settlement[], settlement: Settlement, isDelete?: boolean) => {
  try {
    // 如果初始没有这条 settlement 设置，则需要新增进去

    let settlementList = settlementSettings ?? [];

    // 删除 settlement
    if (isDelete) {
      settlementList = settlementList.filter(item => item.key !== settlement.key);
    } else {
      const index = settlementList?.findIndex(item => item.key === settlement.key);
      // 如果缓存里已有该 settlement，对该 settlement
      if (index > -1) {
        settlementList[index] = settlement;
      } else {
        // 否则新建 settlement
        settlementList.push(settlement);
      }
    }

    return settlementList;
  } catch {
    return [];
  }
};

type SettlementSettingMutateParams = {
  settlementSettings: Settlement[];
  settlement: Settlement;
  isDelete?: boolean;
};

export const useProductSettlementSettings = (productType: ProductType) => {
  const key = getLSKey(LSKeys.SettlementShortcut, productType);
  const [value, _setValue] = useLocalStorage(key, DEFAULT_SETTLEMENT_LIST);

  const updateSettlementSettings = ({ settlementSettings, settlement, isDelete }: SettlementSettingMutateParams) => {
    _setValue(formatSettlementList(settlementSettings, settlement, isDelete));
  };

  return { settlementSettings: value, updateSettlementSettings };
};
