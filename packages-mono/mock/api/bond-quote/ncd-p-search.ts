import { APIs } from '@fepkg/services/apis';
import { BondQuoteNcdpSearch } from '@fepkg/services/types/bond-quote/ncdp-search';
import { range } from 'lodash-es';
import { http } from 'msw';
import { fakeNCDPInfo } from '../../utils/fake';
import { getMockBaseUrl } from '../utils';

const ncdp_list = range(0, 30).map(fakeNCDPInfo);

const handler = () =>
  http.post(getMockBaseUrl(APIs.bondQuote.ncdp.search), () => {
    const response: BondQuoteNcdpSearch.Response = {
      base_response: { code: 0 },
      ncdp_list,
      total: ncdp_list.length
    };

    return new Response(JSON.stringify(response), { headers: { 'Content-Type': 'application/json' } });
  });

export default handler;
