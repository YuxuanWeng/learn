import { useMemo, useState } from 'react';
import cx from 'classnames';
import { UrgeReceiptDealStatusSet } from '@fepkg/business/components/ReceiptDealTableCell';
import { InstSearch, useInstSearch } from '@fepkg/business/components/Search/InstSearch';
import { SideOptions } from '@fepkg/business/constants/options';
import { isIntegerString } from '@fepkg/common/utils';
import { HighlightOption } from '@fepkg/components/BaseOptionsRender/HighlightOption';
import { Button } from '@fepkg/components/Button';
import { CheckboxValue } from '@fepkg/components/Checkbox';
import { Input } from '@fepkg/components/Input';
import { message } from '@fepkg/components/Message';
import { RadioIndeterminateGroup } from '@fepkg/components/Radio';
import { Tooltip } from '@fepkg/components/Tooltip';
import {
  IconAttentionFilled,
  IconLoading,
  IconPreview,
  IconPrinter,
  IconReminder,
  IconReset,
  IconSearch
} from '@fepkg/icon-park-react';
import { InstitutionTiny } from '@fepkg/services/types/bdm-common';
import { ReceiptDeal } from '@fepkg/services/types/bds-common';
import { BondSearchType, DealOperationType, OperationSource, Side, UrgeStatus } from '@fepkg/services/types/enum';
import { InstFuzzySearch } from '@fepkg/services/types/inst/fuzzy-search';
import { DTMTrackEventDashBoardEnum } from '@/hooks/useLog';
import { useAuth } from '@/providers/AuthProvider';
import moment from 'moment';
import { trackPoint } from '@/common/logger';
import { printReceiptDeal } from '@/common/services/api/approval/print';
import { urgeChildDeals } from '@/common/services/api/deal/child-deal-urge';
import { fetchReceiptDealByParent } from '@/common/services/api/receipt-deal/get_by_parent';
import { Export } from '@/components/Export';
import { BondSearch, useBondSearch } from '@/components/Search/BondSearch';
import { TraderSearch, useTraderSearch } from '@/components/Search/TraderSearch';
import { RouteUrl } from '@/router/constants';
import { BridgeOptions } from '@/pages/ApprovalList/constants/filter';
import { useApprovalTable } from '@/pages/ApprovalList/providers/TableProvider';
import { ApprovalListType, BridgeType } from '@/pages/ApprovalList/types';
import { getApprovalListFilterBridgeValue } from './utils';

const SearchCls = 'h-8 w-[200px] bg-gray-800';

/** 仅仅渲染机构简称的option */
const getOptionRender = (inst: InstitutionTiny, keyword: string) => (
  <HighlightOption
    keyword={keyword}
    label={inst.short_name_zh ?? ''}
  />
);

