import { memo, useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import { SERVER_NIL } from '@fepkg/common/constants';
import { usePrevious } from '@fepkg/common/hooks';
import { formatDate } from '@fepkg/common/utils/date';
import { Button } from '@fepkg/components/Button';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconSend, IconTime, IconView } from '@fepkg/icon-park-react';
import { Counterparty, DealConfirmSnapshot } from '@fepkg/services/types/common';
import { BondDealUpdate } from '@fepkg/services/types/deal/record-update';
import {
  BondDealStatus,
  BondQuoteType,
  DealHandOverStatus,
  DealOperationType,
  DealType,
  ExerciseType,
  OperationSource
} from '@fepkg/services/types/enum';
import { useAtom, useSetAtom } from 'jotai';
import { isEqual } from 'lodash-es';
import { useDialogWindow } from '@/common/hooks/useDialog';
import { handOverDealRecord } from '@/common/services/api/deal-record/hand-over';
import { BondCode } from '@/components/IDCHistory/BondCode';
import { BridgeMark } from '@/components/IDCHistory/BridgeMark';
import { BrokerStatus } from '@/components/IDCHistory/BrokerStatus';
import { DealTypeRender } from '@/components/IDCHistory/DealTypeRender';
import { InstDisplay } from '@/components/IDCHistory/InstDisplay';
import { MatchingVolume } from '@/components/IDCHistory/MatchingVolume';
import { PriceRender } from '@/components/IDCHistory/Price';
import { SendInput } from '@/components/IDCHistory/SendInput';
import TransactionStatus from '@/components/IDCHistory/TransactionStatus';
import { markColors, sourceText } from '@/components/IDCHistory/constants';
import { useProductParams } from '@/layouts/Home/hooks';
import { miscStorage } from '@/localdb/miscStorage';
import { usePanelState } from '@/pages/Spot/Panel/Providers/PanelStateProvider';
import { getOperRecordDialogConfig } from '@/pages/Spot/utils/openDialog';
import { dealRecordOperatingAtom, diffModalDataAtom, liquidationMdlVisibleAtom } from '../../atoms';
import { useDealRecordModify } from '../../hooks/useDealRecordModify';
import { RecordContentProvider, useRecordContent } from '../../providers/DealRecordContentProvider';
import { DealRecordSpotStatus } from '../../providers/DealRecordProvider';
import { TypeDealRecord } from '../../types';
import { confirmedStatus, getDealRecordSnapshotData, getShowHandOver } from '../../utils';
import { getColorIcon } from '../../utils/recordUtils';

type Props = {
  /** 单条历史成交记录信息 */
  historyInfo: TypeDealRecord;
  /** 是否为历史成交 */
  isHistory?: boolean;
  /** 是否为斑马纹中的深色背景 */
  isDark?: boolean;
  spotInfo?: DealRecordSpotStatus;
  snapshot?: DealConfirmSnapshot;
};

const formatType = 'HH:mm:ss';

