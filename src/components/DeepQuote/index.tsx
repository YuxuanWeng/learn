import { useEffect, useMemo, useRef } from 'react';
import cx from 'classnames';
import { BondQuoteTableColumnKey } from '@fepkg/business/components/QuoteTableCell/types';
import { DEAL_TRADED_DATE_RANGE, useTradedDateRange } from '@fepkg/business/hooks/useTradedDateRange';
import { Button } from '@fepkg/components/Button';
import { message } from '@fepkg/components/Message';
import { Table, TableSelectEventHandler } from '@fepkg/components/Table';
import { QuoteLite } from '@fepkg/services/types/common';
import { OperationType, ProductType, RefType, Side } from '@fepkg/services/types/enum';
import type { MarketDealMulCreate } from '@fepkg/services/types/market-deal/mul-create';
import { useMemoizedFn } from 'ahooks';
import { atom } from 'jotai';
import { cloneDeep, flatten } from 'lodash-es';
import { getPollingAPIPageCount } from '@/common/ab-rules';
import { DEEP_QUOTE_BID_TABLE_COLUMN, DEEP_QUOTE_OFR_TABLE_COLUMN } from '@/common/constants/table';
import { useDialogWindow } from '@/common/hooks/useDialog';
import useOnlineOpenDialog from '@/common/hooks/useOnlineOpenDialog';
import { mulCreateMarketDealWithUndo, mulRefBondQuoteWithUndo } from '@/common/undo-services';
import { copyQuotesByID } from '@/common/utils/copy';
import { trackPoint } from '@/common/utils/logger/point';
import { transform2MarketDeal, transform2MarketDealCreate } from '@/common/utils/market-deal';
import { isPingJiaFan } from '@/common/utils/quote-price';
import { QuoteTrigger, SubSingleQuoteDialog } from '@/components/Quote/types';
import { useProductParams } from '@/layouts/Home/hooks';
import { miscStorage } from '@/localdb/miscStorage';
import { getMarketDealDialogConfig } from '@/pages/Deal/Market/MarketDealForm/utils';
import {
  DEEP_QUOTE_MODAL_ID,
  DEEP_QUOTE_MODAL_MAX_HEIGHT
} from '@/pages/ProductPanel/components/OptimalTable/constants';
import { OptimalTableColumn } from '@/pages/ProductPanel/components/OptimalTable/types';
import { useOptimalTableData } from '@/pages/ProductPanel/components/OptimalTable/useTableData';
import { useProductPanel } from '@/pages/ProductPanel/providers/PanelProvider';
import { preventEnterDefault } from '@/pages/ProductPanel/utils';
import { QuoteActionMode, QuoteFocusInputType } from '@/pages/Quote/SingleQuote/types';
import { getSingleQuoteDialogConfig } from '@/pages/Quote/SingleQuote/utils';
import { GTButton } from '../ShortcutSidebar/GTButton';
import { DealTrace } from '../ShortcutSidebar/useDealShortcutEvent';
import { bidColumns, ofrColumns } from './columns';
import { DeepQuoteTableColumn } from './types';
import { useHotkeyRefs } from './useHotkeyRefs';

const btnCls = 'w-22 h-7 font-heavy';
const tableCls =
  'flex flex-col flex-1 border border-solid border-gray-600 rounded-lg s-table-rounded-l s-table-rounded-r';
const defaultTableProps = {
  showHeader: false,
  showHeaderContextMenu: false,
  showHeaderReorder: false,
  showHeaderResizer: false
};

export type DeepQuoteProps = {
  unquoted: boolean;
  column: OptimalTableColumn;
  hasCheckedModal?: boolean;
  onChange?: (v: boolean) => void;
  position: [number, number, number, number];
  selectedBidRowKeys?: Set<string>;
  setSelectedBidRowKeys?: (v: Set<string>) => void;
  selectedOfrRowKeys?: Set<string>;
  setSelectedOfrRowKeys?: (v: Set<string>) => void;
  clearDeepQuoteTimer?: () => void;
  close?: () => void;
  shortcutDisabled?: boolean;
} & SubSingleQuoteDialog;

