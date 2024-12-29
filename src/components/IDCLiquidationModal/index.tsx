import { useMemo, useState } from 'react';
import { normalizeTimestamp } from '@fepkg/common/utils/date';
import { Checkbox } from '@fepkg/components/Checkbox';
import { Dialog } from '@fepkg/components/Dialog';
import { Modal, ModalProps } from '@fepkg/components/Modal';
import { FiccBondBasic } from '@fepkg/services/types/common';
import { BondQuoteType, ExerciseType } from '@fepkg/services/types/enum';
import { isEqual } from 'lodash-es';
import { useProductParams } from '@/layouts/Home/hooks';
import { ExerciseGroup } from '../business/ExerciseGroup';
import { ExerciseProvider, useExercise } from '../business/ExerciseGroup/provider';
import Dates from './Dates';

type ModalType = Omit<ModalProps, 'onConfirm'> & {
  /** 报价类型 */
  quoteType?: BondQuoteType;
  bond?: FiccBondBasic;
  foobar?: number;
  /** 是否含权债 */
  hasOption?: boolean;
  /** 是否交易所 */
  flagExchange?: boolean;
  /** 行权、到期 */
  exercise?: ExerciseType;
  /** 是否手动选择 */
  exerciseManual?: boolean;
  /** 交易日交割日 */
  settlementDate?: {
    ofr?: {
      tradedDate: string;
      deliveryDate: string;
    };
    bid?: {
      tradedDate: string;
      deliveryDate: string;
    };
  };
  /** 允许错交割 */
  allowDiffBySide?: boolean;
  /** 点击确认回调 */
  onConfirm?: (res: {
    flagExchange?: boolean;
    exercise?: ExerciseType;
    exerciseManual?: boolean;
    tradedDate: { ofr: string; bid: string };
    deliveryDate: { ofr: string; bid: string };
  }) => void;
};

const Wrapper = (props: ModalType) => {
  const {
    bond,
    flagExchange,
    hasOption = false,
    quoteType,
    exerciseManual,
    exercise = ExerciseType.ExerciseTypeNone,
    settlementDate,
    onConfirm,
    onCancel,
    allowDiffBySide = true,
    ...rest
  } = props;

  const { exerciseEnum, isSelected } = useExercise();

  // 是否交易所
  const [isExchange, setIsExchange] = useState(flagExchange);

  // 交易日
  const [bidTradedDate, setBidTradedDate] = useState(settlementDate?.bid?.tradedDate ?? '');
  const [ofrTradedDate, setOfrTradedDate] = useState(settlementDate?.ofr?.tradedDate ?? '');
  // 交割日
  const [bidDeliveryDate, setBidDeliveryDate] = useState(settlementDate?.bid?.deliveryDate ?? '');
  const [ofrDeliveryDate, setOfrDeliveryDate] = useState(settlementDate?.ofr?.deliveryDate ?? '');

  /** 禁用交易所规则 */
  const exchangeDisabled = useMemo(() => {
    const res = isEqual(bidTradedDate, ofrTradedDate) && isEqual(bidDeliveryDate, ofrDeliveryDate);
    // 禁用交易所后，需要取消选中状态
    if (!res) setIsExchange(false);
    return !res;
  }, [bidDeliveryDate, bidTradedDate, ofrDeliveryDate, ofrTradedDate]);

  const [bidSelectIndex, setBidSelectIndex] = useState<number>();
  const [ofrSelectIndex, setOfrSelectIndex] = useState<number>();

  return (
    <Modal
      {...rest}
      centered
      keyboard
      width={968}
      title="结算方式"
      footerChildren={
        <div className="flex items-center gap-4">
          <Dialog.FooterItem>
            <Checkbox
              checked={isExchange}
              disabled={exchangeDisabled}
              onChange={setIsExchange}
            >
              交易所
            </Checkbox>
          </Dialog.FooterItem>

          {hasOption && (
            <ExerciseGroup
              className="bg-gray-600 rounded-lg h-7"
              itemClassName="!h-7"
              hideHint
            />
          )}
        </div>
      }
      onConfirm={() => {
        const curExerciseManual = isSelected && hasOption;

        onConfirm?.({
          flagExchange: isExchange,
          exercise: exerciseEnum,
          exerciseManual: curExerciseManual,
          tradedDate: { bid: bidTradedDate, ofr: ofrTradedDate },
          deliveryDate: { bid: bidDeliveryDate, ofr: ofrDeliveryDate }
        });
      }}
      onCancel={onCancel}
    >
      <Dialog.Body className="flex gap-3">
        <div className="flex-1 border-dashed border border-gray-500 rounded-lg py-2 px-3">
          <div className="w-16 h-6 bg-orange-600 flex justify-center items-center rounded-lg text-sm text-orange-100 mb-2">
            BID
          </div>
          <Dates
            checkedIndex={bidSelectIndex}
            setCheckedIndex={val => {
              setBidSelectIndex(val);
              if (!allowDiffBySide) {
                setOfrSelectIndex(val);
              }
            }}
            listedDate={bond?.listed_date}
            tradedDate={bidTradedDate}
            deliveryDate={bidDeliveryDate}
            onChange={e => {
              const trd = (normalizeTimestamp(e.tradedDate) ?? 0)?.toString();
              const del = (normalizeTimestamp(e.deliveryDate) ?? 0)?.toString();
              setBidTradedDate(trd);
              setBidDeliveryDate(del);

              if (!allowDiffBySide) {
                setOfrTradedDate(trd);
                setOfrDeliveryDate(del);
              }
            }}
          />
        </div>

        <div className="flex-1 border-dashed border border-gray-500 rounded-lg py-2 px-3">
          <div className="w-16 h-6 bg-secondary-600 flex justify-center items-center rounded-lg text-sm text-secondary-100 mb-2">
            OFR
          </div>
          <Dates
            checkedIndex={ofrSelectIndex}
            setCheckedIndex={val => {
              setOfrSelectIndex(val);
              if (!allowDiffBySide) {
                setBidSelectIndex(val);
              }
            }}
            listedDate={bond?.listed_date}
            tradedDate={ofrTradedDate}
            deliveryDate={ofrDeliveryDate}
            onChange={e => {
              const trd = (normalizeTimestamp(e.tradedDate) ?? 0)?.toString();
              const del = (normalizeTimestamp(e.deliveryDate) ?? 0)?.toString();

              setOfrTradedDate(trd);
              setOfrDeliveryDate(del);

              if (!allowDiffBySide) {
                setBidTradedDate(trd);
                setBidDeliveryDate(del);
              }
            }}
          />
        </div>
      </Dialog.Body>
    </Modal>
  );
};

export const IDCLiquidationModal = (props: ModalType) => {
  const { hasOption, quoteType, exercise, bond } = props;

  const { productType } = useProductParams();

  return (
    <ExerciseProvider
      {...{ hasBond: !!bond, productType, isHasOption: !!hasOption, quoteType, defaultValue: exercise }}
    >
      <Wrapper {...props} />
    </ExerciseProvider>
  );
};
