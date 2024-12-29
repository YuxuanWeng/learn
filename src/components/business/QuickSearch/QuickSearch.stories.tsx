import { fakeFiccBondBasic } from '@fepkg/mock/utils/fake';
import { APIs } from '@fepkg/services/apis';
import type { BaseDataBondSearch } from '@fepkg/services/types/base-data/bond-search';
import { ProductType } from '@fepkg/services/types/enum';
import { QueryClientProvider } from '@tanstack/react-query';
import { random, range } from 'lodash-es';
import { http } from 'msw';
import { queryClient } from '@/common/utils/query-client';
import { QuickSearch } from '.';

export default {
  title: 'IDC业务组件/快捷搜索',
  component: QuickSearch
};

export const Q = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div>在当前页面按下任意带有输入字符的按键唤起快捷搜索弹窗</div>
      <div>避免按下 S 和 F，这两个快捷键已与storybook绑定，作用是全屏展示组件用例和隐藏侧栏菜单</div>
      <QuickSearch
        productType={ProductType.BNC}
        onSelect={val => console.log(val, '选项回调')}
      />
    </QueryClientProvider>
  );
};

Q.storyName = 'Modal';

Q.parameters = {
  msw: [
    http.post(`dev/api/v1/bdm/bds/bds_api${APIs.baseData.bondSearch}`, () => {
      const response: BaseDataBondSearch.Response = {
        bond_basic_list: range(random(1, 20)).map(() => fakeFiccBondBasic()),
        base_response: { code: 0, msg: 'success' },
        total: 0
      };
      return new Response(JSON.stringify(response), { headers: { 'Content-Type': 'application/json' } });
    })
  ]
};
