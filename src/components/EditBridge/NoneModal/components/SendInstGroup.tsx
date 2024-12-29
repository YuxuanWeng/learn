import { useEffect } from 'react';
import cx from 'classnames';
import { InstSearch, InstSearchProvider, useInstSearch } from '@fepkg/business/components/Search/InstSearch';
import { Button } from '@fepkg/components/Button';
import { Input } from '@fepkg/components/Input';
import { IconAdd, IconMinus } from '@fepkg/icon-park-react';
import { useProductParams } from '@/layouts/Home/hooks';
import { VOL_REG } from '../../constant';
import { MAX_SEND_INST_GROUP, useNoneBridge } from '../provider';

export const Inner = ({ index, count }: { index: number; count: number }) => {
  const { formState, error, setError, addSendInst, deleteSendInst, updateSendInst } = useNoneBridge();
  const { instSearchState } = useInstSearch();

  // 将选中的机构同步到上层数据结构
  useEffect(() => {
    setError(draft => {
      draft[index][0] = false;
    });
    updateSendInst({ inst: instSearchState.selected?.original }, index);
  }, [index, instSearchState.selected?.original, setError, updateSendInst]);

  const showAddBtn = index === count - 1 && index < MAX_SEND_INST_GROUP - 1;
  const showMinusBtn = count > 1;

  const { sendOrderInst } = formState;
  const currentOrder = sendOrderInst?.[index];

  return (
    <div className="flex gap-2">
      <InstSearch
        label=""
        error={error[index][0]}
        placeholder="发单机构"
        className="bg-gray-700 h-7 text-gray-000 w-[270px]"
      />
      <Input
        error={error[index][1]}
        className="w-[70px] h-7"
        placeholder="kw"
        clearIcon={null}
        value={currentOrder?.volume ? `${currentOrder.volume}` : ''}
        onChange={val => {
          if (!VOL_REG.test(val)) return;
          setError(draft => {
            draft[index][1] = false;
          });
          updateSendInst({ volume: val }, index);
        }}
      />

      {showMinusBtn && (
        <Button.Icon
          icon={<IconMinus />}
          onClick={() => deleteSendInst(index)}
          className="w-7 h-7 !text-gray-100"
        />
      )}

      {showAddBtn && (
        <Button.Icon
          icon={<IconAdd />}
          className="w-7 h-7 !text-gray-100"
          onClick={addSendInst}
        />
      )}
    </div>
  );
};

export const SendInstGroup = () => {
  const { formState, sendInstContainerRef } = useNoneBridge();
  const list = formState.sendOrderInst ?? [{}];

  const { productType } = useProductParams();

  const count = list.length;
  return (
    <div
      ref={sendInstContainerRef}
      key={JSON.stringify(count)}
      className={cx('overflow-y-overlay max-h-[64px] flex flex-col gap-2')}
    >
      {list.map((v, i) => {
        return (
          <InstSearchProvider
            key={i}
            initialState={{ productType, defaultValue: v.inst }}
          >
            <Inner
              index={i}
              count={count}
            />
          </InstSearchProvider>
        );
      })}
    </div>
  );
};
