import { useMemo, useRef } from 'react';
import cx from 'classnames';
import { InstSearch, useInstSearch } from '@fepkg/business/components/Search/InstSearch';
import { ListedMarketOptions, MktTypeOptions } from '@fepkg/business/constants/options';
import { isNCD } from '@fepkg/business/utils/product';
import { numberLimitedRegexp } from '@fepkg/common/utils';
import { formatDate } from '@fepkg/common/utils/date';
import { Button } from '@fepkg/components/Button';
import { Checkbox } from '@fepkg/components/Checkbox';
import { CommonDatePicker } from '@fepkg/components/DatePicker/CommonPicker';
import { Input, InputProps } from '@fepkg/components/Input';
import { RadioIndeterminateGroup } from '@fepkg/components/Radio';
import { Select } from '@fepkg/components/Select';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconPrecise, IconRefresh, IconSearch } from '@fepkg/icon-park-react';
import { BondSearchType, ListedMarket, MktType, SearchInstMatchField } from '@fepkg/services/types/enum';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { internalCodeReg } from '@/common/utils/internal-code';
import { BondSearch, useBondSearch } from '@/components/business/Search/BondSearch';
import { InstTraderSearch, useInstTraderSearch } from '@/components/business/Search/InstTraderSearch';
import { useProductParams } from '@/layouts/Home/hooks';
import { useVSConnect } from '../DealContent/VSConnectProvider';
import { initSearchFilter } from '../utils';
import { bondCategoryOptions } from './constant';
import { useFilter } from './providers/FilterStateProvider';
import { useHistoryStack } from './providers/HistoryStackProvider';

const PRICE_REG = numberLimitedRegexp(3, 4, { allowBlankInteger: true });

