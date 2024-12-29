import { RadioGroup } from '@fepkg/components/Radio';
import { Side } from '@fepkg/services/types/enum';
import { useReceiptDealBridge } from '../../providers/BridgeProvider';
import { useReceiptDealDate } from '../../providers/DateProvider';

export const DiffSettlement = () => {
  const { sideMutation, bridgesMutation } = useReceiptDealDate();
  const { than1Bridge, than2Bridge } = useReceiptDealBridge();

  const [firstState, , resetFirstState] = bridgesMutation[0];
  const [secondState, , resetSecondState] = bridgesMutation[1];
  const [bidState] = sideMutation[Side.SideBid];
  const [ofrState] = sideMutation[Side.SideOfr];

  const diffSettlementType = (() => {
    if (!than1Bridge) return [];

    // 如果有三桥
    if (than2Bridge) {
      // 如果三桥间的日期信息不相等，错期点灭
      if (firstState.tradedDate !== secondState.tradedDate || firstState.deliveryDate !== secondState.deliveryDate) {
        return [];
      }
    }

    // 走到这说明 first tradedDate 和 second tradedDate 是相等的，直接拿 first 判断就行
    if (firstState.tradedDate === bidState.tradedDate && firstState.deliveryDate === bidState.deliveryDate) {
      return [Side.SideOfr];
    }

    if (firstState.tradedDate === ofrState.tradedDate && firstState.deliveryDate === ofrState.deliveryDate) {
      return [Side.SideBid];
    }

    return [];
  })();

  if (!than1Bridge) return null;
  // 如果全相等，那也隐藏组件
  if (
    than1Bridge &&
    !than2Bridge &&
    bidState.tradedDate === ofrState.tradedDate &&
    bidState.tradedDate === firstState.tradedDate &&
    bidState.deliveryDate === ofrState.deliveryDate &&
    bidState.deliveryDate === firstState.deliveryDate
  ) {
    return null;
  }
  if (
    than2Bridge &&
    bidState.tradedDate === ofrState.tradedDate &&
    bidState.tradedDate === firstState.tradedDate &&
    bidState.tradedDate === secondState.tradedDate &&
    bidState.deliveryDate === ofrState.deliveryDate &&
    bidState.deliveryDate === firstState.deliveryDate &&
    bidState.deliveryDate === secondState.deliveryDate
  ) {
    return null;
  }

  return (
    <RadioGroup
      className="bg-gray-600 rounded-lg"
      style={{ width: 164 }}
      options={[
        { label: 'Bid错期', value: Side.SideBid },
        { label: 'Ofr错期', value: Side.SideOfr }
      ]}
      value={diffSettlementType}
      // onMouseDown={() => setPopoverOpen(true)}
      onChange={val => {
        const [side] = val;
        let params = {};

        if (side === Side.SideBid) {
          const { tradedDate, deliveryDate } = ofrState;
          params = { defaultValue: { tradedDate, deliveryDate } };
        } else if (side === Side.SideOfr) {
          const { tradedDate, deliveryDate } = bidState;
          params = { defaultValue: { tradedDate, deliveryDate } };
        }

        resetFirstState(params);
        resetSecondState(params);
      }}
    />
  );
};
