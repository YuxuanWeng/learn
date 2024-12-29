import { useEffect, useRef } from 'react';
import { hasOption } from '@fepkg/business/utils/bond';
import { getSettlement } from '@fepkg/business/utils/liq-speed';
import { ContextMenu, MenuItem } from '@fepkg/components/ContextMenu';
import { Dialog } from '@fepkg/components/Dialog';
import { Input, InputProps } from '@fepkg/components/Input';
import { message } from '@fepkg/components/Message';
import { Modal } from '@fepkg/components/Modal';
import type { BondDealUpdate } from '@fepkg/services/types/deal/record-update';
import { DealHandOverStatus, DealOperationType, ExerciseType } from '@fepkg/services/types/enum';
import { useAtom, useAtomValue } from 'jotai';
import { isEqual } from 'lodash-es';
import { dealDiffMarkRead } from '@/common/services/api/deal/diff-mark-read';
import { IDCLiquidationModal } from '@/components/IDCLiquidationModal';
import { DiffModal } from '@/pages/Deal/Detail/components/DiffModal.tsx';
import { usePanelState } from '../Providers/PanelStateProvider';
import {
  anchorPointAtom,
  cloneMdlVisibleAtom,
  ctxMenuVisibleAtom,
  dealRecordOperatingAtom,
  diffModalDataAtom,
  liquidationMdlVisibleAtom
} from './atoms';
import { DealRecordFilter } from './components/DealRecordFilter';
import { Record } from './components/Record';
import { useClone } from './hooks/useClone';
import { useContextMenu } from './hooks/useContextMenu';
import { useDealRecordModify } from './hooks/useDealRecordModify';
import { DealRecordProvider, useDealRecord } from './providers/DealRecordProvider';
import { getContextMenuOptions } from './utils';

const CloneInput = (props: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  return (
    <Input
      {...props}
      ref={inputRef}
    />
  );
};

