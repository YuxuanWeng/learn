/* eslint-disable no-bitwise */
import BitOper from './bit';

enum Enum1 {
  Special = 0,
  A = 1,
  B = 1 << 1, // 2
  C = 1 << 2, // 4
  D = 1 << 3 // 8
}

const num1 = BitOper.combine(Enum1.B, Enum1.C);
const num2 = BitOper.combine(Enum1.B, Enum1.C, Enum1.A, Enum1.D);

describe('位操作', () => {
  it('combine', () => {
    expect(num1).toBe(6);
    expect(num2).toBe(15);
  });
  it('has', () => {
    expect(BitOper.has(num1, Enum1.B)).toBeTruthy();
    expect(BitOper.has(num1, Enum1.C)).toBeTruthy();
    expect(BitOper.has(num2, Enum1.D)).toBeTruthy();
    expect(BitOper.has(num2, Enum1.A)).toBeTruthy();
    expect(BitOper.has(num1, Enum1.A)).toBeFalsy();
    expect(BitOper.has(num1, Enum1.Special)).toBeTruthy();
    expect(BitOper.has(num2, Enum1.Special)).toBeTruthy();
  });
});
