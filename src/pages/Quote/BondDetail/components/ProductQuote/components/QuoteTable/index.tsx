import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { DEAL_TRADED_DATE_RANGE, useTradedDateRange } from '@fepkg/business/hooks/useTradedDateRange';
import { Button } from '@fepkg/components/Button';
import { Checkbox } from '@fepkg/components/Checkbox';
import { message } from '@fepkg/components/Message';
import { FiccBondBasic, FiccBondDetail, QuoteLite } from '@fepkg/services/types/common';
import { OperationType, ProductType, RefType, Side } from '@fepkg/services/types/enum';
import type { MarketDealMulCreate } from '@fepkg/services/types/market-deal/mul-create';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query';
import { useMemoizedFn } from 'ahooks';
import { Provider as JotaiProvider } from 'jotai';
import { pick } from 'lodash-es';
import { useDialogWindow } from '@/common/hooks/useDialog';
import useOnlineOpenDialog from '@/common/hooks/useOnlineOpenDialog';
import { mulCreateMarketDealWithUndo, mulRefBondQuoteWithUndo } from '@/common/undo-services';
import { copyQuotesByID } from '@/common/utils/copy';
import { trackPoint } from '@/common/utils/logger/point';
import { transform2MarketDeal, transform2MarketDealCreate } from '@/common/utils/market-deal';
import { isPingJiaFan } from '@/common/utils/quote-price';
import { QuoteTrigger } from '@/components/Quote/types';
import { GTButton } from '@/components/ShortcutSidebar/GTButton';
import { MulCreateMarketDealErrorEnum } from '@/components/ShortcutSidebar/constants';
import { DealTrace } from '@/components/ShortcutSidebar/useDealShortcutEvent';
import { miscStorage } from '@/localdb/miscStorage';
import { getMarketDealDialogConfig } from '@/pages/Deal/Market/MarketDealForm/utils';
import { ProductPanelTableKey } from '@/pages/ProductPanel/types';
import { preventEnterDefault } from '@/pages/ProductPanel/utils';
import { useDetailPanel } from '@/pages/Quote/BondDetail/providers/DetailPanelProvider';
import { QuoteActionMode, QuoteFocusInputType } from '@/pages/Quote/SingleQuote/types';
import { getSingleQuoteDialogConfig } from '@/pages/Quote/SingleQuote/utils';
import TableCom from './TableCom';
import { QuoteFetchType } from './types';
import { useHotkeys } from './useHotkeys';

type Props = {
  productType: ProductType;
  bondDetailInfo?: FiccBondDetail;
  bondBasicInfo?: FiccBondBasic;
  quoteLite?: QuoteLite;
  height: number;
  tableKey: ProductPanelTableKey;
  bottomSelected: boolean;
  setBondSelected: Dispatch<SetStateAction<boolean>>;
};

const btnCls = 'w-22 h-7 font-heavy';

