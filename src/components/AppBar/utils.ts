/** 获取文字头像姓名，此处姓名只考虑中文和英文两种 */
export const getAvatarName = (name?: string) => {
  if (!name) return '';
  const zhReg = /[\u4E00-\u9FFF]+/g;
  const enReg = /[A-Za-z]+/g;
  // 如果姓名是英文就返回首字母
  let result = name.match(enReg)?.join('')?.slice(0, 1);
  // 如果姓名是中文就返回最后两个字
  if (zhReg.test(name)) {
    result = name.match(zhReg)?.join('')?.slice(-2) ?? '';
  }
  return result ?? '';
};
