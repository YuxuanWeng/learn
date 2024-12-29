import { useEffect, useMemo, useState } from 'react';
import { Button } from '@fepkg/components/Button';
import { CommonDatePicker } from '@fepkg/components/DatePicker/CommonPicker';
import { Input } from '@fepkg/components/Input';
import { ModalUtils } from '@fepkg/components/Modal';
import { IconPrecise } from '@fepkg/icon-park-react';
import { dealMulHandover } from '@fepkg/services/api/receipt-deal/deal_mul_handover';
import { BondDealStatus, DealOperationType, OperationSource } from '@fepkg/services/types/bds-enum';
import moment from 'moment';
import { useCountdown } from 'usehooks-ts';
import { dealDiffMarkRead } from '@/common/services/api/deal/diff-mark-read';
import { internalCodeReg } from '@/common/utils/internal-code';
import { miscStorage } from '@/localdb/miscStorage';
import { usePositionCode } from '@/pages/Spot/Panel/DealRecord/hooks/usePositionCode';
import { useDealRecord } from '../../providers/DealRecordProvider';
import { getShowHandOver } from '../../utils';

/** 成交记录筛选 */
export const DealRecordFilter = () => {
  const { data, searchCodeRef, dealDate, setDealDate, handleFilterCode, searchValue, setSearchValue, isLoading } =
    useDealRecord();
  // 用于内码定位
  usePositionCode();
  const [disabledClick, setDisabledClick] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [handling, setHandling] = useState(false);

  const tick = 30;

  const [count, { startCountdown, resetCountdown }] = useCountdown({ countStart: tick, intervalMs: 1000 });

  const { refetchConfirmStatus } = useDealRecord();

  const handleQuickView = async () => {
    const list = data.map(i => i.deal_id).filter(Boolean);
    if (list.length > 0) {
      await dealDiffMarkRead({ deal_id_list: list });
      refetchConfirmStatus();
    }
  };

  const getTotal = () =>
    data.filter(
      d =>
        !d.isHistory &&
        (d.deal_status === BondDealStatus.DealConfirmed || d.deal_status === BondDealStatus.DealPartConfirmed)
    ).length;

  const [total, setTotal] = useState(() => getTotal());

  useEffect(() => {
    if (!isLoading) setTotal(getTotal());
  }, [data, isLoading]);

  const canHandoverItems = useMemo(() => data.filter(i => getShowHandOver(i)), [data]);

  const handoverAll = async () => {
    setHandling(true);
    const result = await dealMulHandover({
      deal_id_list: canHandoverItems.map(i => i.deal_id),
      operation_info: {
        operator: miscStorage.userInfo?.user_id ?? '',
        operation_type: DealOperationType.DOTHandOver,
        operation_source: OperationSource.OperationSourceSpotPricing
      }
    });
    setHandling(false);

    const errorItems = canHandoverItems.filter(i => result.parent_id_list?.includes(i.deal_id));

    if (errorItems.length > 0) {
      ModalUtils.warning({
        title: '以下成交记录移交失败，请重试！',
        content: (
          <>
            交易<span className="text-primary-100">（内码：）{errorItems.map(i => i.internal_code).join('、')}</span>
          </>
        ),
        showCancel: false,
        okText: '好的'
      });
    }
  };

  useEffect(() => {
    if (count !== 0) return;
    resetCountdown();
    setDisabledClick(false);
  }, [count, resetCountdown]);

  return (
    <div className="flex items-center flex-shrink-0 gap-2 h-11">
      <div className="flex items-center gap-1 text-xs text-gray-300 h-7 border-solid border border-gray-600 rounded-lg px-3 select-none">
        已确认<span className="text-sm font-extrabold text-primary-100">{total}</span>笔
      </div>

      <div className="flex gap-2 items-center">
        <Input
          ref={searchCodeRef}
          className="w-40 h-7"
          placeholder="搜索内码"
          value={searchValue}
          onChange={val => {
            if (!internalCodeReg.test(val)) return;
            setSearchValue(val);

            if (val === '') {
              handleFilterCode(val);
            }
          }}
          onEnterPress={val => handleFilterCode(val)}
          suffixIcon={<IconPrecise />}
        />

        <CommonDatePicker
          className="bg-gray-700 !px-3 !w-40 h-7"
          value={dealDate}
          placeholder="不限"
          open={openDatePicker}
          onOpenChange={setOpenDatePicker}
          onChange={date => setDealDate(date ? date.startOf('day') : null)}
          disabledDate={d => moment().diff(d, 'days') >= 14}
        />
      </div>
      <div className="ml-auto flex gap-2">
        {canHandoverItems.length > 0 && (
          <Button
            className="h-7"
            ghost
            loading={handling}
            onClick={handoverAll}
          >
            一键移交
          </Button>
        )}
        <Button
          className="w-[88px] mr-2 h-7"
          ghost
          type="gray"
          disabled={disabledClick}
          onClick={() => {
            handleQuickView();
            startCountdown();
            // 确保按钮点击后立马禁用
            setDisabledClick(true);
          }}
        >
          {disabledClick ? `${count} s` : '一键查看'}
        </Button>
      </div>
    </div>
  );
};
