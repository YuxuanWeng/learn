import { useRef } from 'react';
import { BondSearchProvider } from '@fepkg/business/components/Search/BondSearch';
import { Pagination } from '@fepkg/components/Pagination';
import { Placeholder } from '@fepkg/components/Placeholder';
import { useAtomValue } from 'jotai';
import Loading from '@/components/Loading/RouterLoading';
import { TraderPreferenceProvider, TraderSearchProvider } from '@/components/business/Search/TraderSearch';
import { useProductParams } from '@/layouts/Home/hooks';
import { activeTab } from '../atom';
import { RemindProvider, useRemind } from '../providers/RemindProvider';
import { ReminderTabsEnum } from '../type';
import { Card } from './components/Card';
import { SearchFilter } from './components/SearchFilter';
import { useCopyHook } from './hooks/useCopy';
import { useScrollPage } from './hooks/useScrollPage';

const Inner = () => {
  const { setCheckedKeyMarketList, remindList, notificationList, page, pageSize, setPage, total, loading, bondMap } =
    useRemind();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { handleTBodyWrapperScroll, handleContainerWheel } = useScrollPage({ scrollContainerRef });
  const activeTabKey = useAtomValue(activeTab);
  const cardList = remindList.map(remind => ({
    ...remind,
    bondInfo: bondMap.get(remind.keyMarket)
  }));
  const displayCls =
    activeTabKey === ReminderTabsEnum.RemindTab ? ' pt-3 h-full select-none drag-none' : 'h-0 opacity-0';
  const { handleMouseDown } = useCopyHook({ cardList });
  return (
    <div className={activeTabKey === ReminderTabsEnum.RemindTab ? 'h-full' : 'hidden'}>
      {loading ? (
        <Loading />
      ) : (
        <div
          ref={containerRef}
          className={displayCls}
        >
          <SearchFilter />
          <div
            className="overflow-y-overlay flex flex-col gap-y-3 select-none relative h-[calc(100%_-_90px)] pl-3 mr-0.5 pr-2.5"
            onScroll={handleTBodyWrapperScroll}
            onWheel={handleContainerWheel}
            ref={scrollContainerRef}
          >
            {notificationList.length > 0 ? (
              remindList.map(item => (
                <div
                  key={item.keyMarket}
                  onMouseDown={evt => {
                    handleMouseDown?.(evt, item);
                  }}
                >
                  <Card
                    data={item}
                    key={item.keyMarket}
                  />
                </div>
              ))
            ) : (
              <Placeholder
                type="no-data"
                size="md"
                label="暂无数据"
              />
            )}
          </div>
          {notificationList.length > 0 && (
            <div className="flex justify-between py-3 [&_.s-input-container]:!bg-gray-800 px-3">
              <div className="flex leading-6 text-gray-300">
                共有<span className="pl-1 pr-1 text-sm text-primary-100">{total}</span>条
              </div>
              <Pagination
                showQuickJumper
                showSizeChanger={false}
                current={page}
                pageSize={pageSize}
                total={total}
                onChange={val => {
                  setPage(val);
                  // 跳转到其他页才需要清空选中状态
                  if (page !== val) setCheckedKeyMarketList([]);
                }}
                className="[&_+div>label]:border-[1px] [&_+div>label]:border-solid  [&_+div>label]:border-gray-800 [&_+div]:!gap-0"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const PriceRemind = () => {
  const { productType } = useProductParams();
  return (
    <BondSearchProvider initialState={{ productType }}>
      <TraderSearchProvider initialState={{ productType }}>
        <TraderPreferenceProvider>
          <RemindProvider>
            <Inner />
          </RemindProvider>
        </TraderPreferenceProvider>
      </TraderSearchProvider>
    </BondSearchProvider>
  );
};
