interface IParams {
  maxColsCount?: number;
  colCapacity?: number;
  offset?: number;
  items: number[];
}

function getMax(...nums: number[]): number {
  return nums.sort((a, b) => b - a)[0];
}

export function divArr({ maxColsCount = 2, colCapacity = 1080, offset = 0, items = [] }: IParams) {
  if (!items.length) return [];

  const sum = items.reduce((acc, item) => {
    acc += item;
    return acc;
  }, 0);

  if (sum <= colCapacity) return [items];

  const max = getMax(...items);
  const base = getMax(sum / maxColsCount, max, colCapacity) + offset;
  const copy = items.slice();

  const result: number[][] = [];
  let currCol: number[] | undefined = void 0;
  let currColIndex = 0;
  let currColSum = 0;
  while (copy.length) {
    if (currColIndex >= maxColsCount) {
      result[maxColsCount - 1] = [...result[maxColsCount - 1], ...copy];
      break;
    }

    if (!Array.isArray(result[currColIndex])) result.push([] as number[]);
    currCol = result[currColIndex];

    const num = copy.shift() as number;
    currColSum += num;
    if (currColSum <= base) {
      currCol.push(num);
    } else {
      copy.unshift(num);
      currColIndex += 1;
      currColSum = 0;
    }
  }
  return result;
}
