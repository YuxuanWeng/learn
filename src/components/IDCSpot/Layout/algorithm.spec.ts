import { divArr } from './algorithm';

describe('test divArr', () => {
  it('one col', () => {
    expect(
      divArr({
        items: [500, 300, 200]
      })
    ).toStrictEqual([[500, 300, 200]]);
  });
  it('one col', () => {
    expect(
      divArr({
        colCapacity: 1080,
        items: [1081]
      })
    ).toStrictEqual([[1081]]);
  });
  it('two cols', () => {
    expect(
      divArr({
        maxColsCount: 2,
        colCapacity: 1080,
        items: [1081, 500, 600]
      })
    ).toStrictEqual([[1081], [500, 600]]);
  });
  it('two cols', () => {
    expect(
      divArr({
        maxColsCount: 2,
        colCapacity: 1080,
        items: [200, 500, 100, 600, 200]
      })
    ).toStrictEqual([
      [200, 500, 100],
      [600, 200]
    ]);
  });
  it('two cols', () => {
    expect(
      divArr({
        maxColsCount: 2,
        colCapacity: 1080,
        items: [200, 500, 300, 100]
      })
    ).toStrictEqual([[200, 500, 300], [100]]);
  });
  it('two cols', () => {
    expect(
      divArr({
        maxColsCount: 2,
        colCapacity: 1080,
        items: [500, 600, 500, 600, 500, 555]
      })
    ).toStrictEqual([
      [500, 600, 500],
      [600, 500, 555]
    ]);
  });
});