/** 全局内深度报价悬浮窗是都选中 */
export const deepQuoteIsCheckedAtom = atom(false);

export const DeepQuote = ({
  unquoted,
  column,
  hasCheckedModal = false,
  onChange,
  selectedBidRowKeys = new Set<string>(),
  setSelectedBidRowKeys,
  selectedOfrRowKeys = new Set<string>(),
  setSelectedOfrRowKeys,
  position,
  clearDeepQuoteTimer,
  close,
  singleQuoteProductType,
  shortcutDisabled
}: DeepQuoteProps) => {
  const { productType } = useProductParams();
  const { accessCache } = useProductPanel();

  const { bidInfo, ofrInfo, original } = column;
  const { optimalQuoteList: bidOptimalQuotes = [], otherQuoteList: bidOtherQuotes = [] } = bidInfo;
  const { optimalQuoteList: ofrOptimalQuotes = [], otherQuoteList: ofrOtherQuotes = [] } = ofrInfo;

  const { openDialog } = useDialogWindow();

  const bidQuotes = useMemo(
    () => [...bidOptimalQuotes, ...bidOtherQuotes] as DeepQuoteTableColumn[],
    [bidOptimalQuotes, bidOtherQuotes]
  );
  const ofrQuotes = useMemo(
    () => [...ofrOptimalQuotes, ...ofrOtherQuotes] as DeepQuoteTableColumn[],
    [ofrOptimalQuotes, ofrOtherQuotes]
  );

  /** 是否有选择 STC 报价 */
  // const hasSelectedSTCQuote = useMemo(
  //   () =>
  //     getHasSTCQuote(
  //       [...bidQuotes, ...ofrQuotes]
  //         .map(i => i.original)
  //         .filter(v => [...selectedBidRowKeys, ...selectedOfrRowKeys].includes(v.quote_id))
  //     ),
  //   [bidQuotes, ofrQuotes, selectedBidRowKeys, selectedOfrRowKeys]
  // );
  const hasSelectedSTCQuote = false;
  const userId = miscStorage.userInfo?.user_id;
  const pageSize = useMemo(() => getPollingAPIPageCount(), []);

  const { refetch } = useOptimalTableData(unquoted, pageSize);

  const deepQuoteRef = useRef<HTMLDivElement | null>(null);

  const { beforeOpenDialogWindow } = useOnlineOpenDialog();
  const [tradeDateRange] = useTradedDateRange(...DEAL_TRADED_DATE_RANGE);

  const handleCellDoubleClick = useMemoizedFn((row: DeepQuoteTableColumn, focusCol: BondQuoteTableColumnKey) => {
    if (!beforeOpenDialogWindow()) return;
    if (!accessCache.quote) return;

    trackPoint(QuoteTrigger.TABLE_DBLCLICK);
    const { quote_id } = row.original;

    // 当为补全报价时，报价模式为新增，同右键报价逻辑
    const isJoinMode = !!quote_id.match('bid') || !!quote_id.match('ofr');

    const { config } = getSingleQuoteDialogConfig(singleQuoteProductType || productType, {
      defaultValue: {
        ...row.original,
        side: row.original.side || (focusCol === 'bid' ? Side.SideBid : Side.SideOfr),
        bond_basic_info: original.bond_basic_info
      },
      disabled: hasSelectedSTCQuote,
      actionMode: isJoinMode ? QuoteActionMode.JOIN : QuoteActionMode.EDIT,
      focusInput: focusCol === 'bid' ? QuoteFocusInputType.BID_PRICE : QuoteFocusInputType.OFR_PRICE
    });

    openDialog(config, { showOfflineMsg: false });
  });

  const closeModal = useMemoizedFn(e => {
    const evt = e || window.event;
    const target = evt.target || evt.srcElement;
    const tar: HTMLElement | null = deepQuoteRef.current;
    const tmp = (target as HTMLElement).closest('.deep-quote') as HTMLElement;
    if (!(target === tar) && !tar?.contains(target as Node | null) && !tmp) {
      onChange?.(false);
      setSelectedBidRowKeys?.(new Set<string>());
      setSelectedOfrRowKeys?.(new Set<string>());
      close?.();
    }
  });

  useEffect(() => {
    document.addEventListener('mouseup', closeModal);
    return () => {
      document.removeEventListener('mouseup', closeModal);
    };
  }, [closeModal]);

  const countSelectedLength = useMemo(
    () => flatten([...selectedBidRowKeys, ...selectedOfrRowKeys]).filter(v => !v.match('bid') && !v.match('ofr')),
    [selectedBidRowKeys, selectedOfrRowKeys]
  );

  const joinDisabled = useMemo(
    () =>
      countSelectedLength.length <= 0 ||
      countSelectedLength.length > 1 ||
      flatten([...selectedBidRowKeys, ...selectedOfrRowKeys]).length > 1,
    [countSelectedLength.length, selectedBidRowKeys, selectedOfrRowKeys]
  );

  const referDisabled = useMemo(() => countSelectedLength.length <= 0, [countSelectedLength.length]);

  const openSettingJoin = useMemoizedFn(() => {
    if (!beforeOpenDialogWindow()) return;

    if (Math.max(selectedBidRowKeys.size, selectedOfrRowKeys.size) > 1) {
      return;
    }
    // 取到当前选中的id
    const [id, side] =
      selectedBidRowKeys.size > 0
        ? [[...selectedBidRowKeys][0], Side.SideBid]
        : [[...selectedOfrRowKeys][0], Side.SideOfr];

    const quote =
      side === Side.SideBid
        ? original.quote_bid_list?.filter(v => v.quote_id === id)?.[0]
        : original.quote_ofr_list?.filter(v => v.quote_id === id)?.[0];

    if (!quote) return;

    trackPoint(QuoteTrigger.SIDEBAR_BUTTON);

    const { config } = getSingleQuoteDialogConfig(singleQuoteProductType || productType, {
      defaultValue: { ...quote, bond_basic_info: original.bond_basic_info },
      actionMode: QuoteActionMode.JOIN,
      focusInput: side === Side.SideBid ? QuoteFocusInputType.BID_PRICE : QuoteFocusInputType.OFR_PRICE
    });

    openDialog(config, { showOfflineMsg: false });
  });

  const refer = async () => {
    if (hasSelectedSTCQuote) {
      message.error('修改失败，存在不可被修改的报价！');
      return;
    }

    const quote_id_list = flatten([...selectedBidRowKeys, ...selectedOfrRowKeys]).filter(
      v => !v.match('bid') && !v.match('ofr')
    );

    // 获取原始数据
    const origin = flatten([bidOptimalQuotes, bidOtherQuotes, ofrOptimalQuotes, ofrOtherQuotes])
      .filter(v => quote_id_list.includes(v.original.quote_id))
      .map(v => Object.assign(cloneDeep(v.original), { bond_basic_info: original.bond_basic_info })) as QuoteLite[];
    if (!quote_id_list.length) return;

    await mulRefBondQuoteWithUndo(
      {
        stc_force: false,
        quote_id_list,
        refer_type: RefType.Manual,
        operation_info: { operation_type: OperationType.BondQuoteRefer }
      },
      {
        origin,
        productType: singleQuoteProductType || productType
      }
    );

    setSelectedBidRowKeys?.(new Set<string>());
    setSelectedOfrRowKeys?.(new Set<string>());
    const allQuotes = [
      ...bidOptimalQuotes,
      ...bidOtherQuotes,
      ...ofrOptimalQuotes,
      ...ofrOtherQuotes
    ] as DeepQuoteTableColumn[];

    copyQuotesByID(
      productType,
      undefined,
      quote_id_list.map(id => ({
        ...allQuotes.find(q => q.original.quote_id === id)!.original,
        bond_basic_info: original.bond_basic_info
      }))
    );

    refetch();
  };

  const { gvnTknRef, tradeRef, joinRef, referRef } = useHotkeyRefs({
    countSelectedLength,
    selectedBidRowKeys,
    selectedOfrRowKeys,
    hasCheckedModal,
    hasSelectedSTCQuote,
    shortcutDisabled
  });

  const onSelectBidHandel: TableSelectEventHandler = useMemoizedFn((keys, evt) => {
    if (!(evt?.ctrlKey || evt?.metaKey)) setSelectedOfrRowKeys?.(new Set<string>());
    setSelectedBidRowKeys?.(keys);
  });

  const onSelectOfrHandel: TableSelectEventHandler = useMemoizedFn((keys, evt) => {
    if (!(evt?.ctrlKey || evt?.metaKey)) setSelectedBidRowKeys?.(new Set<string>());
    setSelectedOfrRowKeys?.(keys);
  });

  const handleGvn = async () => {
    if (countSelectedLength.length > 1) {
      message.error('请选择一条债券进行成交！');
      return;
    }
    // 取到当前选中的quote
    const [id, side] =
      selectedBidRowKeys.size > 0
        ? [[...selectedBidRowKeys][0], Side.SideBid]
        : [[...selectedOfrRowKeys][0], Side.SideOfr];
    const quote =
      side === Side.SideBid
        ? original.quote_bid_list?.filter(v => v.quote_id === id)?.[0]
        : original.quote_ofr_list?.filter(v => v.quote_id === id)?.[0];

    if (!quote || quote.flag_intention || isPingJiaFan(quote)) {
      message.error('当前选择报价无法成交！');
      return;
    }

    const operation_info = { operation_type: OperationType.BondDealGvnTknDeal };
    const isSyncReceiptDeal = productType === ProductType.NCD ? true : undefined; // NCD二级同步成交单
    const marketDealCreate = await transform2MarketDealCreate(quote, tradeDateRange, isSyncReceiptDeal, userId);
    const params: MarketDealMulCreate.Request = {
      market_deal_create_list: [marketDealCreate],
      operation_info
    };
    mulCreateMarketDealWithUndo(params, {
      origin: [quote],
      isUndo: true,
      productType
    }).finally(() => {
      refetch();
    });
  };

  const handleTrd = async () => {
    if (!beforeOpenDialogWindow()) return;

    trackPoint(DealTrace.DeepQuoteTrd);
    let quote: QuoteLite | undefined;

    // 如果当前选中的报价为 1 条，需要带入默认报价 Id
    if (countSelectedLength.length === 1) {
      // 取到当前选中的quote
      const [id, side] =
        selectedBidRowKeys.size > 0
          ? [[...selectedBidRowKeys][0], Side.SideBid]
          : [[...selectedOfrRowKeys][0], Side.SideOfr];
      quote =
        side === Side.SideBid
          ? original.quote_bid_list?.filter(v => v.quote_id === id)?.[0]
          : original.quote_ofr_list?.filter(v => v.quote_id === id)?.[0];
    }
    const defaultValue = await transform2MarketDeal(tradeDateRange, original.bond_basic_info, quote);
    const config = getMarketDealDialogConfig(productType, {
      defaultValue,
      defaultQuote: quote,
      defaultFocused: 'price'
    });
    openDialog(config, { showOfflineMsg: false });
  };

  const memoPosition = useMemo(() => {
    const positionStyles: { top: number | 'auto'; bottom: number | 'auto'; right?: number; left?: number } = {
      top: position[2] > 0 ? position[2] : 'auto',
      bottom: position[3] > 0 ? position[3] : 'auto'
    };
    if (position[1] >= 0) {
      [, positionStyles.right] = position;
    } else {
      [positionStyles.left] = position;
    }
    return positionStyles;
  }, [position]);

  return (
    <div
      id={DEEP_QUOTE_MODAL_ID}
      ref={deepQuoteRef}
      className={cx(
        'deep-quote flex flex-col border-solid rounded-lg bg-gray-700 p-2 w-[1116px] z-modal drop-shadow-system border-2',
        hasCheckedModal ? 'border-primary-500' : 'border-gray-600'
      )}
      style={{
        position: 'fixed',
        ...memoPosition,
        maxHeight: DEEP_QUOTE_MODAL_MAX_HEIGHT,
        overflowY: 'auto'
      }}
      onMouseEnter={() => {
        clearDeepQuoteTimer?.();
      }}
      onMouseDown={e => {
        e.stopPropagation();
        onChange?.(!hasCheckedModal);
      }}
      onMouseLeave={e => {
        e.stopPropagation();
        // 当接收焦点的对象是tbody，而不是更深层的dom结构时，认为是滚动条抢走了焦点，这种情况要忽略掉
        const isScrollbarTarget = (e.relatedTarget as HTMLElement)?.matches?.('.s-tbody-wrapper');
        if (isScrollbarTarget) return;
        const isShow = hasCheckedModal || !!selectedBidRowKeys?.size || !!selectedOfrRowKeys?.size;
        if (!isShow) {
          close?.();
          onChange?.(false);
        }
      }}
      onDoubleClick={e => {
        e.stopPropagation();
      }}
    >
      <div className="flex flex-row justify-end gap-3">
        {!!countSelectedLength.length && (
          <>
            <Button
              ref={joinRef}
              type="gray"
              ghost
              tabIndex={-1}
              disabled={!accessCache.quote || joinDisabled}
              onKeyDown={preventEnterDefault}
              className={btnCls}
              onClick={e => {
                e.stopPropagation();
                openSettingJoin();
              }}
              onMouseDown={e => e.stopPropagation()}
            >
              Join
            </Button>
            <Button
              ref={referRef}
              type="gray"
              ghost
              disabled={!accessCache.quote || referDisabled || hasSelectedSTCQuote}
              tabIndex={-1}
              onKeyDown={preventEnterDefault}
              className={btnCls}
              onClick={e => {
                e.stopPropagation();
                refer();
              }}
              onMouseDown={e => e.stopPropagation()}
            >
              Refer
            </Button>
          </>
        )}

        {countSelectedLength.length === 1 && (
          <GTButton
            tabIndex={-1}
            ref={gvnTknRef}
            className="w-22 h-7"
            disabled={!accessCache.deal}
            onKeyDown={preventEnterDefault}
            onClick={handleGvn}
          />
        )}
        <Button
          tabIndex={-1}
          ref={tradeRef}
          type="green"
          className={btnCls}
          disabled={!accessCache.deal}
          onKeyDown={preventEnterDefault}
          onClick={handleTrd}
        >
          Trade
        </Button>
      </div>

      <div className="flex justify-between mt-3">
        <Table<DeepQuoteTableColumn, BondQuoteTableColumnKey>
          className={tableCls}
          zebra
          data={bidQuotes}
          onMouseDown={e => {
            e.stopPropagation();
          }}
          showWatermark={false}
          keyboardSelectAllEnabled={hasCheckedModal}
          columns={bidColumns}
          {...defaultTableProps}
          columnSettings={DEEP_QUOTE_BID_TABLE_COLUMN}
          rowKey={row => row?.original.quote_id}
          selectedKeys={selectedBidRowKeys}
          onSelect={onSelectBidHandel}
          onCellDoubleClick={(_, row) => handleCellDoubleClick(row, BondQuoteTableColumnKey.Bid)}
        />

        <div className="w-1" />

        <Table<DeepQuoteTableColumn, BondQuoteTableColumnKey>
          className={tableCls}
          zebra
          data={ofrQuotes}
          onMouseDown={e => {
            e.stopPropagation();
          }}
          showWatermark={false}
          keyboardSelectAllEnabled={hasCheckedModal}
          columns={ofrColumns}
          {...defaultTableProps}
          columnSettings={DEEP_QUOTE_OFR_TABLE_COLUMN}
          rowKey={row => row?.original.quote_id}
          selectedKeys={selectedOfrRowKeys}
          onSelect={onSelectOfrHandel}
          onCellDoubleClick={(_, row) => handleCellDoubleClick(row, BondQuoteTableColumnKey.Ofr)}
        />
      </div>
    </div>
  );
};
