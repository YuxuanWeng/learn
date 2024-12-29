import { useMemo } from 'react';
import cx from 'classnames';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { useLocalStorage } from 'usehooks-ts';
import { LSKeys, getLSKeyWithoutProductType } from '@/common/constants/ls-keys';
import { getNCDAccess } from '@/common/utils/access';
import { Options } from '@/components/QuotationGroup/Options';
import { SubProductTitle } from '@/components/QuotationGroup/SubProductTitle';
import { QuotationGroupProps } from '@/components/QuotationGroup/types';
import { Header } from './Header';

export const MultiQuotationGroup = (props: QuotationGroupProps) => {
  const {
    visible,
    className = '',
    activeKey,
    options,
    floatingMode,
    hiddenOpenIconIds,
    onDrop,
    onAddClick,
    isGroupReachLimit,
    onExtendClick,
    onContextMenuClick,
    onChecked,
    onOpen
  } = props;

  const [ncdFolds, setNcdFolds] = useLocalStorage<{ Ncd1: boolean; Ncd2: boolean }>(
    getLSKeyWithoutProductType(LSKeys.NcdMenuOpen),
    { Ncd1: false, Ncd2: false }
  );
  const ncdAccess = getNCDAccess();

  // 当前页只有一个满足展示条件的看板（总数减去已经新窗口打开的）
  const ncdOptions = useMemo(() => {
    return options?.filter(item => item?.productType === ProductType.NCD);
  }, [options]);

  // 当前页只有一个满足展示条件的看板（总数减去已经新窗口打开的）
  const ncdpOptions = useMemo(() => {
    return options?.filter(item => item?.productType === ProductType.NCDP);
  }, [options]);

  const totalOptions = [...(ncdAccess.ncd ? ncdOptions || [] : []), ...(ncdAccess.ncdP ? ncdpOptions || [] : [])];

  // 仍然存活的窗口，有的窗口虽然已经打开了，但已经被删除了只是没有关掉，此时应排除
  const stillAliveOpenIds = hiddenOpenIconIds?.filter(
    groupId => totalOptions?.some(group => group.groupId === groupId || false)
  );

  // 当前页只有一个满足展示条件的看板（总数减去已经新窗口打开的）
  const isLastNotOpened = (totalOptions?.length || 0) - (stillAliveOpenIds?.length || 0) === 1;

  if (!visible) return null;
  return (
    <div
      className={cx('pl-2 w-full h-full flex flex-col flex-auto', className)}
      onContextMenu={evt => {
        evt.preventDefault();
      }}
    >
      <Header
        floatingMode={floatingMode}
        onExtendClick={onExtendClick}
      />

      <div className="h-0 flex-auto overflow-y-overlay pr-2 overflow-x-hidden">
        {ncdAccess.ncd && (
          <>
            <SubProductTitle
              title="NCD二级看板"
              isFold={ncdFolds?.Ncd2 === true}
              hideDashline={floatingMode === true}
              disabledAdd={isGroupReachLimit?.(ProductType.NCD)}
              onAddClick={() => {
                onAddClick?.(ProductType.NCD);
              }}
              onFoldClick={() =>
                setNcdFolds(draft => {
                  const newValue = !draft.Ncd2;
                  return { ...draft, Ncd2: newValue };
                })
              }
            />
            {!ncdFolds?.Ncd2 && (
              <Options
                data={ncdOptions}
                // 悬浮模式不启用排序
                enableSort={!floatingMode}
                hiddenOpenIconIds={hiddenOpenIconIds}
                isLastOpened={isLastNotOpened}
                activeKey={activeKey}
                onChecked={onChecked}
                onOpen={onOpen}
                onDrop={onDrop}
                onContextMenuClick={(evt, type, val) => {
                  onContextMenuClick?.(evt, type, val, ProductType.NCD);
                }}
              />
            )}
          </>
        )}

        {ncdAccess.ncdP && (
          <>
            <SubProductTitle
              title="NCD一级看板"
              className="mt-2"
              isFold={ncdFolds?.Ncd1 === true}
              hideDashline={floatingMode === true && ncdAccess?.ncd === false}
              disabledAdd={isGroupReachLimit?.(ProductType.NCDP)}
              onAddClick={() => {
                onAddClick?.(ProductType.NCDP);
              }}
              onFoldClick={() =>
                setNcdFolds(draft => {
                  const newValue = !draft.Ncd1;
                  return { ...draft, Ncd1: newValue };
                })
              }
            />
            {!ncdFolds?.Ncd1 && (
              <Options
                data={ncdpOptions}
                // 悬浮模式不启用排序
                enableSort={!floatingMode}
                hiddenOpenIconIds={hiddenOpenIconIds}
                isLastOpened={isLastNotOpened}
                activeKey={activeKey}
                onChecked={onChecked}
                onOpen={onOpen}
                onDrop={onDrop}
                onContextMenuClick={(evt, type, val) => {
                  onContextMenuClick?.(evt, type, val, ProductType.NCDP);
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
