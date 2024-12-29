import { Outlet } from 'react-router-dom';
import { usePreviewLoader } from '@/common/loaders/preview';
import { ApprovalDetailRender } from '@/components/ApprovalDetail';
import './index.less';

const Preview = () => {
  const { receiptDeals } = usePreviewLoader();

  return (
    <>
      <div className="approval-detail-preview-wrapper">
        <div className="approval-detail-preview-container">
          {receiptDeals.map(item => {
            return (
              <ApprovalDetailRender
                key={item.receipt_deal_id}
                target={item}
              />
            );
          })}
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Preview;
