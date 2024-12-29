import { FC, useState } from 'react';
import cx from 'classnames';
import { getNextTradedDate } from '@fepkg/business/hooks/useDealDateMutation';
import { Input } from '@fepkg/components/Input';
import { message } from '@fepkg/components/Message';
import { Modal } from '@fepkg/components/Modal';
import { RadioButton } from '@fepkg/components/Radio';
import { AlgoBondQuoteType, QuickChatAlgoOperationType, YieldType } from '@fepkg/services/types/algo-enum';
import type { BaseDataMulCalculate } from '@fepkg/services/types/base-data/mul-calculate';
import { LiquidationSpeed } from '@fepkg/services/types/common';
import { ExerciseType, ProductType } from '@fepkg/services/types/enum';
import { mulCalculate } from '@/common/services/api/base-data/mul-calculate';
import {
  getDefaultTagsByProduct,
  justifyTradedDateLaterThanDeListing,
  liqSpeedListAddMoments
} from '@/common/utils/liq-speed';
import { QuoteDates, Source } from '@/components/Quote/Dates';
import { ExerciseGroup } from '@/components/business/ExerciseGroup';
import { OperationCardProp } from '../types';

type IProp = {
  show: boolean;
  value: LiquidationSpeed[];
  onCancel: VoidFunction;
  onConfirm: (card: OperationCardProp) => void;
  productType: ProductType;
  delistedDate?: string;
  card: OperationCardProp;
};

export const OperationCardLiquidation: FC<IProp> = ({
  card,
  show,
  value,
  onCancel,
  onConfirm,
  productType,
  delistedDate
}) => {
  const [liqSpeedList, setLiqSpeedList] = useState(value);
  const [settlementDate, setSettlementDate] = useState<string>();

  const [innerCard, setInnerCard] = useState(card);

  const handleExerciseChange = (val: [boolean | null, ExerciseType, boolean, boolean]) => {
    const [, yield_type, , exercise_manual] = val;
    setInnerCard({
      ...innerCard,
      yield_type: yield_type as unknown as YieldType,
      exercise_manual
    });
  };

  const isRef = card.operation_type === QuickChatAlgoOperationType.QuickChatREF;

  return (
    <Modal
      footerProps={isRef ? { confirmBtnProps: { className: 'hidden' } } : undefined}
      draggable
      visible={show}
      onCancel={onCancel}
      title="交割与备注"
      width={400}
      onConfirm={async () => {
        const params: BaseDataMulCalculate.CalculateItem = {
          bond_id: card.code_market,
          settlement_date: settlementDate ?? '',
          clean_price: card.price_type === AlgoBondQuoteType.CleanPrice ? card.price : undefined,
          yield:
            card.price_type === AlgoBondQuoteType.Yield && card.yield_type === YieldType.Expiration
              ? card.price
              : undefined,
          yield_to_execution:
            card.price_type === AlgoBondQuoteType.Yield && card.yield_type === YieldType.Exercise
              ? card.price
              : undefined,
          return_point: card.return_point
        };

        await mulCalculate({ item_list: [params], simple_validation: true });

        const { liqSpeeds: noDefaultList, hasDefault } = getDefaultTagsByProduct(liqSpeedList, productType);

        const lipSpeedMoments = await liqSpeedListAddMoments(noDefaultList);

        const res = justifyTradedDateLaterThanDeListing(hasDefault, lipSpeedMoments, productType, delistedDate);

        if (res) {
          message.warning('交易日不可晚于或等于下市日！');
          return;
        }

        onConfirm({
          ...innerCard,
          liquidation_speed_list: liqSpeedList
        });
      }}
    >
      <QuoteDates
        productType={productType}
        onLiqSpeedListChange={setLiqSpeedList}
        onDeliveryDateChange={async val => {
          const deliveryDate = val.delivery_date || getNextTradedDate();
          setSettlementDate(deliveryDate);
        }}
        defaultChecked
        source={Source.IQuote}
        defaultLiqSpeedList={value}
        delistedDate={delistedDate}
        offsetCls="!w-24 !ml-auto"
        disableButtons={isRef}
        disableDatePicker={isRef}
      />

      {!isRef && (
        <div className="px-3">
          {[QuickChatAlgoOperationType.QuickChatADD, QuickChatAlgoOperationType.QuickChatUPD].includes(
            card.operation_type
          ) && (
            <Input
              label="备注"
              className="h-6 bg-gray-800 mb-2"
              placeholder="请输入"
              value={innerCard.comment}
              composition
              onEnterPress={(_, evt, composing) => {
                if (composing) evt.stopPropagation();
              }}
              onChange={val => {
                setInnerCard({ ...innerCard, comment: val });
              }}
            />
          )}

          {!isRef && (
            <div className="flex items-center gap-1 pb-2">
              {productType !== ProductType.NCD && (
                <ExerciseGroup
                  className="h-6"
                  itemClassName="!w-12 whitespace-nowrap"
                  onChange={handleExerciseChange}
                  hideHint
                />
              )}
              {[QuickChatAlgoOperationType.QuickChatADD, QuickChatAlgoOperationType.QuickChatUPD].includes(
                card.operation_type
              ) && (
                <div
                  className={cx(productType !== ProductType.NCD && 'ml-auto', 'flex gap-x-1 bg-gray-600 rounded-lg')}
                >
                  <RadioButton
                    type="checkbox"
                    className="!h-6"
                    checked={innerCard.flag_stock_exchange ?? false}
                    onChange={val => {
                      setInnerCard({
                        ...innerCard,
                        flag_stock_exchange: val
                      });
                    }}
                  >
                    交易所
                  </RadioButton>
                  <RadioButton
                    type="checkbox"
                    className="!h-6"
                    checked={innerCard.flag_bilateral ?? false}
                    onChange={val => {
                      setInnerCard({
                        ...innerCard,
                        flag_bilateral: val
                      });
                    }}
                  >
                    点双边
                  </RadioButton>
                  <RadioButton
                    type="checkbox"
                    className="!h-6"
                    checked={innerCard.flag_request ?? false}
                    onChange={val => {
                      setInnerCard({
                        ...innerCard,
                        flag_request: val
                      });
                    }}
                  >
                    请求报价
                  </RadioButton>
                  <RadioButton
                    type="checkbox"
                    className="!h-6"
                    checked={innerCard.flag_indivisible ?? false}
                    onChange={val => {
                      setInnerCard({
                        ...innerCard,
                        flag_indivisible: val
                      });
                    }}
                  >
                    整量
                  </RadioButton>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
