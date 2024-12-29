import { InstSearch, InstSearchProvider, useInstSearch } from '@fepkg/business/components/Search/InstSearch';
import { Button } from '@fepkg/components/Button';
import { Caption } from '@fepkg/components/Caption';
import { IconChange, IconPrecise } from '@fepkg/icon-park-react';
import { ProductType, SearchInstMatchField } from '@fepkg/services/types/bdm-enum';
import { InstitutionTiny } from '@fepkg/services/types/common';
import { useMemoizedFn } from 'ahooks';
import Options from './Options';
import { useAgency } from './provider';

const Header = () => {
  const { setChangeAgentModalVisible } = useAgency();
  return (
    <div className="h-10 flex items-center justify-between text-gray-000 text-sm">
      <Caption>需代付机构</Caption>
      <Button
        icon={<IconChange />}
        plain
        className="w-6 h-6 px-0"
        tooltip={{ content: '变更需代付机构' }}
        onClick={() => {
          setChangeAgentModalVisible(true);
        }}
      />
    </div>
  );
};

const Inner = () => {
  const { updateInstSearchState } = useInstSearch();
  const { instMapRef, handleSelectInstId, agencyOptions } = useAgency();
  const instIds = agencyOptions?.map(v => v.inst_id) ?? [];

  const instFilter = useMemoizedFn(
    (data?: InstitutionTiny[]) => data?.filter(item => instIds.includes(item.inst_id)) ?? []
  );

  return (
    <div className="min-w-[240px] w-[240px] px-3 border-0 border-solid !border-r border-r-gray-600 flex flex-col">
      <Header />
      <div className="component-dashed-x" />
      <div className="mt-2 flex flex-col">
        <InstSearch
          label=""
          className="bg-gray-800"
          placeholder="搜索需代付机构"
          suffixIcon={<IconPrecise />}
          onFilter={instFilter}
          searchParams={{
            count: 20,
            with_biz_short_name: true,
            match_field: [
              SearchInstMatchField.PinYin,
              SearchInstMatchField.PinYinFull,
              SearchInstMatchField.ShortNameZh
            ]
          }}
          onlyRemoteQuery
          // 这里的搜索框仅作为定位所用，不需要展示已选项的label
          inputValueRender={() => ''}
          onChange={opt => {
            if (opt?.original.inst_id) {
              const currentTrader = instMapRef.current[opt.original.inst_id];
              if (!currentTrader) return;
              currentTrader.scrollIntoView({ block: 'nearest' });
              handleSelectInstId(opt.original.inst_id);
            }

            updateInstSearchState(draft => {
              draft.selected = opt ?? null;
            });
          }}
        />
        <Options />
      </div>
    </div>
  );
};

export const InstList = () => {
  return (
    <InstSearchProvider initialState={{ productType: ProductType.BNC }}>
      <Inner />
    </InstSearchProvider>
  );
};
