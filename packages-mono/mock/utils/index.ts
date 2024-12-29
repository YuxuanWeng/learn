/**
 * @description 获取随机的枚举值
 */
export const getRandomEnumValue = <Enum>(e: any): Enum => {
  const keys = Object.keys(e).filter(k => Number.isNaN(Number(k)));
  const values = keys.map(k => e[k]);
  return values[Math.floor(Math.random() * values.length)] as Enum;
};

export function range(length: number) {
  return [...new Array(length).keys()];
}
