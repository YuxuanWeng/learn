import { useEffect, useState } from 'react';
import cx from 'classnames';
import { Tooltip } from 'antd';
import { DealTypeMap } from '@fepkg/business/constants/map';
import { Button } from '@fepkg/components/Button';
import { message } from '@fepkg/components/Message';
import { RecommendBondStatus } from '@fepkg/services/types/algo-enum';
import type { GetConfig } from '@fepkg/services/types/algo/get-config';
import type { GetRecommendBond } from '@fepkg/services/types/algo/get-recommend-bond';
import { DealType } from '@fepkg/services/types/enum';
import { bcoUpdateRecommendBond } from '@/common/services/api/algo/bond-recommend-api/update-recommend-bond';
import { formatPrice } from '@/common/utils/copy';
import { BcoRecommendTableColumn } from '@/components/BondRecommend/BCO/table';
import Switch from '@/components/IDCDealDetails/Switch';
import {
  useBCORecommendSchemaInput,
  useBCORecommendTable,
  useBCORecommendTableBondTraderManagement,
  useBCORecommendTraderConfigList
} from './provider';
import { bcoSendRecommendBond, parseListWithSchemaMap } from './utils';

const typeColorClasses = {
  [DealType.GVN]: 'bg-auxiliary-200',
  [DealType.TKN]: 'bg-ofr-200',
  [DealType.TRD]: 'bg-trd-200'
};

const groupBGColorClasses = {
  H: 'bg-primary-700',
  L: 'bg-ofr-700',
  I: 'bg-trd-600',
  S: 'bg-danger-600',
  F: 'bg-auxiliary-600'
};

const groupTextColorClasses = {
  H: 'text-primary-200',
  L: 'text-ofr-200',
  I: 'text-trd-200',
  S: 'text-danger-200',
  F: 'text-auxiliary-200'
};

const parsePrice = (price: number) => (price === -1 || price === 0 ? '--' : formatPrice(price, 4));
const parseVolume = (volume: string) => (volume === '' || volume === '-1' ? '--' : volume);

const RenderButtons = (props: {
  cell: GetRecommendBond.RecommendedBond;
  user?: GetRecommendBond.TraderRecommendBond;
}) => {
  const { cell, user } = props;

  const { refresh } = useBCORecommendTable();
  const { schemaInputMap } = useBCORecommendSchemaInput();
  const { traderConfigs } = useBCORecommendTraderConfigList();

  return (
    <div className="flex items-center h-full justify-end">
      <Button
        onClick={async () => {
          if (user == null) return;
          await bcoSendRecommendBond(
            parseListWithSchemaMap(
              [
                {
                  trader_id: user.trader_id,
                  trader_qq: user.trader_qq,
                  trader_name: user.trader_name,
                  inst_name: user.inst_name,
                  message_schema: user.message_schema,
                  recommend_bond_list: [{ id: cell.recommend_bond_id, copyInfo: cell.quote_copy }]
                }
              ],
              schemaInputMap
            ),
            traderConfigs
          );

          refresh?.();
        }}
        type="primary"
        className="flex items-center justify-center w-5 h-5 !p-0"
      >
        <i className="icon-send h-4 w-4 !m-0" />
      </Button>
      <Button
        className="ml-2 flex items-center justify-center w-5 h-5 !p-0"
        onClick={async () => {
          await bcoUpdateRecommendBond({
            recommend_bond_id_list: [cell.recommend_bond_id],
            status: RecommendBondStatus.Ignore
          });

          message.warn('忽略1条');

          refresh?.();
        }}
      >
        <i className="icon-close1 h-4 w-4 !m-0" />
      </Button>
    </div>
  );
};

export const bcoBondRecommendListColumns: BcoRecommendTableColumn<
  GetRecommendBond.RecommendedBond,
  GetRecommendBond.TraderRecommendBond
