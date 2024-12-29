import { TraderWithPref } from '@fepkg/business/components/Search/TraderSearch';
import { getInstName } from '@fepkg/business/utils/get-name';
import { HighlightOption } from '@fepkg/components/BaseOptionsRender/HighlightOption';
import { SearchOption } from '@fepkg/components/Search';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { Counterparty } from '@fepkg/services/types/common';
import { v4 as uuidv4 } from 'uuid';
import { InstTraderSearchProps } from './types';

/**
 * 交易员转换为机构交易员展示，机构优先展示业务简称
 * @param trader 交易员
 * @returns 机构业务简称或机构简称(交易员+标签)
 */
export const transform2InstTraderOpt = (
  trader?: TraderWithPref,
  productType?: ProductType
): SearchOption<TraderWithPref> | null => {
  if (!trader || !trader?.inst_info) return null;
  const instName = getInstName({ inst: trader.inst_info, productType });

  let label = '';
  if (instName && trader?.name_zh) label = `${instName}(${trader.name_zh})`;
  else if (instName) label = instName;
  else if (trader?.name_zh) label = trader.name_zh;

  return {
    label,
    value: `${trader.inst_info?.inst_id}|${trader?.trader_id}`,
    original: trader
  };
};

export const transform2Trader = (info?: Counterparty): TraderWithPref | undefined => {
  if (!info) return void 0;
  if (!info.inst?.inst_id) return void 0;
  // 有一个默认值为 '0' 的情况
  if (info.inst?.inst_id === '0') return void 0;

  return {
    trader_id: info.trader?.trader_id ?? '',
    name_zh: info.trader?.name_zh ?? '',
    inst_info: info.inst,
    key: uuidv4(),
    tags: info.trader?.trader_tag_list
  } as TraderWithPref;
};

export const optionRenderWithPreference =
  (productType?: ProductType): InstTraderSearchProps['optionRender'] =>
  (opt, keyword) => {
    const option = transform2InstTraderOpt(opt, productType);
    return (
      <HighlightOption
        className={opt?.preference ? '!text-orange-100' : ''}
        keyword={keyword}
        label={option?.label as string}
      />
    );
  };