const RecordContentInner = ({ isHistory = false, historyInfo, isDark, spotInfo, snapshot }: Props) => {
  const { accessCache } = usePanelState();
  const { remark, canModify, inputReadonly, ofrInputReadonly, handleBridgeChange, handleConfirmPrice, ourSideIds } =
    useRecordContent();
  const { onDealRecordModify } = useDealRecordModify();
  const { openDialog } = useDialogWindow();
  const { productType } = useProductParams();

  const editDisabled = !accessCache.recordEdit || !canModify;

  // 是否展示第一行
  const displayFirstLine = !!historyInfo.deal_status && confirmedStatus.includes(historyInfo.deal_status);

  const [curDealRecord, setCurDealRecord] = useAtom(dealRecordOperatingAtom);
  const setLiqMdlVisible = useSetAtom(liquidationMdlVisibleAtom);
  const setDiffVisible = useSetAtom(diffModalDataAtom);
  const [bridgeState, setBridgeState] = useState(historyInfo.flag_bridge ?? false);

  const prevHistoryInfo = usePrevious(historyInfo);

  useEffect(() => {
    if (!isEqual(prevHistoryInfo, historyInfo)) {
      setBridgeState(historyInfo.flag_bridge ?? false);
    }
  }, [historyInfo]);

  useEffect(() => {
    if (curDealRecord?.deal_id === historyInfo.deal_id && !canModify) {
      setCurDealRecord(undefined);
      setLiqMdlVisible(false);
    }
  }, [canModify]);

  const brokerColor = getColorIcon({
    onConfirm: handleConfirmPrice,
    spotInfo: historyInfo.spot_pricinger,
    beSpotInfo: historyInfo.spot_pricingee
  });

  const openLog = () => openDialog(getOperRecordDialogConfig(productType, { deal_id: historyInfo.deal_id }));

  /** 是否展示移交 */
  const showHandOver = getShowHandOver(historyInfo);

  /** 是否已经移交 */
  const isHandOver = historyInfo?.hand_over_status === DealHandOverStatus.HandOver;

  const diffData = useMemo(() => {
    return snapshot == null ? undefined : getDealRecordSnapshotData(historyInfo, productType, snapshot);
  }, [historyInfo, productType, snapshot]);

  const showViewBtn = diffData?.hasChanged; // 移交后反向同步或之前的逻辑都展示

  return (
    <>
      {/* 成交状态标志 */}
      <TransactionStatus
        // 当状态和来源undefined的时候，默认展示没有背景色，没有文本
        color={markColors[historyInfo.deal_status ?? BondDealStatus.BondDealStatusNone]}
        texts={sourceText[historyInfo?.source ?? OperationSource.OperationSourceNone]?.split('')}
      />
      {/* 成交记录内容 */}
      <div className="flex flex-col flex-1 gap-1 pb-2 pt-1 pr-3 overflow-hidden justify-between select-none">
        {/* 第一行内容，仅在全部确认和部分确认状态下展示 */}
        {spotInfo != null && (
          <div className="flex self-start h-7 my-0.5 bg-gray-600 rounded-lg px-2 items-center gap-2 py-0.5 text-gray-200">
            <div className="bg-gray-700 flex h-6 items-center rounded-lg px-3">
              总计<span className="text-sm text-orange-050 ml-1">{spotInfo?.spotVolume}</span>
            </div>
            <div className="flex ml-1 items-center">
              已确认<span className="text-sm text-primary-100 ml-1">{spotInfo?.confirmVolume}</span>
            </div>
            <div className="h-4 w-px bg-gray-500" />
            <div className="flex items-center">
              待确认<span className="text-sm text-orange-100 ml-1">{spotInfo?.pendingVolume}</span>
            </div>
            <div className="h-4 w-px bg-gray-500" />
            <div className="flex items-center">
              拒绝/未匹配<span className="text-sm text-danger-100 ml-1">{spotInfo?.rejectVolume}</span>
            </div>
          </div>
        )}
        {/* 第一行内容，仅在全部确认和部分确认状态下展示 */}
        <div className={cx('flex items-center gap-2 mt-1', !displayFirstLine && 'hidden')}>
          <BridgeMark
            disabled={
              editDisabled || ((historyInfo.flag_bid_pay_for_inst || historyInfo.flag_ofr_pay_for_inst) && !bridgeState)
            }
            internalCode={historyInfo?.internal_code ?? ''}
            isBridge={bridgeState}
            onChange={() => handleBridgeChange(setBridgeState)}
            historyInfo={historyInfo}
            onFindBridgeChanged={val => {
              historyInfo.default_bridge_config = val;
            }}
          />
          <SendInput
            isBridge={bridgeState}
            bidValue={bridgeState ? historyInfo.bid_send_order_msg : historyInfo?.send_order_msg}
            ofrValue={historyInfo?.ofr_send_order_msg}
            bidInputReadonly={!accessCache.recordEdit || inputReadonly}
            ofrInputReadonly={!accessCache.recordEdit || ofrInputReadonly}
            onBidConfirm={(val, onError) =>
              onDealRecordModify({
                payload: {
                  deal_id: historyInfo?.deal_id ?? '',
                  flag_bridge: historyInfo?.flag_bridge,
                  send_order_msg: historyInfo?.flag_bridge ? undefined : val,
                  bid_send_order_msg: historyInfo?.flag_bridge ? val : undefined
                },
                operationType: DealOperationType.DOTModifyDeal,
                onError
              })
            }
            onOfrConfirm={(val, onError) =>
              onDealRecordModify({
                payload: { deal_id: historyInfo?.deal_id ?? '', ofr_send_order_msg: val, flag_bridge: true },
                operationType: DealOperationType.DOTModifyDeal,
                onError
              })
            }
            isDark={isDark}
          />
          {/* 查看按钮 */}
          {showViewBtn && (
            <Button
              className="w-7 h-7 px-0"
              type="gray"
              plain
              onClick={() => {
                setCurDealRecord(historyInfo);
                setDiffVisible(diffData);
              }}
            >
              <IconView />
            </Button>
          )}
          {/* 移交按钮 */}
          {showHandOver && (
            <Tooltip
              content="移交"
              destroyOnClose
            >
              <Button
                className="w-7 h-7 px-0"
                plain
                icon={<IconSend />}
                onClick={() =>
                  handOverDealRecord({
                    deal_id: historyInfo.deal_id,

                    operation_info: {
                      operator: miscStorage.userInfo?.user_id ?? '',
                      operation_type: DealOperationType.DOTHandOver,
                      operation_source: OperationSource.OperationSourceSpotPricing
                    }
                  })
                }
              />
            </Tooltip>
          )}
        </div>

        {/* 第二行内容 */}
        <div className="flex items-center justify-between h-10">
          <BondCode
            editable={!editDisabled}
            defaultBond={historyInfo?.bond_info}
            onChange={(bond, onError) => {
              if (bond.key_market !== historyInfo?.bond_info?.key_market) {
                onDealRecordModify({
                  payload: {
                    deal_id: historyInfo?.deal_id ?? '',
                    bond_key_market: bond.key_market,
                    exercise_manual: false,
                    exercise_type: ExerciseType.ExerciseTypeNone
                  },
                  operationType: DealOperationType.DOTModifyDeal,
                  onError
                });

                // 保证乐观更新后收到远程更新时会正常变化
                historyInfo.bond_info = bond;
              }
            }}
          />
          <PriceRender
            editable={!editDisabled}
            price={String(historyInfo?.price ?? '')}
            price_type={historyInfo?.price_type}
            rebate={historyInfo?.return_point?.toString() ?? ''}
            onChangePrice={({ val, type, onError }) => {
              const payload: BondDealUpdate = {
                deal_id: historyInfo?.deal_id ?? '',
                full_price: type === BondQuoteType.FullPrice ? val : undefined,
                clean_price: type === BondQuoteType.CleanPrice ? val : undefined,
                yield: type === BondQuoteType.Yield ? val : undefined,
                price_type: type,
                exercise_type: type === BondQuoteType.CleanPrice ? ExerciseType.ExerciseTypeNone : undefined,
                exercise_manual: type === BondQuoteType.CleanPrice ? false : undefined
              };

              if (type === BondQuoteType.CleanPrice) {
                payload.return_point = SERVER_NIL;
              }

              onDealRecordModify({
                payload,
                operationType: DealOperationType.DOTModifyDeal,
                onError
              });
            }}
            onChangeRebate={(e, onError) => {
              if (e)
                onDealRecordModify({
                  payload: { deal_id: historyInfo?.deal_id ?? '', return_point: +e },
                  operationType: DealOperationType.DOTModifyDeal,
                  onError
                });
              // return_point传-1时，表示清空返点
              else
                onDealRecordModify({
                  payload: { deal_id: historyInfo?.deal_id ?? '', return_point: SERVER_NIL },
                  operationType: DealOperationType.DOTModifyDeal,
                  onError
                });
            }}
          />
          <MatchingVolume
            editable={!editDisabled}
            internal={historyInfo?.flag_internal}
            volume={historyInfo?.confirm_volume ?? 0}
            onChange={(e, onError) => {
              if (e !== historyInfo?.confirm_volume)
                onDealRecordModify({
                  payload: { deal_id: historyInfo?.deal_id ?? '', confirm_volume: e },
                  operationType: DealOperationType.DOTModifyDeal,
                  onError
                });
            }}
            isHistory={isHistory}
            historyInfo={historyInfo}
            isSpottedSelf={ourSideIds?.includes(historyInfo.spot_pricingee?.broker?.user_id ?? '')}
          />
          <Tooltip
            content={remark}
            truncate
          >
            <div
              className={cx(
                'font-semibold text-sm text-orange-050 flex-1 truncate ml-3',
                editDisabled ? 'cursor-text' : 'cursor-pointer'
              )}
              // 双击打开结算方式弹窗
              onDoubleClick={() => {
                if (editDisabled) return;
                if (historyInfo) setCurDealRecord(historyInfo);
                setLiqMdlVisible(true);
              }}
            >
              {remark}
            </div>
          </Tooltip>
          <div className="flex items-center flex-shrink-0 h-8">
            <div className="text-[13px] text-gray-300 mr-1 text-center w-[72px]">
              {isHistory && <div>{formatDate(historyInfo?.create_time, 'MM-DD')}</div>}
              <div>{formatDate(historyInfo?.create_time, formatType)}</div>
            </div>
            <Button.Icon
              type="gray"
              text
              icon={<IconTime />}
              disabled={!accessCache.recordLog}
              onClick={openLog}
            />
          </div>
        </div>

        {/* 第三行内容 */}
        <div className="flex items-center justify-between">
          <InstDisplay
            isDark={isDark}
            editable={!editDisabled}
            instTrader={historyInfo.spot_pricinger ?? {}}
            otherSideTraderId={historyInfo.spot_pricingee?.trader?.trader_id}
            onInstTraderChange={(val, onReset) => {
              const [inst_id, trader_id, trader_tag = ''] = (val ?? '').split('|');
              onDealRecordModify({
                payload: {
                  deal_id: historyInfo?.deal_id ?? '',
                  spot_pricinger_inst: { inst_id, trader_id, trader_tag }
                },
                operationType: DealOperationType.DOTModifyDeal,
                onError: onReset
              });
            }}
            flagPayForInst={
              (historyInfo.bridge_list?.length ?? 0) === 0 &&
              (historyInfo.deal_type === DealType.TKN
                ? historyInfo.flag_bid_pay_for_inst ?? false
                : historyInfo.flag_ofr_pay_for_inst ?? false)
            }
          />
          <BrokerStatus
            isHandOver={isHandOver}
            editable={!editDisabled}
            broker={historyInfo?.spot_pricinger ?? {}}
            onTransferChange={(transfer, comment, onError) => {
              const broker = historyInfo?.spot_pricinger;

              if (broker == null || (transfer === broker.flag_modify_brokerage && broker.brokerage_comment === comment))
                return;
              const result: Counterparty = {
                flag_modify_brokerage: transfer,
                brokerage_comment: transfer ? comment : undefined
              };
              onDealRecordModify({
                payload: { deal_id: historyInfo?.deal_id ?? '', spot_pricinger_inst: result },
                operationType: DealOperationType.DOTModifyDeal,
                onError
              });
            }}
            // 经纪人
            onBrokerChange={(val, onError) =>
              onDealRecordModify({
                payload: { deal_id: historyInfo?.deal_id ?? '', spot_pricinger_inst: { broker_id: val } },
                operationType: DealOperationType.DOTModifyDeal,
                onError
              })
            }
            IconRender={brokerColor.node}
          />
          <div className="w-[92px] text-center">
            <DealTypeRender type={historyInfo?.deal_type ?? DealType.GVN} />
          </div>
          <InstDisplay
            isDark={isDark}
            editable={!editDisabled}
            instTrader={historyInfo?.spot_pricingee ?? {}}
            otherSideTraderId={historyInfo.spot_pricinger?.trader?.trader_id}
            onInstTraderChange={(val, onReset) => {
              const [inst_id, trader_id, trader_tag] = (val ?? '').split('|');
              onDealRecordModify({
                payload: {
                  deal_id: historyInfo?.deal_id ?? '',
                  spot_pricingee_inst: { inst_id, trader_id, trader_tag }
                },
                operationType: DealOperationType.DOTModifyDeal,
                onError: onReset
              });
            }}
            flagPayForInst={
              (historyInfo.bridge_list?.length ?? 0) === 0 &&
              (historyInfo.deal_type === DealType.TKN
                ? historyInfo.flag_ofr_pay_for_inst ?? false
                : historyInfo.flag_bid_pay_for_inst ?? false)
            }
          />
          <BrokerStatus
            isHandOver={isHandOver}
            editable={!editDisabled}
            broker={historyInfo?.spot_pricingee}
            onTransferChange={(transfer, comment, onError) => {
              const broker = historyInfo?.spot_pricingee;

              if (broker == null || (transfer === broker.flag_modify_brokerage && broker.brokerage_comment === comment))
                return;
              const result: Counterparty = {
                flag_modify_brokerage: transfer,
                brokerage_comment: transfer ? comment : undefined
              };
              onDealRecordModify({
                payload: { deal_id: historyInfo?.deal_id ?? '', spot_pricingee_inst: result },
                operationType: DealOperationType.DOTModifyDeal,
                onError
              });
            }}
            onBrokerChange={(val, onError) =>
              onDealRecordModify({
                payload: { deal_id: historyInfo?.deal_id ?? '', spot_pricingee_inst: { broker_id: val } },
                operationType: DealOperationType.DOTModifyDeal,
                onError
              })
            }
            needHighLightBeSpotName={brokerColor.needHighLightBeSpotName}
            IconRender={brokerColor.beSpotNode}
          />
        </div>
      </div>
    </>
  );
};

function RecordContentContainer(props: Props) {
  return (
    <RecordContentProvider initialState={{ historyInfo: props.historyInfo }}>
      <RecordContentInner {...props} />
    </RecordContentProvider>
  );
}

export const RecordContent = memo(RecordContentContainer, (prev, next) => {
  return (
    isEqual(prev.historyInfo, next.historyInfo) &&
    isEqual(prev.spotInfo, next.spotInfo) &&
    isEqual(prev.snapshot, next.snapshot)
  );
});
