import { useCallback, useRef, useState } from 'react';
import { alignRightCls, blockAlignRightCls, blockBasicCls } from '@fepkg/business/components/QuoteTableCell/constants';
import { SERVER_NIL } from '@fepkg/common/constants';
import { fixFloatDecimal } from '@fepkg/common/utils/utils';
import { Input } from '@fepkg/components/Input';
import { RadioButton } from '@fepkg/components/Radio';
import { Tooltip } from '@fepkg/components/Tooltip';
import {
  IconExchange,
  IconOco,
  IconPack,
  IconProvider,
  IconStar,
  IconStar2,
  IconUrgentFilled
} from '@fepkg/icon-park-react';
import { BondQuoteType, QuoteDraftDetailStatus, Side } from '@fepkg/services/types/enum';
import { createColumnHelper } from '@tanstack/react-table';
import { useSetAtom } from 'jotai';
import { formatComment } from '@/common/services/api/bond-quote/search';
import { LocalQuoteDraftDetail } from '@/common/services/hooks/local-server/quote-draft/types';
import { formatLiquidationSpeedListToString } from '@/common/utils/liq-speed';
import { SideCellPrice, getSideFontCls } from '@/components/QuoteTableCell';
import { VOLUME_TEN_MILLION_REGEX, checkPriceValid, checkVolumeValid } from '@/components/business/Quote/utils';
import {
  repeatQuoteMdlOpenAtom,
  repeatQuoteMdlSelectedBondAtom,
  repeatQuoteMdlSelectedMessageKeyAtom
} from '@/pages/Quote/Collaborative/atoms/modal';
import { useDraftAction } from '@/pages/Quote/Collaborative/hooks/useDraftAction';
import { useTableState } from '@/pages/Quote/Collaborative/providers/TableStateProvider';
import { DraftGroupTableColumnKey, DraftGroupTableRowData } from '@/pages/Quote/Collaborative/types/table';
import { isDraftDetailData } from '@/pages/Quote/Collaborative/utils';
import { GroupHeader } from './GroupHeader';

export const columnHelper = createColumnHelper<DraftGroupTableRowData>();

const TOOLTIP_DELAY = 618;
const tooltipProps = { delay: { open: TOOLTIP_DELAY }, truncate: true };

type BasicCellProps = {
  /** 报价详情 */
  detail: LocalQuoteDraftDetail;
};

type SideCellProps = {
  /** className */
  className?: string;
  /** 方向 */
  side?: Side;
  /** 是否禁用 */
  disabled?: boolean;
  /** 按钮点击时的回调事件 */
  onClick?: () => void;
};

type EditableVolumeCellProps = BasicCellProps & {
  /** 报价量展示 */
  content: string;
};

export const SideCell = ({ className, side, disabled, onClick }: SideCellProps) => {
  const btnProps = {
    className: `!w-12 !h-6 font-medium ${className ?? ''}`,
    checked: true,
    disabled,
    onClick,
    // OFR比BID宽，留有边距会导致OFR被省略展示
    clearInnerPadding: true
  };

  return side === Side.SideBid ? (
    <RadioButton
      buttonType="orange"
      {...btnProps}
    >
      BID
    </RadioButton>
  ) : (
    <RadioButton
      buttonType="secondary"
      {...btnProps}
    >
      OFR
    </RadioButton>
  );
};

const flagCls = 'w-3 h-3 leading-0';
export const getFlagCellTdCls = ({ original }: { original: DraftGroupTableRowData }) =>
  `grid grid-cols-2 items-center ${
    original.original?.status === QuoteDraftDetailStatus.QuoteDraftDetailStatusIgnored ? 'text-gray-300' : ''
  }`;

export const FlagCell = ({ detail }: BasicCellProps) => {
  const { flag_star, flag_oco, flag_package, flag_exchange, flag_urgent } = detail;
  return (
    <IconProvider value={{ size: 12 }}>
      <span className={flagCls}>{!!flag_star && (flag_star === 1 ? <IconStar /> : <IconStar2 />)}</span>
      <span className={flagCls}>{flag_urgent && <IconUrgentFilled />}</span>
      <span className={flagCls}>{(flag_oco || flag_package) && (flag_oco ? <IconOco /> : <IconPack />)}</span>
      <span className={flagCls}>{flag_exchange && <IconExchange />}</span>
    </IconProvider>
  );
};

const useEdit = (defaultValue: string) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [editing, setEditing] = useState(false);

  const selected = useRef(false);

  const updateEditing = (val: boolean) => {
    setEditing(val);
    selected.current = val;
  };

  const inputCbRef = useCallback((node: HTMLInputElement | null) => {
    if (selected) {
      node?.select();
      selected.current = false;
    }
  }, []);

  return { inputValue, setInputValue, editing, updateEditing, inputCbRef };
};