>[] = [
  {
    name: 'time_to_maturity',
    width: 92,
    renderText: cell => cell.bond.bond_info.time_to_maturity
  },
  {
    name: 'bond_code',
    width: 112,
    renderText: cell => cell.bond.bond_info.bond_code
  },
  {
    name: 'bond_name',
    width: 120,
    renderText: cell => cell.bond.bond_info.bond_name
  },
  {
    name: 'rating_current',
    width: 88,
    textCellClass: 'justify-center',
    renderText: cell =>
      [cell.bond.bond_info.issuer_rating_current, cell.bond.bond_info.rating_current].filter(i => i !== '').join('/')
  },
  {
    name: 'yield',
    width: 72,
    textCellClass: 'justify-end',
    renderText: cell =>
      [cell.bond.bond_info.csi_yield_to_maturity, cell.bond.bond_info.csi_yield_to_exercise]
        .filter(v => v !== -1 && v !== 0)
        .join(' | ')
  },
  {
    name: 'bid_price',
    width: 100,
    render: cell => (
      <div
        className={cx(
          '!text-lg font-bold text-right',
          cell.bond.bond_info.bid_internal ? '!text-primary-200' : '!text-auxiliary-200'
        )}
      >
        {parsePrice(cell.bond.bond_info.bid_price)}
      </div>
    )
  },
  {
    name: 'bid_volume',
    width: 100,
    textCellClass: 'justify-end',
    renderText: cell =>
      cell.bond.bond_info.bid_price === -1 || cell.bond.bond_info.bid_price === 0
        ? '--'
        : parseVolume(cell.bond.bond_info.bid_volume)
  },
  {
    name: 'ofr_price',
    width: 100,
    render: cell => (
      <div
        className={cx(
          'text-right !text-lg font-bold',
          cell.bond.bond_info.ofr_internal ? '!text-primary-200' : '!text-secondary-200'
        )}
      >
        {parsePrice(cell.bond.bond_info.ofr_price)}
      </div>
    )
  },
  {
    name: 'ofr_volume',
    width: 100,
    textCellClass: 'justify-end',
    renderText: cell =>
      cell.bond.bond_info.ofr_price === -1 || cell.bond.bond_info.ofr_price === 0
        ? '--'
        : parseVolume(cell.bond.bond_info.ofr_volume)
  },
  {
    name: 'type',
    width: 160,
    render: cell => {
      return (
        <div className="flex items-center justify-between h-full">
          <div
            className={`w-10 h-5 flex justify-center items-center text-white text-xs rounded-sm ${
              typeColorClasses[cell.bond.deal?.side ?? '']
            }`}
          >
            {DealTypeMap[cell.bond.deal?.side ?? '']}
          </div>
          <div
            className={`${cell.bond.deal?.is_internal ? 'text-primary-200' : 'text-orange-200'} text-[16px] font-bold`}
          >
            {cell.bond.deal?.price === -1 || cell.bond.deal?.price == null || cell.bond.deal?.price === 0
              ? '--'
              : cell.bond.deal?.price}
          </div>
        </div>
      );
    }
  },
  {
    name: 'group',
    width: 140,
    render: cell => (
      <div className="flex items-center h-full">
        {(cell.pass_rule_group ?? []).map(c => (
          <div
            key={c}
            className={`${groupBGColorClasses[c]} ${groupTextColorClasses[c]} mr-1 w-4 h-4 flex justify-center items-center rounded-sm text-xs`}
          >
            {c}
          </div>
        ))}
      </div>
    )
  },
  {
    name: 'send_count',
    width: 60,
    render: cell => (
      <div className="h-full flex justify-center items-center">
        <div className="h-4 w-9 flex justify-center items-center bg-gray-700 rounded-sm text-xs text-white">
          {cell.send_count}次
        </div>
      </div>
    )
  },
  {
    name: 'create_time',
    width: 70,
    renderText: cell => cell.bond.latest_quote?.create_time || '--'
  },
  {
    name: 'operation',
    width: 74,
    render: (cell, user) => (
      <RenderButtons
        cell={cell}
        user={user}
      />
    ),
    fixRight: true
  }
];

const TraderManagementSwitch = (props: {
  columnKey: string;
  checked: boolean;
  item: GetConfig.TraderBondConfig;
  disabled?: boolean;
  tooltip?: string;
}) => {
  const { onCheck } = useBCORecommendTableBondTraderManagement();

  const { columnKey, checked, item, disabled = false, tooltip } = props;

  // 乐观更新
  const [innerChecked, setInnerChecked] = useState(checked);

  useEffect(() => {
    setInnerChecked(checked);
  }, [checked]);

  const result = (
    <div className="h-full flex justify-center items-center">
      <Switch
        onChange={val => {
          setInnerChecked(val);
          onCheck?.({
            checked: val,
            item,
            column: columnKey
          });
        }}
        disabled={disabled}
        size="small"
        checked={innerChecked}
      />
    </div>
  );

  return disabled ? (
    <Tooltip
      title={tooltip}
      color="var(--color-gray-500)"
    >
      {result}
    </Tooltip>
  ) : (
    result
  );
};

const UploadIssure = (props: { cell: GetConfig.TraderBondConfig }) => {
  const { cell } = props;
  const { onOpenParsingModal } = useBCORecommendTableBondTraderManagement();
  return (
    <div className="flex h-full justify-center items-center">
      <TraderManagementSwitch
        checked={cell.issuer_enabled}
        item={cell}
        columnKey="issuer_enabled"
      />
      <div className="mx-3 h-4 w-px bg-gray-400" />
      <Button
        className="w-12"
        onClick={() => {
          onOpenParsingModal?.(cell.trader_id);
        }}
      >
        <span className="!text-primary-200">上传</span>
      </Button>
    </div>
  );
};

export const bcoBondRecommendTraderManagementColumns: BcoRecommendTableColumn<GetConfig.TraderBondConfig>[] = [
  {
    name: 'trader_name',
    width: 100,
    textCellClass: 'justify-center',
    title: '交易员',
    renderText: cell => cell.trader_name
  },
  {
    name: 'inst_name',
    width: 120,
    title: '机构名称',
    renderText: cell => cell.inst_name,
    headerClass: '!justify-start'
  },
  {
    name: 'h_enabled',
    width: 100,
    title: 'HILS规则',
    render: cell => (
      <TraderManagementSwitch
        checked={cell.h_enabled}
        item={cell}
        columnKey="h_enabled"
      />
    )
  },
  {
    name: 'f_enabled',
    width: 100,
    title: 'F规则',
    render: cell => (
      <TraderManagementSwitch
        checked={cell.f_enabled}
        item={cell}
        columnKey="f_enabled"
      />
    )
  },
  {
    name: 'im_enabled',
    width: 100,
    title: 'IM账号',
    render: cell => (
      <TraderManagementSwitch
        checked={cell.im_enabled}
        item={cell}
        columnKey="im_enabled"
        disabled={!cell.crm_im_enabled}
        tooltip="用户未绑定IM账号"
      />
    )
  },
  {
    name: 'issuer_enabled',
    width: 160,
    title: '仅推用户推荐名单',
    render: cell => <UploadIssure cell={cell} />
  }
];