export const ApprovalListInputFilter = () => {
  const {
    data,
    accessCache,
    type,
    filterParams,
    inputFilterValue,
    updateInputFilterValue,
    needUpdate,
    handleRefetch,
    approvalListTableSelectIds
  } = useApprovalTable();
  const { user } = useAuth();
  const { updateBondSearchState } = useBondSearch();
  const { instSearchState, updateInstSearchState } = useInstSearch();
  const { traderSearchState, updateTraderSearchState } = useTraderSearch();
  const [isResetting, setIsResetting] = useState(false);

  const selectedUrgeReceiptDeals = useMemo(() => {
    if (type !== ApprovalListType.History) return [];
    const selectIdSet = new Set(approvalListTableSelectIds);
    const tenMinutesAgo = moment().subtract(10, 'minute').valueOf();
    // 状态为待移交、待确认、待提交、未通过，并且距离上一次催单已经超过10min（仅关注选择的时候）
    return (
      data?.flatDeals?.filter(
        d =>
          UrgeReceiptDealStatusSet.has(d.receipt_deal_status) &&
          selectIdSet.has(d.receipt_deal_id) &&
          (d.flag_urge && d.urge_time ? Number(d.urge_time) <= tenMinutesAgo : true)
      ) ?? []
    );
  }, [approvalListTableSelectIds, data?.flatDeals, type]);

  const onBridgeChange = (val: CheckboxValue[]) => {
    let inst_is_bridge_inst: boolean | undefined;
    if (val.includes(BridgeType.NonBridge)) {
      inst_is_bridge_inst = false;
    } else if (val.includes(BridgeType.Bridge)) {
      inst_is_bridge_inst = true;
    }
    updateInputFilterValue({ inst_is_bridge_inst });
  };

  const handlePrint = (receiptDealIds: string[]) => {
    window.open(`${RouteUrl.PreviewPrint}?id=${receiptDealIds.join(',')}`, '_blank');
    printReceiptDeal({
      receipt_deal_ids: receiptDealIds,
      operation_info: {
        operator: user?.user_id ?? '',
        operation_type: DealOperationType.DOTPrint,
        operation_source: OperationSource.OperationSourceApproveReceiptDeal
      }
    }).then(() => handleRefetch());
  };

  const handleUrgeReceiptDeals = async (receiptDeals: ReceiptDeal[]) => {
    const childDealIdSet = new Set<string>();
    const bridgeParentDealIdSet = new Set<string>();

    for (const d of receiptDeals) {
      if (d.bridge_index && d.parent_deal_id) {
        bridgeParentDealIdSet.add(d.parent_deal_id);
      } else {
        childDealIdSet.add(d.receipt_deal_id);
      }
    }
    if (bridgeParentDealIdSet.size) {
      const response = await fetchReceiptDealByParent({ parent_deal_ids: [...bridgeParentDealIdSet] });
      if (response.receipt_deal_info) {
        for (const d of response.receipt_deal_info) {
          childDealIdSet.add(d.receipt_deal_id);
        }
      }
    }
    try {
      const response = await urgeChildDeals({ child_deal_id_list: [...childDealIdSet] });
      if (response.urge_status === UrgeStatus.UrgeFailed) {
        message.error('成交单经纪人失效，催单失败');
      } else if (response.urge_status === UrgeStatus.UrgePartSuccess) {
        message.error('部分成交单经纪人失效，催单失败');
      }
    } finally {
      setIsResetting(true);
      handleRefetch().then(() => setIsResetting(false));
    }
  };

  return (
    <div className="p-px -my-px">
      <div className="flex w-full gap-x-3">
        <div
          className={cx(
            'flex-grow flex-shrink flex select-none gap-3 overflow-hidden',
            type === ApprovalListType.Approval && 'flex-wrap'
          )}
        >
          <Input
            className={SearchCls}
            placeholder="订单号"
            suffixIcon={<IconSearch />}
            value={inputFilterValue.receipt_deal_order_no}
            onChange={val => {
              if (isIntegerString(val)) {
                updateInputFilterValue({ receipt_deal_order_no: val ?? null });
              } else {
                updateInputFilterValue({ receipt_deal_order_no: inputFilterValue.receipt_deal_order_no ?? null });
              }
            }}
          />
          <Input
            className={SearchCls}
            placeholder="过桥码"
            suffixIcon={<IconSearch />}
            value={inputFilterValue.bridge_code}
            onChange={val => {
              if (isIntegerString(val)) {
                updateInputFilterValue({ bridge_code: val ?? null });
              } else {
                updateInputFilterValue({ bridge_code: inputFilterValue.bridge_code ?? null });
              }
            }}
          />
          {type === ApprovalListType.Approval ? (
            <>
              <InstSearch<InstitutionTiny, InstFuzzySearch.Request>
                className={SearchCls}
                label=""
                searchParams={{ need_invalid: true }}
                firstActive={false}
                defaultSelectOnEnterDown={false}
                placeholder="机构"
                optionRender={getOptionRender}
                dropdownCls="max-w-[200px]"
                suffixIcon={<IconSearch />}
                onChange={opt => {
                  updateInputFilterValue({ inst_id: opt?.original.inst_id, inst_user_input: void 0 });
                  updateInstSearchState(draft => {
                    draft.selected = opt ?? null;
                  });
                }}
                onEnterPress={() => updateInputFilterValue({ inst_user_input: instSearchState.keyword || void 0 })}
                onBlur={() => updateInputFilterValue({ inst_user_input: instSearchState.keyword || void 0 })}
                onClearClick={() => updateInputFilterValue({ inst_id: void 0, inst_user_input: void 0 })}
                autoClear={false}
              />
              <TraderSearch
                className={SearchCls}
                label=""
                searchParams={{ need_invalid: true }}
                firstActive={false}
                defaultSelectOnEnterDown={false}
                placeholder="交易员"
                suffixIcon={<IconSearch />}
                onChange={opt => {
                  updateInputFilterValue({ trader_id: opt?.original.trader_id, trader_user_input: void 0 });
                  updateTraderSearchState(draft => {
                    draft.selected = opt ?? null;
                  });
                }}
                onEnterPress={() => updateInputFilterValue({ trader_user_input: traderSearchState.keyword || void 0 })}
                onBlur={() => updateInputFilterValue({ trader_user_input: traderSearchState.keyword || void 0 })}
                onClearClick={() => updateInputFilterValue({ trader_id: void 0, trader_user_input: void 0 })}
                autoClear={false}
              />
            </>
          ) : null}
          <div className="h-8 w-[200px]">
            <BondSearch
              className="bg-gray-800"
              label=""
              placeholder="债券"
              suffixIcon={<IconSearch />}
              searchParams={{ search_type: BondSearchType.SearchDealProcess, unlimited: true }}
              parsing={false}
              onChange={opt => {
                updateInputFilterValue({ bond_key: opt?.original.bond_key });
                updateBondSearchState(draft => {
                  draft.selected = opt ?? null;
                });
              }}
            />
          </div>
          <Input
            className={SearchCls}
            placeholder="成交价"
            suffixIcon={<IconSearch />}
            value={inputFilterValue.deal_price}
            onChange={val => {
              if (!Number.isNaN(+val)) {
                updateInputFilterValue({ deal_price: val ?? null });
              } else {
                updateInputFilterValue({ deal_price: inputFilterValue.deal_price ?? null });
              }
            }}
          />
          <Input
            className={SearchCls}
            placeholder="券面总额(百万)"
            suffixIcon={<IconSearch />}
            value={inputFilterValue.volume}
            onChange={val => {
              if (!Number.isNaN(+val)) {
                updateInputFilterValue({ volume: val ?? null });
              } else {
                updateInputFilterValue({ volume: inputFilterValue.volume ?? null });
              }
            }}
          />
        </div>
        {type !== ApprovalListType.Approval && (
          <div className="flex shrink-0 gap-3">
            <Button
              type="primary"
              ghost
              icon={<IconPreview />}
              className="w-[88px] px-0"
              disabled={!approvalListTableSelectIds.length}
              onClick={() => {
                window.open(`${RouteUrl.Preview}?id=${approvalListTableSelectIds.join(',')}`, '_blank');
              }}
            >
              批量查看
            </Button>
            {type === ApprovalListType.History && (
              <Button
                type="primary"
                ghost
                icon={<IconReminder />}
                className="w-[88px]"
                disabled={!selectedUrgeReceiptDeals.length}
                onClick={() => handleUrgeReceiptDeals(selectedUrgeReceiptDeals)}
              >
                催单
              </Button>
            )}
            {((accessCache.historyPrint && type === ApprovalListType.History) ||
              (accessCache.dealPrint && type === ApprovalListType.Deal)) && (
              <Tooltip
                visible
                content={!approvalListTableSelectIds.length && '请选择要打印的成交单'}
              >
                <Button
                  type="primary"
                  className="w-[88px]"
                  disabled={!approvalListTableSelectIds.length}
                  icon={<IconPrinter />}
                  onClick={() => {
                    handlePrint(approvalListTableSelectIds);
                  }}
                >
                  打印
                </Button>
              </Tooltip>
            )}

            {accessCache.historyExport && type === ApprovalListType.History && (
              <Export.Button filterParams={filterParams} />
            )}
          </div>
        )}
      </div>

      {type !== ApprovalListType.Approval ? (
        <div className="flex select-none gap-x-4 mt-4">
          <div className="shrink flex gap-3 rounded-lg outline outline-[1px] outline-gray-600 overflow-hidden">
            <div className="h-8 w-[200px]">
              <InstSearch
                autoClear={false}
                floatShift={false}
                className="bg-gray-800"
                label=""
                searchParams={{ need_invalid: true }}
                firstActive={false}
                defaultSelectOnEnterDown={false}
                placeholder="机构"
                suffixIcon={<IconSearch />}
                optionRender={getOptionRender}
                dropdownCls="max-w-[200px]"
                onChange={opt => {
                  if (opt) {
                    updateInputFilterValue({ inst_id: opt?.original.inst_id, inst_user_input: void 0 });
                  } else {
                    updateInputFilterValue({
                      inst_id: void 0,
                      inst_is_bridge_inst: void 0,
                      inst_side: void 0,
                      inst_user_input: void 0
                    });
                  }
                  updateInstSearchState(draft => {
                    draft.selected = opt ?? null;
                  });
                }}
                onEnterPress={() => updateInputFilterValue({ inst_user_input: instSearchState.keyword || void 0 })}
                onBlur={() => updateInputFilterValue({ inst_user_input: instSearchState.keyword || void 0 })}
                onClearClick={() =>
                  updateInputFilterValue({
                    inst_id: void 0,
                    inst_is_bridge_inst: void 0,
                    inst_side: void 0,
                    inst_user_input: void 0
                  })
                }
              />
            </div>
            <RadioIndeterminateGroup
              className="h-8 bg-gray-800 rounded-lg"
              options={BridgeOptions}
              disabled={!inputFilterValue.inst_id && !inputFilterValue.inst_user_input}
              otherCancel
              value={getApprovalListFilterBridgeValue(inputFilterValue)}
              onChange={onBridgeChange}
            />
            <RadioIndeterminateGroup
              className="h-8 bg-gray-800 rounded-lg"
              options={SideOptions}
              disabled={!inputFilterValue.inst_id && !inputFilterValue.inst_user_input}
              otherCancel
              value={inputFilterValue.inst_side ? [inputFilterValue.inst_side] : []}
              onChange={val => {
                updateInputFilterValue({ inst_side: val.at(0) as Side });
              }}
            />
          </div>
          <div className="shrink flex gap-3 rounded-lg outline outline-[1px] outline-gray-600 overflow-hidden">
            <div className="h-8 w-[200px]">
              <TraderSearch
                className="bg-gray-800"
                label=""
                searchParams={{ need_invalid: true }}
                firstActive={false}
                defaultSelectOnEnterDown={false}
                placeholder="交易员"
                autoClear={false}
                suffixIcon={<IconSearch />}
                onChange={opt => {
                  if (opt) {
                    updateInputFilterValue({ trader_id: opt?.original.trader_id, trader_user_input: void 0 });
                  } else {
                    updateInputFilterValue({ trader_id: void 0, trader_side: void 0, trader_user_input: void 0 });
                  }
                  updateTraderSearchState(draft => {
                    draft.selected = opt ?? null;
                  });
                }}
                onEnterPress={() => updateInputFilterValue({ trader_user_input: traderSearchState.keyword || void 0 })}
                onBlur={() => updateInputFilterValue({ trader_user_input: traderSearchState.keyword || void 0 })}
                onClearClick={() =>
                  updateInputFilterValue({ trader_id: void 0, trader_side: void 0, trader_user_input: void 0 })
                }
              />
            </div>
            <RadioIndeterminateGroup
              className="h-8 bg-gray-800 rounded-lg"
              options={SideOptions}
              disabled={!inputFilterValue.trader_id && !inputFilterValue.trader_user_input}
              otherCancel
              value={inputFilterValue.trader_side ? [inputFilterValue.trader_side] : []}
              onChange={val => {
                const side = val.at(0);
                updateInputFilterValue({ trader_side: side ? (side as Side) : void 0 });
              }}
            />
          </div>
          {needUpdate && (
            <div
              className="shink-0 ml-auto flex px-3 items-center gap-2 bg-gray-800 rounded-lg cursor-pointer"
              onClick={() => {
                setIsResetting(true);
                handleRefetch().then(() => setIsResetting(false));

                trackPoint(DTMTrackEventDashBoardEnum.ClickHistoryRefreshButton);
              }}
            >
              <IconAttentionFilled className="text-orange-100" />
              <span className="whitespace-nowrap">数据发生变化，请点此刷新</span>
              {isResetting ? <IconLoading className="animate-spin" /> : <IconReset />}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
