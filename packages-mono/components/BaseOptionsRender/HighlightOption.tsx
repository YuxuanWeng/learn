import { Highlight } from '@fepkg/components/Highlight';

const baseCls = 'child-span:whitespace-nowrap child-span:text-ellipsis child-span:overflow-hidden def:gap-4 def:h-8';

const multipleCls = `grid items-center ${baseCls}`;
const singleCls = `flex justify-between items-center ${baseCls}`;

type HighlightOptionProps = {
  className?: string;
  /** 关键字 */
  keyword: string;
  label: string | string[];
  /** 是否关键字高亮 */
  highlight?: boolean | boolean[];
  gridTemplateColumns?: string;
};

export const HighlightOption = ({
  className,
  keyword,
  label,
  gridTemplateColumns,
  highlight = true
}: HighlightOptionProps) => {
  if (Array.isArray(label)) {
    return (
      <div
        className={`${multipleCls} ${className}`}
        style={{ gridTemplateColumns }}
      >
        {label.map((item, idx) => {
          // 如果只有一个highlight 且为true说明全都需要高亮
          // 如果highlight是一个list，则对应索引的才需要高亮
          const itemHighlight =
            (!Array.isArray(highlight) && highlight) || (Array.isArray(highlight) && highlight[idx]);
          return (
            <Highlight
              key={`${item}-${idx}`}
              keyword={itemHighlight ? keyword : ''}
            >
              {item}
            </Highlight>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={`${singleCls} ${className}`}
      title={label}
    >
      <Highlight keyword={!Array.isArray(highlight) && highlight ? keyword : ''}>{label}</Highlight>
    </div>
  );
};
