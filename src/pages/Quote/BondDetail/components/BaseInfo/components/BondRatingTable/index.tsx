import { FC } from 'react';
import cx from 'classnames';
import { Table } from '@fepkg/components/Table';
import { BondRating } from '@fepkg/services/types/common';
import { TypeProps } from '@/pages/Quote/BondDetail/type';
import { CollapseCaption } from '../CollapseCaption';
import { historyLevelColumns } from './columns';
import { BOND_RATING_TABLE_COLUMN_KEY, BondRatingTableColumnKey } from './table';

type Props = TypeProps & {
  data?: BondRating[];
  title: string;
  className?: string;
  visible?: boolean;
  tablePrefix?: React.ReactNode;
};

const BondRatingTable: FC<Props> = ({ data, title, visible, onChange, className = '', tablePrefix }) => {
  const titleOnChange = (value: boolean) => {
    onChange(2, value);
  };

  return (
    <div className={cx('z-1 text-sm leading-8 text-center', className)}>
      <CollapseCaption
        title={title}
        open={visible}
        onChange={titleOnChange}
      />
      <div className={cx(!visible && 'h-0 overflow-hidden')}>
        {tablePrefix}
        <div className="relative h-full">
          <Table<BondRating, BondRatingTableColumnKey>
            className="min-h-[244px] rounded-b-lg"
            zebra
            data={data ?? []}
            columns={historyLevelColumns}
            columnVisibleKeys={Array.from(BOND_RATING_TABLE_COLUMN_KEY)}
            rowKey={original => original.bond_rating_id}
            placeholderSize="xs"
            showWatermark={false}
            showHeaderReorder={false}
            showHeaderResizer={false}
            showHeaderContextMenu={false}
            hasColumnSettings={false}
            multiSelectEnabled={false}
            showHeaderDivide={false}
          />
        </div>
      </div>
    </div>
  );
};

export default BondRatingTable;
