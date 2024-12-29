import { Anchor } from 'antd';
import { cloneDeep } from 'lodash-es';
import { OptionsProps, ScrollMenuItem } from './types';

export const DRAGGABLE_TYPE = 'option-item';

const Item = ({ option }: Omit<OptionsProps, 'data' | 'anchorId'> & { option: ScrollMenuItem }) => {
  return (
    <Anchor.Link
      key={option.id}
      href={`#${option.id}`}
      title={option.label}
      className="text-sm mt-3 h-[44px] leading-[44px] py-0"
    />
  );
};

export const Options = ({ data = [], onClick, onChange, anchorId, ...rest }: OptionsProps) => {
  const list = cloneDeep(data);

  const anchorClick = (
    e: React.MouseEvent<HTMLElement>,
    link: {
      title: React.ReactNode;
      href: string;
    }
  ) => {
    e.preventDefault();
    onClick?.(link, e);

    return;
    const scroll = document.getElementById(link.href.slice(1));
    scroll?.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'instant' });
    const headerEl = document.getElementById('');

    window.scrollBy(0, -(headerEl?.offsetHeight ?? 40) - 5); // 防止scrollIntoView后header不见了, 目前header为40px
  };

  const anchorChange = (currentActiveLink: string) => {
    onChange?.(currentActiveLink);
  };

  return (
    <div className="flex-1 basis-0 overflow-y-overlay">
      <Anchor
        affix={false}
        getContainer={() => document.getElementById(anchorId) ?? window}
        onClick={anchorClick}
        onChange={anchorChange}
        className="h-full"
      >
        {list?.map(option => {
          return (
            <Item
              key={option.id}
              option={option}
              {...rest}
            />
          );
        })}
      </Anchor>
    </div>
  );
};
