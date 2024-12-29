import { useState } from 'react';
import { Tips } from '@fepkg/business/components/Tips';
import { BaseOption } from '@fepkg/components/BaseOptionsRender/BaseOption';
import { Popconfirm } from '@fepkg/components/Popconfirm';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconDelete, IconInfo } from '@fepkg/icon-park-react';

type Props = {
  id: string;
  value?: string;
  isSelected?: boolean;
  needPop?: boolean;
  popContent?: string;
  canDelete?: boolean;
  className?: string;
  /** 是否为无效数据 */
  invalid?: boolean;
  onClick?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export const Item = ({
  id,
  value,
  isSelected,
  needPop = true,
  canDelete = true,
  popContent = '确定删除此分组？',
  className = '',
  invalid = false,
  onClick,
  onDelete
}: Props) => {
  const [delConfirm, setDelConfirm] = useState(false);

  return (
    <BaseOption
      className={`w-[132px] min-h-[32px] ${className}`}
      onClick={() => onClick?.(id)}
      selected={isSelected}
      hoverActive
      hoverShowSuffix={!delConfirm}
      suffixNode={
        <Popconfirm
          type="danger"
          content={needPop && <span className="w-[180px]">{popContent}</span>}
          placement="right"
          destroyOnClose
          open={delConfirm}
          confirmBtnProps={{ label: '删除' }}
          onOpenChange={setDelConfirm}
          onConfirm={() => onDelete?.(id)}
        >
          {canDelete && (
            <IconDelete
              className="ml-auto text-gray-100 hover:text-primary-100"
              onClick={evt => {
                evt.stopPropagation();
                if (needPop) setDelConfirm(true);
                else onDelete?.(id);
              }}
            />
          )}
        </Popconfirm>
      }
    >
      <>
        <Tooltip
          truncate
          content={value}
        >
          <div className="truncate">{value}</div>
        </Tooltip>

        <Tips
          show={invalid}
          tipsContent="当前用户失效，无法参与报价"
        />
      </>
    </BaseOption>
  );
};
