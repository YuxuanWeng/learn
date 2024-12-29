import { Anchor } from 'antd';
import { BadgeV2 } from '@fepkg/components/BadgeV2';
import { CheckVersionResult } from 'app/utils/check-version';
import { useAtomValue } from 'jotai';
import { HEADER_ID } from '@/components/HeaderBar';
import { versionInfoAtom } from '../VersionSettings/atoms';
import { checkVersion } from '../VersionSettings/utils';
import { OptionsProps, ScrollMenuIDType, ScrollMenuItem } from './types';

export const DRAGGABLE_TYPE = 'option-item';

const Item = ({ option }: { option: Pick<ScrollMenuItem, 'id' | 'label'> }) => {
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
  const list = data.map(i => ({ id: i.id, label: i.label }));

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
    const headerEl = document.getElementById(HEADER_ID);

    window.scrollBy(0, -(headerEl?.offsetHeight ?? 40) - 5); // 防止scrollIntoView后header不见了, 目前header为40px
  };

  const anchorChange = (currentActiveLink: string) => {
    onChange?.(currentActiveLink);
  };

  const versionInfo = useAtomValue(versionInfoAtom);

  const hasNewVersion = versionInfo != null && checkVersion(versionInfo) !== CheckVersionResult.Latest;

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
            <BadgeV2
              key={option.id}
              containerCls="inline w-full"
              style={{ right: 70, top: 30 }}
              dot={hasNewVersion && option.id === ScrollMenuIDType.SystemManage}
            >
              <Item
                option={option}
                {...rest}
              />
            </BadgeV2>
          );
        })}
      </Anchor>
    </div>
  );
};
