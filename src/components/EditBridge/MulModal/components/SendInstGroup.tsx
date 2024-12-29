import { useEffect } from 'react';
import cx from 'classnames';
import { InstSearch, InstSearchProvider, useInstSearch } from '@fepkg/business/components/Search/InstSearch';
import { Button } from '@fepkg/components/Button';
import { Input } from '@fepkg/components/Input';
import { IconAdd, IconMinus } from '@fepkg/icon-park-react';
import { Side } from '@fepkg/services/types/enum';
import { useProductParams } from '@/layouts/Home/hooks';
import { VOL_REG } from '../../constant';
import { MAX_SEND_INST_GROUP, useMulBridge } from '../provider';

type SendInstGroupProps = { side: Side };

export const Inner = ({ side, index, count }: SendInstGroupProps & { index: number; count: number }) => {
  const { realTradeValue, error, setError, addSendInst, deleteSendInst, updateSendInst } = useMulBridge();
  const { instSearchState } = useInstSearch();

  // 将选中的机构同步到上层数据结构
  useEffect(() => {
    setError(draft => {
      draft[side][index][0] = false;
    });
    updateSendInst(side, { inst: instSearchState.selected?.original }, index);
  }, [index, instSearchState.selected?.original, setError, side, updateSendInst]);

  const showAddBtn = index === count - 1 && index < MAX_SEND_INST_GROUP - 1;
  const showMinusBtn = count > 1;

  const volume =
    side === Side.SideBid
      ? realTradeValue.bidSendOrderInstList?.[index].volume
      : realTradeValue.ofrSendOrderInstList?.[index].volume;

  return (
    <div className="flex gap-2">
      <InstSearch
        label=""
        error={error[side][index][0]}
        placeholder="发单机构"
        className="w-[178px] bg-gray-700 h-7 text-gray-000"
      />

      <Input
        error={error[side][index][1]}
        className="w-[70px] h-7"
        placeholder="kw"
        clearIcon={null}
        value={volume?.toString() ?? ''}
        onChange={val => {
          if (!VOL_REG.test(val)) return;
          setError(draft => {
            draft[side][index][1] = false;
          });
          updateSendInst(side, { volume: val }, index);
        }}
      />

      {showMinusBtn && (
        <Button.Icon
          icon={<IconMinus />}
          onClick={() => {
            deleteSendInst(side, index);
          }}
          className="w-7 h-7 !text-gray-100"
        />
      )}

      {showAddBtn && (
        <Button.Icon
          icon={<IconAdd />}
          className="w-7 h-7 !text-gray-100"
          onClick={() => {
            addSendInst(side);
          }}
        />
      )}
    </div>
  );
};

export const SendInstGroup = (props: SendInstGroupProps) => {
  const { bidSendRealInstContainerRef, ofrSendRealInstContainerRef, realTradeValue } = useMulBridge();
  const list =
    (props.side === Side.SideBid ? realTradeValue.bidSendOrderInstList : realTradeValue.ofrSendOrderInstList) ?? [];
  const ref = props.side === Side.SideBid ? bidSendRealInstContainerRef : ofrSendRealInstContainerRef;
  const { productType } = useProductParams();

  const count = list.length;
  return (
    <div
      ref={ref}
      key={JSON.stringify(count)}
      className={cx('overflow-y-overlay flex flex-col gap-2', 'max-h-[72px]')}
    >
      {list.map((v, i) => {
        return (
          <InstSearchProvider
            key={i}
            initialState={{ productType, defaultValue: v.inst }}
          >
            <Inner
              side={props.side}
              index={i}
              count={count}
            />
          </InstSearchProvider>
        );
      })}
    </div>
  );
};