const QuoteTable = ({
  productType,
  bondDetailInfo,
  bondBasicInfo,
  quoteLite,
  height,
  tableKey,
  bottomSelected,
  setBondSelected
}: Props) => {
  const { accessCache } = useDetailPanel();

  const [quoteFlag, setQuoteFlag] = useState(false);
  const [selectedQuoteIdList, setSelectedQuoteIdList] = useState(new Set<string>());
  const [bidSelectedQuoteIdList, setBidSelectedQuoteIdList] = useState(new Set<string>());
  const [ofrSelectedQuoteIdList, setOfrSelectedQuoteIdList] = useState(new Set<string>());
  const [ofrSelectedQuoteList, setOfrSelectedQuoteList] = useState<QuoteLite[]>([]);
  const [bidSelectedQuoteList, setBidSelectedQuoteList] = useState<QuoteLite[]>([]);

  const { beforeOpenDialogWindow } = useOnlineOpenDialog();
  const { openDialog } = useDialogWindow();
  const [tradeDateRange] = useTradedDateRange(...DEAL_TRADED_DATE_RANGE);
  const userId = miscStorage.userInfo?.user_id;

  const bidRef = useRef<{
    refetch: <TPageData>(
      options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
    ) => Promise<QueryObserverResult<QuoteFetchType, unknown>>;
  }>();
  const ofrRef = useRef<{
    refetch: <TPageData>(
      options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
    ) => Promise<QueryObserverResult<QuoteFetchType, unknown>>;
  }>();

  const handleRefetch = () => {
    if (ofrSelectedQuoteList.length > 0) {
      ofrRef.current?.refetch();
    } else if (bidSelectedQuoteList.length > 0) {
      bidRef.current?.refetch();
    }
  };

  const selectedQuoteList = useMemo(
    () => [...ofrSelectedQuoteList, ...bidSelectedQuoteList],
    [ofrSelectedQuoteList, bidSelectedQuoteList]
  );
  /** 是否有选择 STC 报价 */
  // const hasSelectedSTCQuote = useMemo(() => getHasSTCQuote(selectedQuoteList), [selectedQuoteList]);
  const hasSelectedSTCQuote = false;
  const referDisabled = !accessCache.quote || !selectedQuoteIdList.size || hasSelectedSTCQuote;

  useEffect(() => {
    if (bottomSelected) {
      setBidSelectedQuoteIdList(new Set<string>());
      setOfrSelectedQuoteIdList(new Set<string>());
      setSelectedQuoteIdList(new Set<string>());
    }
  }, [bottomSelected]);

  useEffect(() => {
    if (selectedQuoteIdList.size > 0) {
      setBondSelected(true);
    } else {
      setBondSelected(false);
    }
  }, [selectedQuoteIdList, setBondSelected]);

  // 和 右键菜单refer的传参不一样，不能直接复用方法
  const actionRefer = async () => {
    if (hasSelectedSTCQuote) return;

    trackPoint(QuoteTrigger.SIDEBAR_SHORTCUT);
    await mulRefBondQuoteWithUndo(
      {
        stc_force: false,
        quote_id_list: Array.from(selectedQuoteIdList),
        refer_type: RefType.Manual,
        operation_info: { operation_type: OperationType.BondQuoteRefer }
      },
      { origin: selectedQuoteList, productType }
    );
    copyQuotesByID(productType, undefined, [...ofrSelectedQuoteList, ...bidSelectedQuoteList]);
    setSelectedQuoteIdList(new Set<string>());
    handleRefetch();
  };

  const handleCreateQuote = useMemoizedFn(() => {
    if (!beforeOpenDialogWindow()) return;
    if (!accessCache.quote) return;

    let editQuote: QuoteLite | undefined;
    if (tableKey === ProductPanelTableKey.Optimal) {
      const bond_info = quoteLite?.bond_basic_info;
      editQuote = { bond_basic_info: bond_info } as QuoteLite;
    } else {
      [editQuote] = [quoteLite].map(q => pick(q, ['bond_basic_info', 'broker'])) as QuoteLite[];
    }
    if (editQuote?.bond_basic_info) {
      editQuote.bond_basic_info = { ...editQuote.bond_basic_info, ...bondBasicInfo };
    }

    if (quoteLite) {
      trackPoint(QuoteTrigger.ENTRY_BUTTON);
      const { config, callback } = getSingleQuoteDialogConfig(productType, {
        defaultValue: editQuote,
        actionMode: QuoteActionMode.JOIN,
        focusInput: QuoteFocusInputType.BID_PRICE,
        onSuccess: handleRefetch
      });
      openDialog(config, { ...callback, showOfflineMsg: false });
    }
  });

  const handleGvn = async () => {
    // 意向价、平价返不可成交
    const targets = selectedQuoteList.filter(q => !q.flag_intention && !isPingJiaFan(q));
    if (targets.length == 0) return void message.error('当前选择报价无法成交！');

    const operation_info = { operation_type: OperationType.BondDealGvnTknDeal };
    const isSyncReceiptDeal = productType === ProductType.NCD ? true : undefined; // NCD二级同步成交单
    const list = await Promise.all(
      targets.map(q => transform2MarketDealCreate(q, tradeDateRange, isSyncReceiptDeal, userId))
    );

    const params: MarketDealMulCreate.Request = {
      market_deal_create_list: list,
      operation_info
    };

    const areQuotesMismatched = targets.length !== selectedQuoteList.length;

    return mulCreateMarketDealWithUndo(params, {
      origin: targets,
      isUndo: true,
      productType
    })
      .then(result => {
        if (
          !areQuotesMismatched &&
          result?.err_record_list?.some(i => i.error_type === MulCreateMarketDealErrorEnum.CalcError)
        ) {
          message.error('计算器异常，点价失败！');
        }
        return result;
      })
      .finally(() => {
        if (areQuotesMismatched) message.error('部分选中报价因价格特殊未成交！');
        handleRefetch();
      });
  };

  const handleTrd = async () => {
    if (!beforeOpenDialogWindow()) return;

    trackPoint(DealTrace.SingleBondDetail);
    let quote: QuoteLite | undefined;

    // 如果当前选中的报价为 1 条，需要带入默认报价 Id
    if (selectedQuoteList.length === 1) {
      // 取到当前选中的quote
      [quote] = selectedQuoteList;
    }
    const defaultValue = await transform2MarketDeal(tradeDateRange, bondBasicInfo, quote);

    const config = getMarketDealDialogConfig(productType, {
      defaultValue,
      defaultQuote: quote,
      defaultFocused: 'price'
    });
    openDialog(config, { showOfflineMsg: false });
  };

  const { gvnTknRef, tradeRef, referRef, quoteRef } = useHotkeys(selectedQuoteList, productType, hasSelectedSTCQuote);

  return (
    <div
      className="mt-3 border-0"
      style={{ height }}
    >
      <div className="flex justify-between mb-3 items-end">
        <div className="bg-gray-800 h-7 flex justify-between px-4 rounded-lg">
          <Checkbox
            className="h-7"
            checked={quoteFlag}
            onChange={setQuoteFlag}
          >
            只看我的报价
          </Checkbox>
        </div>
        <div className="flex items-center gap-3">
          {selectedQuoteIdList.size ? (
            <Button
              tabIndex={-1}
              className={btnCls}
              ref={referRef}
              onClick={actionRefer}
              disabled={referDisabled}
              onKeyDown={preventEnterDefault}
              type="gray"
              ghost
            >
              Refer
            </Button>
          ) : null}
          <Button
            tabIndex={-1}
            className={btnCls}
            ref={quoteRef}
            disabled={!accessCache.quote}
            onKeyDown={preventEnterDefault}
            onClick={handleCreateQuote}
            type="secondary"
            ghost
          >
            Quote
          </Button>
          {selectedQuoteIdList && selectedQuoteIdList.size > 0 && (
            <GTButton
              tabIndex={-1}
              className="w-22 h-7"
              ref={gvnTknRef}
              disabled={!accessCache.deal}
              onKeyDown={preventEnterDefault}
              onClick={handleGvn}
            />
          )}
          <Button
            tabIndex={-1}
            className={btnCls}
            ref={tradeRef}
            disabled={!accessCache.deal}
            onKeyDown={preventEnterDefault}
            onClick={handleTrd}
            type="green"
          >
            Trade
          </Button>
        </div>
      </div>

      <div
        className="relative flex gap-3 pb-2"
        style={{
          height: `${height - 32}px`
        }}
      >
        <JotaiProvider>
          <TableCom
            productType={productType}
            bondId={bondDetailInfo?.code_market}
            quoteFlag={quoteFlag}
            side={Side.SideBid}
            selectedRowKeys={bidSelectedQuoteIdList}
            setSelectedRowKeys={setBidSelectedQuoteIdList}
            setAnotherSelectedRowKeys={setOfrSelectedQuoteIdList}
            setSelectedQuoteIdList={setSelectedQuoteIdList}
            setSelectedQuoteList={setBidSelectedQuoteList}
            refetchRef={bidRef}
          />
        </JotaiProvider>

        <JotaiProvider>
          <TableCom
            productType={productType}
            bondId={bondDetailInfo?.code_market}
            quoteFlag={quoteFlag}
            side={Side.SideOfr}
            selectedRowKeys={ofrSelectedQuoteIdList}
            setSelectedRowKeys={setOfrSelectedQuoteIdList}
            setAnotherSelectedRowKeys={setBidSelectedQuoteIdList}
            setSelectedQuoteIdList={setSelectedQuoteIdList}
            setSelectedQuoteList={setOfrSelectedQuoteList}
            refetchRef={ofrRef}
          />
        </JotaiProvider>
      </div>
    </div>
  );
};

export default QuoteTable;
