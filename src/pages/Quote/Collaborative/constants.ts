import { miscStorage } from '@/localdb/miscStorage';

export const DRAFT_TABLE_PAGE_SIZE = 10;

// 获得大写字母
const getRepeatPrefixList = () => {
  const res: string[] = [];
  for (let i = 65; i <= 90; i += 1) {
    res.push(String.fromCharCode(i));
  }
  return res;
};

export const REPEATED_PREFIX_LIST = getRepeatPrefixList();

export const DEFAULT_SELECTED_GROUP = 'default_selected_group_id';

export const DEFAULT_GROUP = {
  id: DEFAULT_SELECTED_GROUP,
  name: '默认分组',
  brokers: miscStorage.userInfo ? [{ ...miscStorage.userInfo }] : []
};

export const QUOTE_BATCH_FORM_LOGGER_TRACE_FIELD = 'collaborativeQuoteQuoteBatchFormTraceId';
export const QUOTE_BATCH_FORM_LOGGER_FLOW_NAME = 'collaborative-quote-quote-batch-form';
