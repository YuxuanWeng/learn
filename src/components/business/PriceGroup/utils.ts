/**
 * 将 xxx 类型的字符串，拆分铖 x，xx，xxx
 * @param str 待拆分字符串
 * @returns
 */
export const splitString = (data: string) => {
  const result: string[] = [];

  let curr = '';
  for (const item of data) {
    curr += item;
    result.push(curr);
  }

  return result;
};

/**
 * 判断是否是意向价
 * @param price 待判定价格
 * @param sample 指定意向价字样
 * @returns
 */
export const getIsIntention = (price?: string, sample?: string) => {
  if (!sample || !price) return false;
  const intentions = splitString(sample);
  // PM的需求是当输入B/BI/BID或b时都要识别成意向价，ofr与之相同
  if (sample === 'BID') {
    intentions.push('b');
  } else {
    intentions.push('o');
  }
  return intentions.includes(price);
};