/** 交易处理页面-成交记录部分 */
const DealRecordInner = () => {
  const { accessCache } = usePanelState();
  const { ourSideIds, refetchConfirmStatus } = useDealRecord();
  const { onDealRecordModify } = useDealRecordModify();
  const { cloneNum, setCloneNum, handleCloneSubmit } = useClone();

  const [curDiffData, setCurDiffData] = useAtom(diffModalDataAtom);

  const [cloneVisible, setCloneVisible] = useAtom(cloneMdlVisibleAtom);
  const [contextVisible, setContextVisible] = useAtom(ctxMenuVisibleAtom);
  const [liqMdlVisible, setLiqMdlVisible] = useAtom(liquidationMdlVisibleAtom);
  const anchorPointPosition = useAtomValue(anchorPointAtom);
  const curDealRecord = useAtomValue(dealRecordOperatingAtom);
  const { handleContextMenuClick, cloneGranterId } = useContextMenu(contextVisible);

  const contextMenuOptions = getContextMenuOptions(
    {
      send: accessCache.recordSend,
      copy: accessCache.recordEdit,
      clone: accessCache.recordEdit,
      remind: accessCache.recordEdit,
      del: accessCache.recordEdit && curDealRecord?.hand_over_status !== DealHandOverStatus.HandOver
    },
    curDealRecord,
    curDealRecord?.spot_pricingee?.broker?.user_id === curDealRecord?.spot_pricinger?.broker?.user_id,
    ourSideIds
  );

  const isHasOption = hasOption(curDealRecord?.bond_info);

  return (
    <>
      {/* 概览、筛选、工具 */}
      <DealRecordFilter />
      <Record />

      {/* 克隆弹窗 */}
      <Modal
        keyboard
        visible={cloneVisible}
        title="克隆"
        width={320}
        onConfirm={() => handleCloneSubmit(cloneGranterId)}
        onCancel={() => setCloneVisible(false)}
        footerProps={{
          centered: true,
          confirmBtnProps: {
            label: '确认'
          }
        }}
      >
        {/* css trick 通过负margin和相对定位来盖住上下的border */}
        <Dialog.Body className="bg-gray-800 -my-px relative">
          <CloneInput
            label="拷贝数量"
            value={cloneNum === 0 ? '' : String(cloneNum)}
            onChange={val => setCloneNum(+val.replaceAll(/\D/g, ''))}
          />
        </Dialog.Body>
      </Modal>

      {/* 右键菜单 */}
      <ContextMenu
        open={contextVisible}
        position={anchorPointPosition}
        onOpenChange={setContextVisible}
      >
        {contextMenuOptions.map(i => (
          <MenuItem
            key={i.key}
            disabled={i?.disabled}
            onClick={() => handleContextMenuClick(i)}
          >
            {i.label}
          </MenuItem>
        ))}
      </ContextMenu>

      <DiffModal
        data={curDiffData}
        visible={curDiffData != null}
        onConfirm={async () => {
          if (curDealRecord == null) return;
          await dealDiffMarkRead({ deal_id_list: [curDealRecord.deal_id] });
          refetchConfirmStatus();
          setCurDiffData(undefined);
        }}
        onCancel={() => {
          setCurDiffData(undefined);
        }}
      />

      {/* 结算方式弹窗 */}
      <IDCLiquidationModal
        bond={curDealRecord?.bond_info}
        visible={liqMdlVisible}
        flagExchange={curDealRecord?.flag_exchange}
        key={`${curDealRecord?.flag_exchange}-${curDealRecord?.exercise_type}-${liqMdlVisible}`}
        exercise={curDealRecord?.exercise_type}
        exerciseManual={curDealRecord?.exercise_type !== ExerciseType.ExerciseTypeNone}
        quoteType={curDealRecord?.price_type}
        hasOption={isHasOption}
        allowDiffBySide={
          (curDealRecord?.bridge_list?.length ?? 0) > 0 ||
          (!curDealRecord?.flag_bid_pay_for_inst && !curDealRecord?.flag_ofr_pay_for_inst)
        }
        settlementDate={{
          ofr: {
            tradedDate: curDealRecord?.ofr_traded_date ?? '',
            deliveryDate: curDealRecord?.ofr_delivery_date ?? ''
          },
          bid: {
            tradedDate: curDealRecord?.bid_traded_date ?? '',
            deliveryDate: curDealRecord?.bid_delivery_date ?? ''
          }
        }}
        onCancel={() => setLiqMdlVisible(false)}
        onConfirm={val => {
          // 校验交易日不能晚于下市日
          const delistedDate = Number(curDealRecord?.bond_info?.delisted_date ?? '');

          const bid_settlement_type = [getSettlement(val.tradedDate?.bid ?? '', val.deliveryDate?.bid ?? '')];
          const ofr_settlement_type = [getSettlement(val.tradedDate?.ofr ?? '', val.deliveryDate?.ofr ?? '')];

          const params: BondDealUpdate = {
            deal_id: curDealRecord?.deal_id ?? '',
            bid_delivery_date: val.deliveryDate.bid,
            bid_traded_date: val.tradedDate.bid,
            ofr_delivery_date: val.deliveryDate.ofr,
            ofr_traded_date: val.tradedDate.ofr,
            flag_stock_exchange: val.flagExchange,
            exercise_type: val.exercise,
            exercise_manual: val.exerciseManual,
            // for oper/history log
            bid_settlement_type,
            ofr_settlement_type
          };

          // 没有要素被修改就直接关闭
          if (
            isEqual(params.bid_traded_date, curDealRecord?.bid_traded_date) &&
            isEqual(params.ofr_traded_date, curDealRecord?.ofr_traded_date) &&
            isEqual(params.bid_delivery_date, curDealRecord?.bid_delivery_date) &&
            isEqual(params.ofr_delivery_date, curDealRecord?.ofr_delivery_date) &&
            isEqual(params.flag_stock_exchange, curDealRecord?.flag_exchange) &&
            isEqual(params.exercise_type, curDealRecord?.exercise_type)
          ) {
            setLiqMdlVisible(false);
            return;
          }

          // 已经确认修改的时候交易日是一定会有的
          if (
            // 有下市日才校验
            delistedDate > 0 &&
            (Number(val.tradedDate.bid) >= delistedDate || Number(val.tradedDate.ofr) >= delistedDate)
          ) {
            message.warn('交易日不能晚于下市日');
            return;
          }

          onDealRecordModify({ payload: params, operationType: DealOperationType.DOTModifyDeal });
          setLiqMdlVisible(false);
        }}
      />
    </>
  );
};

export const DealRecord = () => {
  return (
    <DealRecordProvider>
      <DealRecordInner />
    </DealRecordProvider>
  );
};