const EditableVolumeCell = ({ detail, content }: EditableVolumeCellProps) => {
  const defaultVolume = content === '--' ? '' : String(fixFloatDecimal(Number(content) / 1000, 6));

  const { showEditInput, edit } = useDraftAction();
  const { inputValue, setInputValue, editing, updateEditing, inputCbRef } = useEdit(defaultVolume);

  const handleInputChange = (val: string) => {
    const [valid, volume] = checkVolumeValid(val, VOLUME_TEN_MILLION_REGEX);
    if (valid) setInputValue(volume);
  };

  const handleEdit = (val: string) => {
    if (val !== defaultVolume) {
      const upsert = { volume: val ? fixFloatDecimal(Number(val) * 1000, 6) : SERVER_NIL };

      edit({ ...detail, ...upsert }, upsert);
    }
    updateEditing(false);
  };

  const handleCellDblClick = () => {
    if (!showEditInput(detail)) return;
    updateEditing(true);
  };

  return editing ? (
    <Input
      className="h-7"
      autoFocus
      ref={inputCbRef}
      value={inputValue}
      placeholder="kw"
      onChange={handleInputChange}
      onBlur={evt => handleEdit(evt.target.value)}
      onEnterPress={handleEdit}
      // GroupTable 在 mouseup 时会取消选中状态
      onMouseUp={evt => evt.stopPropagation()}
    />
  ) : (
    <Tooltip
      content={content}
      {...tooltipProps}
    >
      <div
        className={`${blockAlignRightCls} !pl-0`}
        onDoubleClick={handleCellDblClick}
      >
        {content}
      </div>
    </Tooltip>
  );
};

export const EditablePriceCell = ({ detail }: BasicCellProps) => {
  const defaultPrice = (detail?.price ?? 0) > 0 ? `${detail.price}` : '';

  const { showEditInput, edit } = useDraftAction();
  const { inputValue, setInputValue, editing, updateEditing, inputCbRef } = useEdit(defaultPrice);

  const { side, flag_internal, flag_inverted, status } = detail;
  const ignored = status === QuoteDraftDetailStatus.QuoteDraftDetailStatusIgnored;

  const handleInputChange = (val: string) => {
    const [valid, newPrice] = checkPriceValid(val);
    if (valid) setInputValue(newPrice);
  };

  const handleEdit = (val: string) => {
    if (val !== defaultPrice) {
      let { quote_type, flag_intention, is_exercise, exercise_manual } = detail;
      const { flag_rebate } = detail;
      let price = Number(val);

      // 如果输入框不为空，并且价格大于 0
      if (val !== '' && price > 0) {
        // 需要改为非意向价
        flag_intention = false;

        if (price > 30) {
          // 如果价格大于 30 并且没有返点点亮，需要把价格类型改为净价
          if (!flag_rebate) quote_type = BondQuoteType.CleanPrice;
        } else {
          quote_type = BondQuoteType.Yield;
        }
      } else {
        quote_type = BondQuoteType.Yield;
        price = SERVER_NIL;
        // 如果没有返点，需要改为意向价
        if (!flag_rebate) flag_intention = true;
      }

      // 如果价格类型为净价，需要清空行权/到期类型
      if (quote_type === BondQuoteType.CleanPrice) {
        is_exercise = false;
        exercise_manual = false;
      }

      const upsert = { quote_type, price, flag_intention, is_exercise, exercise_manual };
      edit({ ...detail, ...upsert }, upsert);
    }

    updateEditing(false);
  };

  const handleCellDblClick = () => {
    if (!showEditInput(detail)) return;
    updateEditing(true);
  };

  return editing ? (
    <Input
      className="h-7"
      ref={inputCbRef}
      value={inputValue}
      onChange={handleInputChange}
      onBlur={evt => handleEdit(evt.target.value)}
      onEnterPress={handleEdit}
      // GroupTable 在 mouseup 时会取消选中状态
      onMouseUp={evt => evt.stopPropagation()}
    />
  ) : (
    <div
      className={`${alignRightCls} ${getSideFontCls(side, ignored, flag_internal, 'text-gray-400')} ${
        flag_inverted ? 'bg-orange-600' : ''
      }`}
      onDoubleClick={handleCellDblClick}
    >
      <SideCellPrice
        side={side}
        price={detail?.price}
        returnPoint={detail?.return_point}
        rebate={detail?.flag_rebate}
        intention={detail?.flag_intention}
      />
    </div>
  );
};

