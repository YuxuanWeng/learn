import { useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import cx from 'classnames';
import { formatDate } from '@fepkg/common/utils/index';
import { message } from '@fepkg/components/Message';
import moment from 'moment/moment';
import { usePreviewLoader } from '@/common/loaders/preview';
import { ApprovalDetailRender } from '@/components/ApprovalDetail';

const getPageStyle = () => {
  return `
    @media print {
      html, body {
        -webkit-print-color-adjust: exact;
      }
    }
    @media print {
      .page {
        padding-top: 0.1cm;
      }
      .page-break {
        page-break-after: always;
      }
    }
    @media print {
      @page {
        size: 21cm 29.7cm;
        margin: 0.7cm 1.5cm 1.5cm 1.5cm;
      }
    }
    `;
};

const PrintNode = () => {
  const { receiptDeals } = usePreviewLoader();
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: formatDate(moment(), 'YYYYMMDD'),
    onPrintError: () => message.error('打印错误！')
  });

  useEffect(() => {
    handlePrint();
  }, [handlePrint]);

  return (
    <div style={{ display: 'none' }}>
      <div
        style={{ margin: '0', padding: '0' }}
        ref={componentRef}
      >
        <style
          type="text/css"
          media="print"
        >
          {getPageStyle()}
        </style>
        {receiptDeals.map(d => (
          <div
            key={d.receipt_deal_id}
            className={cx(
              'page w-[618px] scale-[1.61] origin-top-left',
              receiptDeals.length > 1 ? 'page-break' : 'overflow-hidden'
            )}
          >
            <ApprovalDetailRender target={d} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrintNode;
