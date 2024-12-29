import { APIs } from '@fepkg/services/apis';
import { MarketNotifyGetAllTag } from '@fepkg/services/types/market-notify/get-all-tag';
import { range } from 'lodash-es';
import { http } from 'msw';
import { fakeOutBoundTag } from '../../utils/fake';
import { getMockBaseUrl } from '../utils';

const list = range(0, 40).map(i => fakeOutBoundTag(i));

const handler = () =>
  http.post(getMockBaseUrl(APIs.marketNotify.tagGetAll), () => {
    const response: MarketNotifyGetAllTag.Response = {
      base_response: { code: 0 },
      market_notify_basic_list: list.slice(0, 10),
      market_notify_bond_list: list.slice(10, 20),
      market_notify_deal_list: list.slice(20, 30),
      market_notify_quote_list: list.slice(30, 40)
    };

    return new Response(JSON.stringify(response), { headers: { 'Content-Type': 'application/json' } });
  });

export default handler;
