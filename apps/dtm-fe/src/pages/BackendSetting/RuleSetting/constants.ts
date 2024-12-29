import { ReceiptDealRuleType } from '@fepkg/services/types/bds-enum';

export const titleColWidth = 'w-[370px]';
export const switchColWidth = 'w-[158px]';

export const list = [
  { ruleType: ReceiptDealRuleType.ReceiptDealRuleTypeDefault, title: '默认规则', border: true },
  {
    ruleType: ReceiptDealRuleType.ReceiptDealRuleTypeSpecialBrokerage,
    title: '特殊佣金',
    subTitle: '成交单对手方任一方标记佣金异常（N/R）',
    border: true
  },
  {
    ruleType: ReceiptDealRuleType.ReceiptDealRuleTypeNC,
    title: 'NC',
    subTitle: '成交单对手方任一方标记无需确认单（NC）',
    border: true
  },
  {
    ruleType: ReceiptDealRuleType.ReceiptDealRuleTypeMD,
    title: 'MD',
    subTitle: '未通过时，成交单修改后再次提交的提交日与交易日日期对比'
  },
  {
    ruleType: ReceiptDealRuleType.ReceiptDealRuleTypeSD,
    title: 'SD',
    subTitle: '成交单首次提交日期与交易日日期对比'
  },
  {
    ruleType: ReceiptDealRuleType.ReceiptDealRuleTypeDestroyDeal,
    title: '毁单',
    subTitle: '成交单的毁单发起日与首次提交日日期对比'
  }
];

// 改由API层兜底
// export const baseRuleList = [
//   {
//     approval_rule_id: createTempId(),
//     rule_type: ReceiptDealRuleType.ReceiptDealRuleTypeDefault,
//     is_active: true,
//     rule_name: '默认规则'
//   },
//   {
//     approval_rule_id: createTempId(),
//     rule_type: ReceiptDealRuleType.ReceiptDealRuleTypeSpecialBrokerage,
//     is_active: false,
//     rule_name: '特殊佣金'
//   },
//   {
//     approval_rule_id: createTempId(),
//     rule_type: ReceiptDealRuleType.ReceiptDealRuleTypeNC,
//     is_active: false,
//     rule_name: 'NC'
//   },
//   {
//     approval_rule_id: createTempId(),
//     rule_type: ReceiptDealRuleType.ReceiptDealRuleTypeMD,
//     is_active: false,
//     rule_name: 'MD',
//     rule_subtype: [ReceiptDealRuleSubtype.ReceiptDealRuleSubtypeSameMonth],
//     rule_subtype_name: '同月'
//   },
//   {
//     approval_rule_id: createTempId(),
//     rule_type: ReceiptDealRuleType.ReceiptDealRuleTypeMD,
//     is_active: false,
//     rule_name: 'MD',
//     rule_subtype: [
//       ReceiptDealRuleSubtype.ReceiptDealRuleSubtypeSameYear,
//       ReceiptDealRuleSubtype.ReceiptDealRuleSubtypeDifferentMonth
//     ],
//     rule_subtype_name: '同年不同月'
//   },
//   {
//     approval_rule_id: createTempId(),
//     rule_type: ReceiptDealRuleType.ReceiptDealRuleTypeMD,
//     is_active: false,
//     rule_name: 'MD',
//     rule_subtype: [ReceiptDealRuleSubtype.ReceiptDealRuleSubtypeDifferentYear],
//     rule_subtype_name: '不同年'
//   },
//   {
//     approval_rule_id: createTempId(),
//     rule_type: ReceiptDealRuleType.ReceiptDealRuleTypeSD,
//     is_active: false,
//     rule_name: 'SD',
//     rule_subtype: [
//       ReceiptDealRuleSubtype.ReceiptDealRuleSubtypeSameMonth,
//       ReceiptDealRuleSubtype.ReceiptDealRuleSubtypeDifferentDay
//     ],
//     rule_subtype_name: '同月不同日'
//   },
//   {
//     approval_rule_id: createTempId(),
//     rule_type: ReceiptDealRuleType.ReceiptDealRuleTypeSD,
//     is_active: false,
//     rule_name: 'SD',
//     rule_subtype: [
//       ReceiptDealRuleSubtype.ReceiptDealRuleSubtypeSameYear,
//       ReceiptDealRuleSubtype.ReceiptDealRuleSubtypeDifferentMonth
//     ],
//     rule_subtype_name: '同年不同月'
//   },
//   {
//     approval_rule_id: createTempId(),
//     rule_type: ReceiptDealRuleType.ReceiptDealRuleTypeSD,
//     is_active: false,
//     rule_name: 'SD',
//     rule_subtype: [ReceiptDealRuleSubtype.ReceiptDealRuleSubtypeDifferentYear],
//     rule_subtype_name: '不同年'
//   },
//   {
//     approval_rule_id: createTempId(),
//     rule_type: ReceiptDealRuleType.ReceiptDealRuleTypeDestroyDeal,
//     is_active: true,
//     rule_name: '毁单',
//     rule_subtype: [ReceiptDealRuleSubtype.ReceiptDealRuleSubtypeSameDay],
//     rule_subtype_name: '同日'
//   },
//   {
//     approval_rule_id: createTempId(),
//     rule_type: ReceiptDealRuleType.ReceiptDealRuleTypeDestroyDeal,
//     is_active: true,
//     rule_name: '毁单',
//     rule_subtype: [ReceiptDealRuleSubtype.ReceiptDealRuleSubtypeSameYear],
//     rule_subtype_name: '同年'
//   },
//   {
//     approval_rule_id: createTempId(),
//     rule_type: ReceiptDealRuleType.ReceiptDealRuleTypeDestroyDeal,
//     is_active: true,
//     rule_name: '毁单',
//     rule_subtype: [ReceiptDealRuleSubtype.ReceiptDealRuleSubtypeDifferentYear],
//     rule_subtype_name: '不同年'
//   }
// ];