export const LiqSpeedCell = ({ detail }: BasicCellProps) => {
  const { liquidation_speed_list = [] } = detail;
  const content = formatLiquidationSpeedListToString(liquidation_speed_list, 'MM.DD');

  return (
    <Tooltip
      content={content}
      {...tooltipProps}
    >
      <div className={blockBasicCls}>{content}</div>
    </Tooltip>
  );
};

export const CommentCell = ({ detail }: BasicCellProps) => {
  const { bond_info, comment } = detail;
  const content = formatComment({
    comment: comment ?? '',
    ...detail,
    has_option: bond_info?.has_option,
    option_type: bond_info?.option_type
  });

  return (
    <Tooltip
      content={content}
      {...tooltipProps}
    >
      <div className={blockBasicCls}>{content}</div>
    </Tooltip>
  );
};

const LiqSpeedWithComment = ({ detail }: BasicCellProps) => {
  const { bond_info, comment, liquidation_speed_list = [] } = detail;
  const liq = formatLiquidationSpeedListToString(liquidation_speed_list, 'MM.DD');
  const com = formatComment({
    comment: comment ?? '',
    ...detail,
    has_option: bond_info?.has_option,
    option_type: bond_info?.option_type
  });
  const content = `${liq} ${com}`;

  return (
    <Tooltip
      content={content}
      {...tooltipProps}
    >
      <div className={`${blockBasicCls} !pr-0`}>{content}</div>
    </Tooltip>
  );
};
// 308 200 64 120 36 72 120 56
// 54

