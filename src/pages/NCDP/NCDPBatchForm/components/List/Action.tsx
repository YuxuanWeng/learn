import { Button } from '@fepkg/components/Button';
import { Popconfirm } from '@fepkg/components/Popconfirm';
import { IconBrokerage, IconDelete, IconInterior } from '@fepkg/icon-park-react';
import { NCDPBatchFormListProps } from '../../types';

const btnProps = { className: 'w-7 h-7', text: true };

export const Action = ({
  brokerage,
  internal,
  showDelete,
  showPopconfirm,
  onBrokerage,
  onInternal,
  onDelete
}: NCDPBatchFormListProps.Action) => {
  const deleteBtnNode = (
    <Button.Icon
      {...btnProps}
      icon={<IconDelete />}
      onClick={showPopconfirm ? undefined : onDelete}
    />
  );

  return (
    <>
      <Button.Icon
        {...btnProps}
        icon={<IconBrokerage size={20} />}
        type="orange"
        bright
        checked={brokerage}
        onClick={onBrokerage}
      />
      <Button.Icon
        {...btnProps}
        icon={<IconInterior size={20} />}
        type="green"
        bright
        checked={internal}
        onClick={onInternal}
      />
      {showDelete &&
        (showPopconfirm ? (
          <Popconfirm
            type="danger"
            placement="left"
            content="确定清空全部已录入信息？"
            confirmBtnProps={{ label: '清空' }}
            onConfirm={onDelete}
          >
            {deleteBtnNode}
          </Popconfirm>
        ) : (
          deleteBtnNode
        ))}
    </>
  );
};
