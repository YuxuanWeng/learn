import { ReactNode, forwardRef, useState } from 'react';
import { Tips } from '@fepkg/business/components/Tips';
import { BaseOption } from '@fepkg/components/BaseOptionsRender/BaseOption';
import { Popconfirm } from '@fepkg/components/Popconfirm';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconDelete } from '@fepkg/icon-park-react';

type ItemProps = {
  value: string;
  name?: ReactNode;
  showWarn?: boolean;
  selected?: boolean;
  /** 是否为无效数据 */
  invalid?: boolean;
  onClick?: (val: string) => void;
  onDelete?: (val: string) => void;
  className?: string;
  popContent?: string;
};

// TODO 该组件与协同报价处的item相似，待合并
export const Item = forwardRef<HTMLInputElement, ItemProps>(
  (
    {
      popContent = '确定删除此分组？',
      showWarn,
      selected,
      value,
      name,
      className = '',
      invalid = false,
      onClick,
      onDelete
    },
    ref
  ) => {
    const [delConfirm, setDelConfirm] = useState(false);

    return (
      <BaseOption
        className={className}
        ref={ref}
        hoverActive
        onClick={() => onClick?.(value)}
        selected={selected}
        hoverShowSuffix={!delConfirm}
        suffixNode={
          <Popconfirm
            type="danger"
            content={showWarn ? <span className="w-[180px]">{popContent}</span> : void 0}
            placement="right"
            destroyOnClose
            confirmBtnProps={{ label: '删除' }}
            onOpenChange={setDelConfirm}
            onConfirm={() => onDelete?.(value)}
          >
            <IconDelete
              className="ml-auto text-gray-100 hover:text-primary-100"
              onClick={evt => {
                evt.stopPropagation();
                if (showWarn) setDelConfirm(true);
                else onDelete?.(value);
              }}
            />
          </Popconfirm>
        }
      >
        <Tooltip
          truncate
          content={name}
        >
          <div className="truncate">{name}</div>
        </Tooltip>
        <Tips
          show={invalid}
          tipsContent="机构/交易员失效"
        />
      </BaseOption>
    );
  }
);
