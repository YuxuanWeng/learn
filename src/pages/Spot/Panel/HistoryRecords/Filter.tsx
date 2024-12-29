import { InstSearch, useInstSearch } from '@fepkg/business/components/Search/InstSearch';
import { HistDealStatusOptions } from '@fepkg/business/constants/options';
import { formatDate } from '@fepkg/common/utils/date';
import { Checkbox } from '@fepkg/components/Checkbox';
import { RangePicker } from '@fepkg/components/DatePicker/RangePicker';
import { Select } from '@fepkg/components/Select';
import { IconSearch } from '@fepkg/icon-park-react';
import { BondSearchType, SearchInstMatchField } from '@fepkg/services/types/enum';
import { BondSearch, useBondSearch } from '@/components/business/Search/BondSearch';
import { InstTraderSearch } from '@/components/business/Search/InstTraderSearch';
import { useCPBSearchConnector } from '@/components/business/Search/providers/CPBSearchConnectorProvider';
import { useHistoryRecords } from './provider';
import useDateRange from './useDateRange';

const cls = 'w-[200px] bg-gray-800 h-7';

export default function Filter() {
  const { dateRange, onDateRangeChange, prev14Date, disabledDate } = useDateRange();
  const { onFilterChange, filterData, updateFilterData } = useHistoryRecords();

  const { updateBondSearchState } = useBondSearch();
  const { updateInstSearchState } = useInstSearch();
  const { handleInstTraderChange } = useCPBSearchConnector();
  return (
    <div className="flex justify-between mb-3">
      <div className="flex gap-x-3">
        <BondSearch
          placeholder="债券"
          label=""
          className={cls}
          searchParams={{ search_type: BondSearchType.SearchDealProcess }}
          onChange={opt => {
            updateBondSearchState(draft => {
              draft.selected = opt ?? null;
            });
            const key_market = opt?.original.key_market;
            updateFilterData(draft => {
              draft.key_market = key_market;
            });
            onFilterChange({ ...filterData, key_market });
          }}
          suffixIcon={<IconSearch />}
        />
        <InstSearch
          className={cls}
          label=""
          placeholder="机构"
          searchParams={{
            count: 10,
            with_biz_short_name: true,
            match_field: [
              SearchInstMatchField.PinYin,
              SearchInstMatchField.PinYinFull,
              SearchInstMatchField.ShortNameZh
            ]
          }}
          onlyRemoteQuery
          onChange={opt => {
            updateInstSearchState(draft => {
              draft.selected = opt ?? null;
            });
            const inst_id = opt?.original.inst_id;
            updateFilterData(draft => {
              draft.inst_id = inst_id;
            });
            onFilterChange({ ...filterData, inst_id });
          }}
          suffixIcon={<IconSearch />}
        />

        <InstTraderSearch
          label=""
          placeholder="机构(交易员)"
          className={cls}
          // optionRender={InstTraderOptionRender}
          showOptions
          preferenceHighlight
          onChange={opt => {
            handleInstTraderChange(opt, (_, trader) => {
              const trader_id = trader?.trader_id ?? '';
              updateFilterData(draft => {
                draft.trader_id = trader_id;
              });
              onFilterChange({ ...filterData, trader_id });
            });
          }}
          suffixIcon={<IconSearch />}
        />
        <Select
          label="状态"
          labelWidth={72}
          className="w-[240px] bg-gray-800 h-7"
          multiple
          tags={false}
          placeholder="不限"
          options={HistDealStatusOptions}
          value={filterData.hist_deal_status_list}
          onChange={val => {
            const hist_deal_status_list = val;
            updateFilterData(draft => {
              draft.hist_deal_status_list = hist_deal_status_list;
            });
            onFilterChange({ ...filterData, hist_deal_status_list });
          }}
        />
      </div>
      <div className="flex gap-x-3">
        <RangePicker
          allowEmpty={[false, true]}
          disabledDate={disabledDate}
          value={dateRange}
          onChange={onDateRangeChange}
          className="w-[278px] bg-gray-800 h-7"
          placeholder={[formatDate(prev14Date), '结束日期']}
        />

        <div className="px-3 bg-gray-800 rounded-lg w-[104px] flex items-center h-7">
          <Checkbox
            onChange={val => {
              const only_mine = val ? true : undefined;
              updateFilterData(draft => {
                draft.only_mine = only_mine;
              });
              onFilterChange({ ...filterData, only_mine });
            }}
          >
            我的交易
          </Checkbox>
        </div>
      </div>
    </div>
  );
}
