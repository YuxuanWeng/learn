export type TraderBondSendInfo = {
  trader_id: string;
  trader_name: string;
  inst_name: string;
  trader_qq: string;
  message_schema: string;
  recommend_bond_list: { id: string; copyInfo?: string }[];
};
