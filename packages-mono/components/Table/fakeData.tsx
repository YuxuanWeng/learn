import { QuoteSortedField } from '@fepkg/services/types/enum';
import { faker } from '@faker-js/faker';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { GROUP_HEADER_ID } from './constants';
import { GroupRowData } from './types';

export type Person = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  progress: number;
  status: 'relationship' | 'complicated' | 'single';
  children?: Person[];
};

export type GroupHeader = {
  headerId: string;
  content: string;
};

export type GroupItem = Pick<Person, 'firstName' | 'lastName' | 'age' | 'visits' | 'progress' | 'status'> & {
  itemId: string;
};

export type DemoGroupRowData = GroupRowData & {
  id: string;
  original: GroupHeader | GroupItem;
};

const range = (len: number) => {
  const arr: number[] = [];
  for (let i = 0; i < len; i += 1) {
    arr.push(i);
  }
  return arr;
};

const fakePerson = (): Person => ({
  id: faker.string.uuid(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  age: faker.number.int(40),
  visits: faker.number.int(1000),
  progress: faker.number.int(100),
  status: faker.helpers.shuffle<Person['status']>(['relationship', 'complicated', 'single'])?.[0]
});

export function fakeData(...lens: number[]) {
  const fakeDataLevel = (depth = 0): Person[] => {
    const len = lens?.[depth];
    return range(len).map((): Person => {
      return {
        ...fakePerson(),
        children: lens[depth + 1] ? fakeDataLevel(depth + 1) : undefined
      };
    });
  };

  return fakeDataLevel();
}

export const columnHelper = createColumnHelper<Person>();

export const columns: ColumnDef<Person, any>[] = [
  columnHelper.accessor('firstName', {
    header: '最前名称',
    cell: info => info.getValue(),
    minSize: 24,
    size: 128,
    meta: {
      columnKey: 'firstName',
      sortedField: QuoteSortedField.FieldFirstMaturityDate
    }
  }),
  columnHelper.accessor('lastName', {
    header: '最后名称',
    cell: info => <i>{info.getValue()}</i>,
    meta: {
      columnKey: 'lastName',
      sortedField: QuoteSortedField.FieldBondCode
    }
  }),
  columnHelper.accessor('age', {
    header: () => '年龄',
    cell: info => info.renderValue(),
    meta: {
      columnKey: 'age',
      align: 'center',
      sortedField: QuoteSortedField.FieldBondShortName
    }
  }),
  columnHelper.accessor('visits', {
    header: '观看数',
    cell: info => info.row.original.visits,
    meta: {
      columnKey: 'visits',
      align: 'right',
      sortedField: QuoteSortedField.FieldBid
    }
  }),
  columnHelper.accessor('status', {
    header: '状态',
    meta: {
      columnKey: 'status',
      sortedField: QuoteSortedField.FieldOfr
    }
  }),
  columnHelper.accessor('progress', {
    header: '进度',
    meta: {
      columnKey: 'progress'
    }
  })
];

export const autoWidthColumns: ColumnDef<Person, any>[] = [
  columnHelper.accessor('firstName', {
    header: '最前名称',
    cell: info => info.getValue(),
    minSize: 24,
    size: 128,
    meta: {
      columnKey: 'firstName',
      sortedField: QuoteSortedField.FieldFirstMaturityDate
    }
  }),
  columnHelper.accessor('lastName', {
    header: '最后名称',
    cell: info => <i>{info.getValue()}</i>,
    meta: {
      columnKey: 'lastName',
      sortedField: QuoteSortedField.FieldBondCode,
      thCls: 'flex-1',
      tdCls: 'flex-1'
    }
  }),
  columnHelper.accessor('age', {
    header: () => '年龄',
    cell: info => info.renderValue(),
    meta: {
      columnKey: 'age',
      align: 'center',
      sortedField: QuoteSortedField.FieldBondShortName,
      thCls: 'flex-1',
      tdCls: 'flex-1'
    }
  }),
  columnHelper.accessor('visits', {
    header: '观看数',
    cell: info => info.row.original.visits,
    meta: {
      columnKey: 'visits',
      align: 'right',
      sortedField: QuoteSortedField.FieldBid,
      thCls: 'flex-1',
      tdCls: 'flex-1'
    }
  }),
  columnHelper.accessor('status', {
    header: '状态',
    meta: {
      columnKey: 'status',
      sortedField: QuoteSortedField.FieldOfr,
      thCls: 'flex-1',
      tdCls: 'flex-1'
    }
  }),
  columnHelper.accessor('progress', {
    header: '进度',
    meta: {
      columnKey: 'progress',
      thCls: 'flex-1',
      tdCls: 'flex-1'
    }
  })
];

const isGroupItem = (target: GroupHeader | GroupItem): target is GroupItem =>
  Object.hasOwn(target, 'itemId') && !Object.hasOwn(target, 'headerId');

const fakeGroupHeader = (): GroupHeader => ({
  headerId: faker.datatype.uuid(),
  content: faker.hacker.abbreviation()
});

const fakeGroupItem = (): GroupItem => ({
  itemId: faker.datatype.uuid(),
  ...fakePerson()
});

export const fakeGroupData = (len: number, groupLen: number): DemoGroupRowData[] => {
  const res: DemoGroupRowData[] = [];

  range(len).forEach(() => {
    const groupHeader = {
      id: faker.datatype.uuid(),
      original: fakeGroupHeader(),
      isGroupHeader: true
    };
    res.push(groupHeader);

    let groupFirstIndex = 0;
    let groupLastIndex = 0;

    range(groupLen).forEach((_, idx) => {
      let isGroupFirst = false;
      let isGroupLast = false;

      if (idx === 0) {
        isGroupFirst = true;
        groupFirstIndex = res.length;
      } else if (idx === groupLen - 1) {
        isGroupLast = true;
      }

      groupLastIndex = groupFirstIndex + (groupLen - 1);

      const groupItem = {
        id: faker.datatype.uuid(),
        original: fakeGroupItem(),
        isGroupFirst,
        isGroupLast,
        groupFirstIndex,
        groupLastIndex
      };
      res.push(groupItem);
    });
  });

  return res;
};
const groupColumnHelper = createColumnHelper<DemoGroupRowData>();

export const groupColumns = [
  groupColumnHelper.display({
    id: GROUP_HEADER_ID,
    meta: { columnKey: GROUP_HEADER_ID },
    cell: ({ row }) => {
      const { original } = row.original;
      let content = '';
      if (!isGroupItem(original)) {
        content = original.content;
      }
      return <div className="flex items-center h-full px-3 bg-gray-600">{content}</div>;
    }
  }),
  groupColumnHelper.display({
    id: 'firstName',
    minSize: 24,
    size: 128,
    meta: { columnKey: 'firstName' },
    cell: ({ row }) => (isGroupItem(row.original.original) ? row.original.original.firstName : '')
  }),
  groupColumnHelper.display({
    id: 'lastName',
    minSize: 24,
    size: 128,
    meta: { columnKey: 'lastName' },
    cell: ({ row }) => (isGroupItem(row.original.original) ? row.original.original.lastName : '')
  }),
  groupColumnHelper.display({
    id: 'age',
    minSize: 24,
    size: 128,
    meta: { columnKey: 'age' },
    cell: ({ row }) => (isGroupItem(row.original.original) ? row.original.original.age : '')
  }),
  groupColumnHelper.display({
    id: 'visits',
    minSize: 24,
    size: 128,
    meta: { columnKey: 'visits' },
    cell: ({ row }) => (isGroupItem(row.original.original) ? row.original.original.visits : '')
  }),
  groupColumnHelper.display({
    id: 'status',
    minSize: 24,
    size: 128,
    meta: { columnKey: 'status' },
    cell: ({ row }) => (isGroupItem(row.original.original) ? row.original.original.status : '')
  }),
  groupColumnHelper.display({
    id: 'progress',
    minSize: 24,
    size: 128,
    meta: { columnKey: 'progress' },
    cell: ({ row }) => (isGroupItem(row.original.original) ? row.original.original.progress : '')
  })
];
