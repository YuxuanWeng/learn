import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import { ReceiptDeal } from '@fepkg/services/types/common';
import { fetchMulReceiptDeal } from '@/common/services/api/receipt-deal/mul-get-by-id';

export const PreviewLoader = async ({ request }: LoaderFunctionArgs) => {
  const receiptDeals: ReceiptDeal[] = [];
  document.title = 'DTM成交表单';

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const ids = id?.split(',');

    if (ids?.length) {
      const { receipt_deal_info_list = [] } = await fetchMulReceiptDeal({ receipt_deal_id_list: ids });
      receiptDeals.push(...receipt_deal_info_list);
    } else {
      // TODO toast ?
      console.warn('no ids.');
    }
  } catch (err) {
    console.error(err);
    // TODO 日志上报
    console.error('parse ids error.');
  }

  return { receiptDeals };
};

export const usePreviewLoader = () => useLoaderData() as Awaited<ReturnType<typeof PreviewLoader>>;
