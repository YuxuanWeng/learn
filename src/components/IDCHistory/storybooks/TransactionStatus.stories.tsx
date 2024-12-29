import { Col, Row } from 'antd';
import { BondDealStatus, Source } from '@fepkg/services/types/enum';
import TransactionStatus from '../TransactionStatus';
import { markColors, sourceText } from '../constants';

export default {
  title: 'IDC业务组件/历史记录/状态-标志 ',
  component: TransactionStatus
};

export const Basic = () => {
  return (
    <Row gutter={16}>
      <Col className="flex gap-1">
        <div>绿色-已确认，来源-线下</div>
        <TransactionStatus
          color={markColors[BondDealStatus.DealConfirmed]}
          texts={sourceText[Source.OFFLine]?.split('')}
        />
      </Col>
      <Col className="flex gap-1">
        <div>红色-拒绝，来源-BLOTTER</div>
        <TransactionStatus
          color={markColors[BondDealStatus.DealRefuse]}
          texts={sourceText[Source.SourceQM]?.split('')}
        />
      </Col>
      <Col className="flex gap-1">
        <div>紫色-部分确认，来源-STC</div>
        <TransactionStatus
          color={markColors[BondDealStatus.DealPartConfirmed]}
          texts={sourceText[Source.STC]?.split('')}
        />
      </Col>
      <Col className="flex gap-1">
        <div>橙色-待确认，来源-IDC(IDC没有标志)</div>
        <TransactionStatus
          color={markColors[BondDealStatus.DealConfirming]}
          texts={sourceText[Source.IDC]?.split('')}
        />
      </Col>
    </Row>
  );
};
Basic.storyName = '基本用法';
