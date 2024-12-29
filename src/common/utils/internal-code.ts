import moment from 'moment';

/** 无create_time或不是当日则展示完整内码，否则展示后四位 */
export const getSubInternalCode = (internalCode: string, create_time?: string) => {
  if (!create_time || !moment(Number(create_time)).isSame(moment(), 'day')) {
    return internalCode;
  }
  return internalCode.slice(-4).replace(/^0*/, '');
};

// 内码搜索匹配逻辑
// 无搜索/内码位数不合法（5位或者超过6位）视为不匹配
export const matchInternalCode = (fullInternalCode: string, search?: string) => {
  if (search == null || search === '' || search.length > 6) return false;

  if (search.length <= 4) {
    const today = new Date();
    return fullInternalCode === `${today.getDate().toString().padStart(2, '0')}${search.padStart(4, '0')}`;
  }

  return fullInternalCode === search.toUpperCase();
};

export const internalCodeReg = /^\d{0,6}$/;