const searchInputProps: InputProps = {
  className: 'flex-shrink-0 !w-[124px]',
  suffixIcon: <IconSearch />
};
// 成交明细搜索框
export const SearchFilter = ({ resetFilter }: { resetFilter?: () => void }) => {
  const { bondSearchImpRef, updateBondSearchState } = useBondSearch();
  const { instSearchImpRef, updateInstSearchState } = useInstSearch();
  const { instTraderSearchImpRef, updateInstTraderSearchState } = useInstTraderSearch();
  const { filterData: data, disabled, updateFilterData, setDisabled } = useFilter();
  const { productType } = useProductParams();

  const selectStyle = cx(isNCD(productType) ? '!w-[175px]' : '!w-[148px]', 'bg-gray-800 h-7');

  const { onFilterSeqNum } = useVSConnect();
  const { stackState, saveParams } = useHistoryStack();

  // 避免前进/后退时触发search组件的onChange
  const stepping = useRef(false);

  const isFilterEmpty = useMemo(() => {
    // 是否有筛选应该从当前展示的内容中对比
    const activeStack = stackState.stack.find(i => i.key === stackState.activeKey);
    if (!activeStack) return false;

    const keys = Object.keys(activeStack);
    let flag = true;
    for (const i of keys) {
      // 除了key，如果有一个选项跟默认值不同，表示有筛选
      if (activeStack[i] !== initSearchFilter[i] && i !== 'key') {
        flag = false;
      }
    }
    return flag;
  }, [stackState.activeKey, stackState.stack]);

  function reset() {
    bondSearchImpRef.current?.clearInput?.();
    instSearchImpRef.current?.clearInput?.();
    instTraderSearchImpRef.current?.clearInput();
    updateFilterData(initSearchFilter);
    updateBondSearchState(draft => {
      draft.keyword = '';
      draft.selected = null;
    });
    updateInstSearchState(draft => {
      draft.keyword = '';
      draft.selected = null;
    });
    updateInstTraderSearchState(draft => {
      draft.keyword = '';
      draft.selected = null;
    });
    updateFilterData(draft => {
      draft.bond_category_total_list = [];
      draft.key = uuidv4();
    });
    if (isFilterEmpty) return;
    saveParams({ ...initSearchFilter, key: uuidv4() });
  }

  return (
    <div className="relative box-border grid grid-rows-2 items-center gap-3 h-20 px-3 py-2 bg-gray-700 select-none">
      <div className="flex items-center h-7 box-border gap-x-3">
        <Button
          className="h-7"
          type="gray"
          ghost
          icon={<IconRefresh />}
          onClick={() => {
            setDisabled?.(false);
            reset();
            resetFilter?.();
          }}
        >
          清空条件
        </Button>

        {/* 快速排序、显示历史、缺桥多选组 */}
        <div className="flex gap-x-3 h-7 items-center bg-gray-800 rounded-lg px-3">
          <div className="flex-center">
            <Checkbox
              checked={!!data.intelligence_sorting}
              onChange={val => {
                const res = { ...data, intelligence_sorting: val, key: uuidv4() };
                updateFilterData(draft => {
                  draft.intelligence_sorting = val;
                  draft.key = uuidv4();
                });
                saveParams(res);
              }}
            >
              <Tooltip content="按照券码、价格、ofr结算日、ofr方机构、bid方机构进行快速排序">
                <span>快速排序</span>
              </Tooltip>
            </Checkbox>
          </div>

          <Checkbox
            checked={!!data.only_display_today}
            onChange={val => {
              const res = { ...data, only_display_today: val, key: uuidv4() };
              updateFilterData(draft => {
                draft.only_display_today = val;
                draft.traded_date = undefined;
                draft.key = uuidv4();
              });
              saveParams(res);
            }}
          >
            <Tooltip content="勾选后，展示交易日为当日的成交">
              <span>展示当日</span>
            </Tooltip>
          </Checkbox>

          <Checkbox
            checked={!!data.include_history}
            onChange={val => {
              const res = { ...data, include_history: val, key: uuidv4() };
              updateFilterData(draft => {
                draft.include_history = val;
                draft.key = uuidv4();
              });
              saveParams(res);
            }}
          >
            <Tooltip content="勾选后，展示成交日在今日之前的成交">
              <span>显示历史</span>
            </Tooltip>
          </Checkbox>
          <Checkbox
            checked={!!data.is_lack_of_bridge}
            disabled={disabled}
            onChange={val => {
              const res = { ...data, is_lack_of_bridge: val, key: uuidv4() };
              updateFilterData(draft => {
                draft.is_lack_of_bridge = val;
                draft.key = uuidv4();
              });
              saveParams(res);
            }}
          >
            缺桥
          </Checkbox>
        </div>

        {/* 市场类型 */}
        {!isNCD(productType) && (
          <RadioIndeterminateGroup
            className="flex h-7 items-center bg-gray-800 rounded-lg"
            options={MktTypeOptions}
            disabled={disabled}
            value={data.mkt_type}
            onChange={val => {
              const result = { ...data, mkt_type: val as MktType[], key: uuidv4() };
              updateFilterData(draft => {
                draft.mkt_type = val as MktType[];
                draft.key = uuidv4();
              });
              saveParams(result);
            }}
          />
        )}

        {/* 交易场所 */}

        {!isNCD(productType) && (
          <RadioIndeterminateGroup
            className="flex h-7 items-center bg-gray-800 rounded-lg"
            options={ListedMarketOptions}
            disabled={disabled}
            value={data.listed_market ?? []}
            onChange={val => {
              const res = { ...data, listed_market: val as ListedMarket[], key: uuidv4() };
              updateFilterData(draft => {
                draft.listed_market = val as ListedMarket[];
                draft.key = uuidv4();
              });
              saveParams(res);
            }}
          />
        )}
      </div>

      <div className="flex items-center h-7 box-border gap-x-3">
        <Input
          {...searchInputProps}
          className={selectStyle}
          placeholder="内码"
          disabled={disabled}
          suffixIcon={<IconPrecise />}
          value={data.seq_number || null}
          onChange={val => {
            // 限制内码只能输入数字和大写字母
            if (!internalCodeReg.test(val)) return;
            updateFilterData(draft => {
              draft.seq_number = val;
              draft.key = uuidv4();
            });
          }}
          // 按下enter之后才开始定位
          onEnterPress={val => {
            onFilterSeqNum(val, true);
            const res = { ...data, seq_number: val, key: uuidv4() };
            const lastIdx = stackState.stack.length - 1;
            if (stackState.stack[lastIdx].seq_number !== val) saveParams(res);
          }}
        />

        <BondSearch
          placeholder="债券"
          className={selectStyle}
          label=""
          suffixIcon={<IconSearch />}
          disabled={disabled}
          searchParams={{ search_type: BondSearchType.SearchDealProcess }}
          onChange={opt => {
            updateBondSearchState(draft => {
              draft.selected = opt ?? null;
            });
            // 避免重复保存
            if (data?.bond?.bond_code === opt?.original.bond_code || stepping.current) return;
            saveParams({ ...data, bond: opt?.original, key: uuidv4() });
            updateFilterData(draft => {
              draft.bond = opt?.original;
              draft.key = uuidv4();
            });
          }}
        />

        <Input
          {...searchInputProps}
          placeholder="价格"
          className={selectStyle}
          disabled={disabled}
          value={data.price}
          onChange={val => {
            if (!PRICE_REG.test(val)) return;
            if (val != data?.price) {
              // 输入中，不用筛选价格
              updateFilterData(draft => {
                draft.price = val;
                draft.filterPrice = false;
                draft.key = uuidv4();
              });
            }
          }}
          onEnterPress={val => {
            // 输入完成，并按下了回车，开始筛选价格
            const res = { ...data, price: val, filterPrice: true, key: uuidv4() };
            const lastIdx = stackState.stack.length - 1;
            updateFilterData(draft => {
              draft.price = val;
              draft.filterPrice = true;
              draft.key = uuidv4();
            });
            if (stackState.stack[lastIdx].price !== val) {
              saveParams(res);
            }
          }}
        />

        <InstSearch
          label=""
          placeholder="机构"
          className={selectStyle}
          suffixIcon={<IconSearch />}
          disabled={disabled}
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
            if (data.inst?.inst_id === opt?.original?.inst_id || stepping.current) return;
            saveParams({ ...data, inst: opt?.original, key: uuidv4() });
            updateFilterData(draft => {
              draft.inst = opt?.original;
              draft.key = uuidv4();
            });
          }}
        />

        <InstTraderSearch
          label=""
          placeholder="机构交易员"
          className={selectStyle}
          padding={[2, 11]}
          suffixIcon={<IconSearch />}
          showOptions
          disabled={disabled}
          onChange={opt => {
            updateInstTraderSearchState(draft => {
              draft.selected = opt ?? null;
            });
            if (data.trader?.trader_id === opt?.original?.trader_id || stepping.current) return;
            saveParams({ ...data, trader: opt?.original, key: uuidv4() });
            updateFilterData(draft => {
              draft.trader = opt?.original;
              draft.key = uuidv4();
            });
          }}
        />

        {!isNCD(productType) && (
          <Select
            className={cx(selectStyle, 'shrink-0')}
            multiple
            tags={false}
            placeholder="债券类型"
            disabled={disabled}
            options={bondCategoryOptions}
            value={data.bond_category_total_list}
            onChange={val => {
              // 债券类型都保存在一个字段中，赋值的时候再拆出来
              const res = { ...data, bond_category_total_list: val, key: uuidv4() };
              updateFilterData(draft => {
                draft.bond_category_total_list = val;
                draft.key = uuidv4();
              });
              saveParams(res);
            }}
          />
        )}

        <CommonDatePicker
          value={data.traded_date ? moment(data.traded_date) : undefined}
          disabled={disabled}
          className={cx(selectStyle, '!px-3 bg-gray-700')}
          onChange={val => {
            const res = { ...data, traded_date: formatDate(val), key: uuidv4() };
            updateFilterData(draft => {
              draft.traded_date = formatDate(val);
              draft.only_display_today = false;
              draft.key = uuidv4();
            });
            saveParams(res);
          }}
          placeholder="请选择交易日"
        />
      </div>
    </div>
  );
};
