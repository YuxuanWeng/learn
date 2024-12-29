import cx from 'classnames';
import { ReceiptDealRuleType } from '@fepkg/services/types/bds-enum';
import { splitList } from '../utils';
import { FormItem } from './FormItem';
import { titleColWidth } from './constants';
import { useRule } from './providers/RuleProvider';

type IRuleListItem = {
  title: string;
  ruleType?: ReceiptDealRuleType;
  subTitle?: string;
  border?: boolean;
  isLastItem?: boolean;
};
export const RuleListItem = ({ ruleType, title, subTitle, border, isLastItem }: IRuleListItem) => {
  const { showRuleSettingList } = useRule();
  const ruleList = showRuleSettingList.filter(i => i.rule_type === ruleType);
  const { titleItem, subList } = splitList(ruleList);

  const isDefaultRule = ruleType === ReceiptDealRuleType.ReceiptDealRuleTypeDefault;
  const isDestroyRule = ruleType === ReceiptDealRuleType.ReceiptDealRuleTypeDestroyDeal;
  const hideStatus = {
    hideSwitch: isDefaultRule || isDestroyRule,
    hideAdvancedRole: isDefaultRule,
    hideNormalRole: isDestroyRule
  };
  const hasSubList = Boolean(subList?.length);

  return (
    <div>
      <div
        className={cx(
          'flex bg-gray-800 text-gray-200 min-h-[48px] items-center border-0 border-x border-solid border-x-gray-800',
          border && 'border-b border-b-gray-700'
        )}
      >
        <div className={cx('pl-4', titleColWidth)}>
          <span className="text-orange-50 font-bold">{title}</span>
          <span className="text-gray-300 text-xs font-normal ml-1">{subTitle}</span>
        </div>
        {titleItem && (
          <FormItem
            {...titleItem}
            {...hideStatus}
            isTitle
          />
        )}
      </div>
      {hasSubList && (
        <div
          className={cx(
            'flex items-stretch border-solid border-gray-800 border-t-0',
            isLastItem ? 'border rounded-b-lg' : 'border-x'
          )}
        >
          <div className="mx-6 my-3 border-0 border-l border-dashed border-gray-400" />
          <div className="flex flex-col flex-1 w-0">
            {subList?.map(item => {
              return (
                <div
                  key={item.approval_rule_id}
                  className="flex"
                >
                  <div className="w-[319px] min-h-[48px] flex items-center">
                    <span className="ml-12 text-orange-50 font-bold">{item.rule_subtype_name ?? '未知规则'}</span>
                  </div>
                  <FormItem
                    {...item}
                    {...hideStatus}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
