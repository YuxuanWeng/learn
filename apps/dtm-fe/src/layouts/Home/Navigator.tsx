import { HTMLAttributes, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cx from 'classnames';
import { ContextMenu, MenuItem, SubMenu } from '@fepkg/components/ContextMenu';
import { IconDown, IconProvider, IconRight, IconUp } from '@fepkg/icon-park-react';
import { useHover } from '@szhsin/react-menu';
import { useHomeLayout } from './useHomeLayout';
import { NavigateMenuItem } from './utils';

type NavigatorItemProps = HTMLAttributes<HTMLDivElement> & NavigateMenuItem;

export const NAVIGATOR_WIDTH = 208;

const NavigatorItem = ({ url, label, icon: IconComponent, subMenu, className, ...props }: NavigatorItemProps) => {
  const { isActiveUrl } = useHomeLayout();

  const checked = isActiveUrl(url);

  const containerCls = cx(
    'h-11 mx-4 px-4 flex rounded-lg items-center',
    !subMenu && 'cursor-pointer s-icon-two-tone-not-fill hover:text-primary-100 hover:bg-gray-600',
    checked ? 'text-primary-100 bg-gray-600' : 'text-gray-100',
    className
  );
  const navigate = useNavigate();

  const handleClick = () => {
    if (checked) return;

    if (url) {
      navigate(url);
    }
  };

  return (
    <>
      <div
        {...props}
        className={containerCls}
        onClick={handleClick}
        tabIndex={-1}
      >
        {IconComponent && <IconComponent />}
        <span className={cx('text-sm', IconComponent ? 'ml-2 font-bold' : 'ml-[44px] font-normal')}>{label}</span>
      </div>
      {subMenu && subMenu.length > 0 && (
        <>
          {subMenu.map(subItem => (
            <NavigatorItem
              key={subItem.label}
              {...subItem}
            />
          ))}
        </>
      )}
    </>
  );
};

const NavigatorOptions = ({ menu }: { menu?: NavigateMenuItem[] }) => {
  return (
    <div className="flex flex-col gap-y-2">
      {menu?.map(item => {
        if (item.subMenu) {
          return (
            <SubMenu
              icon={<IconRight />}
              key={item.label}
              label={item.label}
              menuClassName="!w-[84px] !min-w-[84px] !p-2"
            >
              <NavigatorOptions menu={item.subMenu} />
            </SubMenu>
          );
        }

        return (
          <MenuItem
            key={item.label}
            value={item.url}
          >
            {item.label}
          </MenuItem>
        );
      })}
    </div>
  );
};

export const Navigator = () => {
  const { menu, navigatorOpen } = useHomeLayout();

  return (
    <IconProvider value={{ size: 20 }}>
      <aside
        className={cx('relative overflow-hidden transition-margin duration-200 ease-linear', !navigatorOpen && 'mr-4')}
        style={{ width: NAVIGATOR_WIDTH, marginLeft: navigatorOpen ? 0 : -NAVIGATOR_WIDTH }}
      >
        <div
          style={{ width: NAVIGATOR_WIDTH }}
          className="h-full"
        >
          <menu className="absolute top-0 bottom-0 w-full flex flex-col gap-4 overflow-auto my-4">
            {menu.map(item => {
              return (
                <NavigatorItem
                  key={item.label}
                  {...item}
                />
              );
            })}
          </menu>
        </div>
      </aside>
    </IconProvider>
  );
};

export const NavigatorBreadcrumb = () => {
  const { activeLabel, menu } = useHomeLayout();
  const [open, setOpen] = useState(false);
  const { anchorProps, hoverProps } = useHover(open, setOpen);
  const anchorRef = useRef(null);

  const navigator = useNavigate();

  return (
    <>
      <div
        {...anchorProps}
        ref={anchorRef}
        tabIndex={-1}
        className={cx(
          'ml-3 pl-[22px] pr-[14px] w-30 select-none h-6 rounded-lg cursor-pointer flex justify-between items-center text-gray-000 text-sm font-normal',
          open && 'bg-gray-500'
        )}
      >
        <span className="truncate">{activeLabel}</span>
        {open ? <IconUp /> : <IconDown />}
      </div>
      <ContextMenu
        {...hoverProps}
        anchorRef={anchorRef}
        open={open}
        gap={4}
        onOpenChange={setOpen}
        className="w-30 flex flex-col p-2"
        onItemClick={evt => {
          navigator(evt.value);
        }}
      >
        <NavigatorOptions menu={menu} />
      </ContextMenu>
    </>
  );
};
