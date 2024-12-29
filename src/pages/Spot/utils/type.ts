import { ReceiptDealTrade } from '@fepkg/services/types/bds-common';
import { ReceiptDealStatus } from '@fepkg/services/types/bds-enum';

export type ReceiptDealForAdd = {
  receipt_deal_id?: string;
  receipt_deal_status?: ReceiptDealStatus;
  bid_trade_info: { inst?: { inst_id: string } };
  ofr_trade_info: { inst?: { inst_id: string } };
  order_no?: string;
};

export type ReceiptDealDetailForAdd = {
  parent_deal: {
    parent_deal_id?: string;
    bridge_code?: string;
    internal_code?: string;
    receipt_deal_status?: ReceiptDealStatus;
    bid_trade_info: ReceiptDealTrade;
    ofr_trade_info: ReceiptDealTrade;
    order_no?: string;
    seq_number?: string;
  };
  details?: ReceiptDealForAdd[];
};
