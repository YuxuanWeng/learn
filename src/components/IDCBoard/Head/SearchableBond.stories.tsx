import { fakeFiccBondBasic } from '@fepkg/mock/utils/fake';
import type { BaseDataBondGetByKeyMarket } from '@fepkg/services/types/base-data/bond-get-by-key-market';
import type { BaseDataBondSearch } from '@fepkg/services/types/base-data/bond-search';
import { ProductType } from '@fepkg/services/types/enum';
import { QueryClientProvider } from '@tanstack/react-query';
import { noop } from 'lodash-es';
import { http } from 'msw';
import { queryClient } from '@/common/utils/query-client';
import Head from '.';
import { HeadProvider } from './HeadProvider';
import { SearchableBondProvider } from './SearchableBondProvider';

export default {
  title: 'IDC业务组件/报价版/我来组成头部',
  component: Head,
  parameters: {},
  decorators: [],
  excludeStories: ['mockFn1', 'mockFn2']
};

const enableMock = import.meta.env.MODE === 'test' || !/docs/.test(global.location.href);

export const Sch1 = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-[200px]">
        <HeadProvider>
          <SearchableBondProvider>
            <Head />
          </SearchableBondProvider>
        </HeadProvider>
      </div>
    </QueryClientProvider>
  );
};
Sch1.storyName = '过期';

export const FakeInvalidSuffix = '#';

export const mockFn1 = !enableMock
  ? noop
  : req => {
      const { key_market_list } = (req?.body || {}) as BaseDataBondGetByKeyMarket.Request;
      // console.log('req 1:', key_market_list, enableMock);

      let bond_info_list = [
        {
          ...fakeFiccBondBasic(),
          code_market: 'cm123',
          key_market: 'km123',
          time_to_maturity: '1Y',
          maturity_date: '2024-01-01',
          product_type: ProductType.BNC
        }
      ];

      if (key_market_list?.includes('cm777')) {
        console.log(key_market_list, '过期');
        bond_info_list = [
          {
            ...fakeFiccBondBasic(),
            code_market: 'cm777',
            key_market: 'km777',
            time_to_maturity: '',
            maturity_date: '2022-12-30',
            product_type: ProductType.BNC
          }
        ];
      } else if (
        !key_market_list?.length ||
        !key_market_list.filter(Boolean).length ||
        key_market_list?.some(id => id.includes(FakeInvalidSuffix))
      ) {
        bond_info_list = [];
      }

      const response: BaseDataBondGetByKeyMarket.Response = {
        base_response: { code: 0, msg: 'success' },
        bond_basic_list: bond_info_list
      };
      return new Response(JSON.stringify(response), { headers: { 'Content-Type': 'application/json' } });
    };
global.mockFn1 = mockFn1;

export const mockFn2 = !enableMock
  ? noop
  : req => {
      const { keyword } = (req?.body || {}) as BaseDataBondSearch.Request;

      let bond_info_list = [
        {
          ...fakeFiccBondBasic(),
          code_market: 'cm456',
          key_market: 'km456',
          time_to_maturity: '4Y',
          maturity_date: '2027-01-01',
          product_type: ProductType.BNC
        },
        {
          ...fakeFiccBondBasic(),
          code_market: 'cm789',
          key_market: 'km789',
          time_to_maturity: '7Y',
          maturity_date: '2030-01-01',
          product_type: ProductType.BNC
        }
      ];

      if (!keyword || keyword?.includes(FakeInvalidSuffix)) {
        bond_info_list = [];
      }

      const response: BaseDataBondSearch.Response = {
        base_response: { code: 0, msg: 'success' },
        total: 2,
        bond_basic_list: bond_info_list
      };
      return new Response(JSON.stringify(response), { headers: { 'Content-Type': 'application/json' } });
    };
global.mockFn2 = mockFn2;

Sch1.parameters = {
  docs: {
    description: {
      component:
        '<b style="color: red">包含 api mock 的完整用例请切换到 Canvas 页签、勾选上 `show addons` 并刷新执行！</b>'
    }
  },
  date: new Date('2023-01-01'),
  msw: [
    http.post('/dev/api/v1/bdm/bds/bds_api/base_data/bond/get_by_key_market', global.mockFn1),
    http.post('/dev/api/v1/bdm/bds/bds_api/base_data/bond/search', global.mockFn2)
  ]
};