export const columns = [
  columnHelper.display({
    id: DraftGroupTableColumnKey.Header,
    meta: { columnKey: DraftGroupTableColumnKey.Header },
    cell: ({ row }) => !isDraftDetailData(row.original) && <GroupHeader rowData={row.original} />
  }),
  columnHelper.display({
    id: DraftGroupTableColumnKey.Footer,
    meta: { columnKey: DraftGroupTableColumnKey.Footer },
    cell: () => '未识别出报价信息，请检查原文'
  }),

  // 20国债05[1019631.SH]  99.98  1000W 03.24+1 请示、oco
  columnHelper.display({
    id: DraftGroupTableColumnKey.Text,
    minSize: 304,
    meta: {
      columnKey: DraftGroupTableColumnKey.Text,
      tdCls: 'flex-[77_77_0%] min-w-[304px] text-gray-300'
    },
    cell: ({ row }) => {
      if (!isDraftDetailData(row.original)) return null;
      return (
        <Tooltip
          content={row.original.text}
          {...tooltipProps}
        >
          <div className={blockBasicCls}>{row.original.text}</div>
        </Tooltip>
      );
    }
  }),

  // A 019631.SH3473274 20国债05
  columnHelper.display({
    id: DraftGroupTableColumnKey.Bond,
    minSize: 198,
    meta: {
      columnKey: DraftGroupTableColumnKey.Bond,
      tdCls: ({ original }) =>
        `flex-[50_50_0%] min-w-[198px] ${
          isDraftDetailData(original) && original.bondRepeatedPrefix ? 'bg-danger-700' : ''
        }`
    },
    cell: function BondCell({ row }) {
      const { updateKeepingTimestamp } = useTableState();

      const setOpen = useSetAtom(repeatQuoteMdlOpenAtom);
      const setSelectedBond = useSetAtom(repeatQuoteMdlSelectedBondAtom);
      const setSelectedMessageKey = useSetAtom(repeatQuoteMdlSelectedMessageKeyAtom);

      if (!isDraftDetailData(row.original) || !row?.original?.original) return null;

      const { bond_info } = row.original.original;
      const { bondRepeatedPrefix } = row.original;

      const { time_to_maturity = '', display_code = '', short_name = '' } = bond_info ?? {};

      const content = (
        <>
          {time_to_maturity && <span className="mr-2">{time_to_maturity}</span>}
          {display_code && <span className="mr-2">{display_code}</span>}
          {short_name && <span>{short_name}</span>}
        </>
      );

      return (
        <Tooltip
          content={content}
          {...tooltipProps}
        >
          <div className={blockBasicCls}>
            {bondRepeatedPrefix && (
              <span
                className="inline-flex-center w-5 h-5 mr-2 text-xs text-gray-000 bg-danger-100 rounded-lg"
                onDoubleClick={evt => {
                  if (bond_info) {
                    evt.stopPropagation();
                    setOpen(true);
                    setSelectedBond(bond_info);
                    setSelectedMessageKey(row.original?.groupHeaderRowKey);
                    updateKeepingTimestamp();
                  }
                }}
              >
                {bondRepeatedPrefix}
              </span>
            )}
            {content}
          </div>
        </Tooltip>
      );
    }
  }),

  // 方向 BID/OFR
  columnHelper.display({
    id: DraftGroupTableColumnKey.Side,
    minSize: 64,
    meta: {
      columnKey: DraftGroupTableColumnKey.Side,
      tdCls: 'flex-center'
    },
    cell: function SideCellWrapper({ row }) {
      const { operable } = useTableState();
      const { edit } = useDraftAction();

      if (!isDraftDetailData(row.original) || !row.original?.original) return null;

      const { side, status } = row.original.original;
      const ignored = status === QuoteDraftDetailStatus.QuoteDraftDetailStatusIgnored;

      const upsert = { side: side === Side.SideOfr ? Side.SideBid : Side.SideOfr };
      const target = { ...row.original.original, ...upsert };

      return (
        <SideCell
          className={operable ? '' : '!cursor-default'}
          side={side}
          disabled={ignored}
          onClick={() => {
            if (!operable) return;
            edit(target, upsert);
          }}
        />
      );
    }
  }),

  // 价格 442.9867
  columnHelper.display({
    id: DraftGroupTableColumnKey.Price,
    minSize: 120,
    meta: {
      columnKey: DraftGroupTableColumnKey.Price,
      tdCls: 'flex-[30_30_0%] min-w-[120px]'
    },
    cell: function PriceCell({ row }) {
      if (!isDraftDetailData(row.original) || !row.original?.original) return null;

      const detail = row.original.original;

      return (
        <EditablePriceCell
          key={detail?.update_time}
          detail={detail}
        />
      );
    }
  }),

  // 量 4000
  columnHelper.display({
    id: DraftGroupTableColumnKey.Volume,
    minSize: 72,
    meta: {
      columnKey: DraftGroupTableColumnKey.Volume,
      tdCls: 'flex-[18_18_0%] min-w-[72px]'
    },
    cell: function VolumeCell({ row }) {
      if (!isDraftDetailData(row.original) || !row.original?.original) return null;

      const detail = row.original.original;
      const { volume } = detail;

      let content = '--';
      if (volume !== void 0 && volume > 0) content = volume.toString();

      return (
        <EditableVolumeCell
          key={detail?.update_time}
          detail={detail}
          content={content}
        />
      );
    }
  }),

  // 标签
  columnHelper.display({
    id: DraftGroupTableColumnKey.Flag,
    minSize: 36,
    meta: {
      columnKey: DraftGroupTableColumnKey.Flag,
      align: 'center',
      tdCls: getFlagCellTdCls
    },
    cell: ({ row }) => {
      if (!isDraftDetailData(row.original) || !row.original?.original) return null;
      return <FlagCell detail={row.original.original} />;
    }
  }),

  // 清算速度和备注 明天+1 交易所
  columnHelper.display({
    id: DraftGroupTableColumnKey.LiqSpeed,
    minSize: 120,
    meta: {
      columnKey: DraftGroupTableColumnKey.LiqSpeed,
      tdCls: 'flex-[30_30_0%] min-w-[120px]'
    },
    cell: ({ row }) => {
      if (!isDraftDetailData(row.original) || !row.original?.original) return null;
      return <LiqSpeedWithComment detail={row.original.original} />;
    }
  }),

  // 状态
  columnHelper.display({
    id: DraftGroupTableColumnKey.Status,
    minSize: 56,
    meta: {
      columnKey: DraftGroupTableColumnKey.Status,
      tdCls: 'flex-center font-medium'
    },
    cell: ({ row }) => {
      if (!isDraftDetailData(row.original)) return null;

      switch (row.original?.original?.status) {
        case QuoteDraftDetailStatus.QuoteDraftDetailStatusPending:
          return <span className="text-orange-100">待处理</span>;
        case QuoteDraftDetailStatus.QuoteDraftDetailStatusConfirmed:
          return <span className="text-green-100">已挂价</span>;
        case QuoteDraftDetailStatus.QuoteDraftDetailStatusIgnored:
          return <span className="text-gray-200">已忽略</span>;
        default:
          return null;
      }
    }
  })
];

export const columnVisibleKeys = [
  DraftGroupTableColumnKey.Text,
  DraftGroupTableColumnKey.Bond,
  DraftGroupTableColumnKey.Side,
  DraftGroupTableColumnKey.Price,
  DraftGroupTableColumnKey.Flag,
  DraftGroupTableColumnKey.Volume,
  DraftGroupTableColumnKey.LiqSpeed,
  DraftGroupTableColumnKey.Status
];
