import { memo, useId } from 'react';
import { Tooltip } from '@fepkg/components/Tooltip';
import { isEqual } from 'lodash-es';

type Props = {
  list: string[][];
};

const Item = ({ item }: { item: string[] }) => {
  const id = useId();

  return (
    <div
      id={id}
      className="h-6  py-1  text-xs  font-medium leading-4 flex  gap-x-4"
    >
      <div className="w-16  text-gray-200">{item[0]}</div>
      <Tooltip
        floatingId={id}
        content={<div className="whitespace-break-spaces max-w-[500px] max-h-[500px] overflow-scroll">{item[1]}</div>}
        trigger="hover"
        truncate
        safePolygon
        destroyOnClose={false}
      >
        <div className="text-gray-000 truncate max-w-[288px] break-words">{item[1]}</div>
      </Tooltip>
    </div>
  );
};

const Inner = ({ list }: Props) => {
  return list?.map(item => (
    <Item
      key={item[0]}
      item={item}
    />
  ));
};

export const NCDFilterDetail = memo(Inner, (prevProps, nextProps) => isEqual(prevProps, nextProps));
