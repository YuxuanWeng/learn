import { useState } from 'react';
import cx from 'classnames';
import { Col, Row } from 'antd';
import { Button } from '@fepkg/components/Button';
import { Checkbox } from '@fepkg/components/Checkbox';
import { Input } from '@fepkg/components/Input';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconRefresh, IconSearch } from '@fepkg/icon-park-react';
import { internalCodeReg } from '@/common/utils/internal-code';
import { DateFilter } from '@/components/IDCBridge/Filter/DateFilter';
import { BondSearch, BondSearchProvider, useBondSearch } from '@/components/business/Search/BondSearch';
import { useProductParams } from '@/layouts/Home/hooks';
import { useBridgeContext } from '@/pages/Deal/Bridge/providers/BridgeProvider';
import { ArrowAreaEnum, BridgeReceiptDealListFilter, DateType } from '@/pages/Deal/Bridge/types';
import { InputNumber } from '../InputNumber';

const basicCls = '!bg-gray-800 w-[238px] focus-within:!bg-primary-700 !h-7';

type SearchFilterProps = {
  className?: string;
  filter: BridgeReceiptDealListFilter;
  onSearch: (params: BridgeReceiptDealListFilter) => void;
  onFilterChange?: (newVal: BridgeReceiptDealListFilter) => void;
};

const Inner = ({ filter, className, onFilterChange, onSearch }: SearchFilterProps) => {
  const { activeArea, setActiveArea } = useBridgeContext();

  const [internalCode, setInternalCode] = useState<string | undefined>();
  const [price, setPrice] = useState<string | undefined>();
  const [bondKeyMarket, setBondKeyMarket] = useState<string | undefined>();
  const { updateBondSearchState } = useBondSearch();

  return (
    <div
      className={cx('flex justify-between gap-2 items-center pb-3', className)}
      onClick={() => {
        if (activeArea !== ArrowAreaEnum.Other) {
          setActiveArea(ArrowAreaEnum.Other);
        }
      }}
    >
      <div className="flex max-w-[calc(100%_-_132px)] ">
        <Button
          ghost
          type="gray"
          className="mr-3 !h-7"
          icon={<IconRefresh />}
          onClick={() => {
            onFilterChange?.({
              dateParams: { type: DateType.RecordDay, value: '' }
            });

            setInternalCode('');
            setPrice('');
            setBondKeyMarket(undefined);
            updateBondSearchState(draft => {
              draft.selected = null;
              draft.keyword = '';
            });
          }}
        >
          清空条件
        </Button>
        <Row
          gutter={8}
          wrap={false}
        >
          <Col>
            <Input
              placeholder="内码"
              value={internalCode}
              onChange={v => {
                if (!internalCodeReg.test(v)) return;
                setInternalCode(v);
                onFilterChange?.({ ...filter, internalCode: v });
              }}
              className={basicCls}
              suffixIcon={<IconSearch />}
              onEnterPress={() => {
                onFilterChange?.({ ...filter, internalCode });
                onSearch?.({ ...filter, internalCode });
              }}
            />
          </Col>
          <Col>
            <BondSearch
              label=""
              className={basicCls}
              placeholder="债券"
              suffixIcon={<IconSearch />}
              onChange={opt => {
                updateBondSearchState(draft => {
                  draft.selected = opt ?? null;
                });

                setBondKeyMarket(opt?.original.key_market);

                if (opt == null) {
                  onFilterChange?.({ ...filter, bondKeyMarket: undefined });
                } else if (bondKeyMarket == null) {
                  onFilterChange?.({ ...filter, bondKeyMarket: opt?.original.key_market });
                  onSearch?.({ ...filter, bondKeyMarket: opt?.original.key_market });
                }
              }}
              onEnterPress={() => {
                if (bondKeyMarket == null) return;
                onFilterChange?.({ ...filter, bondKeyMarket });
                onSearch?.({ ...filter, bondKeyMarket });
              }}
            />
          </Col>
          <Col>
            <InputNumber
              placeholder="价格"
              max={9999.9999}
              min={0}
              integerNum={4}
              pointNum={4}
              className={basicCls}
              value={price}
              onChange={v => {
                setPrice(v);
                onFilterChange?.({ ...filter, price: v });
              }}
              suffixIcon={<IconSearch />}
              onEnterPress={() => {
                onFilterChange?.({ ...filter, price });
                onSearch?.({ ...filter, price });
              }}
            />
          </Col>
          <Col>
            <DateFilter
              dateParams={filter.dateParams}
              onChange={val => {
                onFilterChange?.({
                  ...filter,
                  dateParams: val
                });
              }}
            />
          </Col>
          <Col>
            <div className="w-[178px] h-7 rounded-lg flex-center bg-gray-800 gap-x-3">
              <Tooltip
                content="以券码、价格、ofr结算日、ofr方机构、bid方机构进行快速排序"
                trigger="hover"
                placement="bottom"
              >
                <div>
                  <Checkbox
                    checked={filter.intelligenceSorting ?? false}
                    onChange={val => {
                      onFilterChange?.({
                        ...filter,
                        intelligenceSorting: val
                      });
                    }}
                  >
                    快速排序
                  </Checkbox>
                </div>
              </Tooltip>
              <Checkbox
                checked={filter.myBridge ?? false}
                onChange={val => {
                  onFilterChange?.({
                    ...filter,
                    myBridge: val
                  });
                }}
              >
                我的桥
              </Checkbox>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export const SearchFilter = (props: SearchFilterProps) => {
  const { productType } = useProductParams();
  return (
    <BondSearchProvider initialState={{ productType }}>
      <Inner {...props} />
    </BondSearchProvider>
  );
};
