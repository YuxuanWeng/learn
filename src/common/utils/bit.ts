/* eslint-disable no-bitwise */
const BitOper = {
  combine(...types: number[]) {
    return types.reduce((acc, type) => acc | type, 0);
  },
  has(combinedType: number, target: number) {
    return (combinedType & target) === target;
  }
};
export default BitOper;
