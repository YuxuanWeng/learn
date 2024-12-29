import { useMemo } from 'react';
import cx from 'classnames';
import { BaseOption } from '@fepkg/components/BaseOptionsRender/BaseOption';
import { Caption } from '@fepkg/components/Caption';
import { SearchOption } from '@fepkg/components/Search';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconPrecise } from '@fepkg/icon-park-react';
import { User } from '@fepkg/services/types/common';
import { useMemoizedFn } from 'ahooks';
import { BrokerSearch, BrokerSearchProvider } from '@/components/business/Search/BrokerSearch';
import { useProductParams } from '@/layouts/Home/hooks';
import { DealBrokersProvider, InitialStateData, useDealBrokers } from './provider';

type DealBrokersProps = {
  /** 容器样式 */
  containerCls?: string;
  /** 选中经纪人后的回调函数 */
  onChange?: (userId?: string) => void;
  /** 选中的经纪人Id */
  selectedId?: string;
};

const Inner = (props: DealBrokersProps) => {
  const { containerCls, selectedId, onChange } = props;
  const { granterUsers, brokerMapRef } = useDealBrokers();

  const granterUsersIds = useMemo(() => new Set(granterUsers?.map(v => v.user_id) ?? []), [granterUsers]);
  const optionFilter = useMemoizedFn((opt: SearchOption<User>) => granterUsersIds.has(opt?.original?.user_id));

  const mergeSelectedUserId = useMemo(() => {
    if (selectedId && granterUsersIds.has(selectedId)) return selectedId;
    return granterUsers?.[0]?.user_id;
  }, [granterUsers, granterUsersIds, selectedId]);

  const handleOnChange = (val?: SearchOption<User> | null) => {
    if (!val?.original.user_id) return;

    onChange?.(val.original.user_id);

    const currentTrader = brokerMapRef.current[val.original.user_id];
    if (currentTrader) currentTrader.scrollIntoView({ block: 'nearest' });
  };

  return (
    <div className={cx('p-2 flex flex-col gap-2 w-[108px] bg-gray-800', containerCls)}>
      <Caption>
        <span className="select-none text-sm font-bold">经纪人</span>
      </Caption>
      <div className="component-dashed-x-600" />
      <BrokerSearch
        label=""
        placeholder="经纪人"
        className="bg-gray-700 h-6"
        onChange={handleOnChange}
        suffixIcon={<IconPrecise />}
        optionFilter={optionFilter}
      />
      <div className="w-full py-1 h-full flex flex-col gap-1 overflow-y-overlay">
        {granterUsers?.map(v => {
          return (
            <BaseOption
              ref={node => {
                if (node == null || brokerMapRef.current == null) return;
                brokerMapRef.current[v.brokerId] = node;
              }}
              hoverActive
              key={v.brokerId}
              className="overflow-x-hidden hover:bg-gray-600 h-7 !px-2"
              onClick={() => onChange?.(v.user_id)}
              selected={v.user_id === mergeSelectedUserId}
            >
              <div className="flex justify-between w-full items-center">
                <Tooltip
                  truncate
                  content={v.name_cn}
                >
                  <span className="block truncate max-w-[48px]">{v.name_cn}</span>
                </Tooltip>
                <div
                  className={cx(
                    'rounded px-1 bg-gray-600 flex-center h-4 font-bold text-xs',
                    v.needBridge ? 'text-danger-200' : 'text-gray-200'
                  )}
                >
                  {v.count}
                </div>
              </div>
            </BaseOption>
          );
        })}
      </div>
    </div>
  );
};

export const DealBrokers = (props: DealBrokersProps & { /** 明细列表数据 */ data?: InitialStateData[] }) => {
  const { productType } = useProductParams();
  return (
    <div key={JSON.stringify(props.data)}>
      <DealBrokersProvider initialState={{ data: props.data }}>
        <BrokerSearchProvider initialState={{ productType }}>
          <Inner {...props} />
        </BrokerSearchProvider>
      </DealBrokersProvider>
    </div>
  );
};

// export const MemoDealBrokers = memo(DealBrokers, (prev, next) => prev.selectedId === next.selectedId);
