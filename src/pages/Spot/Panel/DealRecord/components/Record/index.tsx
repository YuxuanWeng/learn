import cx from 'classnames';
import { Placeholder } from '@fepkg/components/Placeholder';
import { DealRecord } from '@fepkg/services/types/bds-common';
import { BondDealStatus, OperationSource } from '@fepkg/services/types/enum';
import { useSetAtom } from 'jotai';
import { miscStorage } from '@/localdb/miscStorage';
import { openWindowByContractID } from '@/pages/Spot/SpotPricingHint/utils';
import { anchorPointAtom, ctxMenuVisibleAtom, dealRecordOperatingAtom } from '../../atoms';
import { useDealRecord } from '../../providers/DealRecordProvider';
import { RecordContent } from './RecordContent';
import styles from '../../style.module.less';

/**
 * 单条成交记录
 * 背景颜色依赖当日成交(bg-gray-600、bg-gray-700两种颜色交替)和历史成交(bg-auxiliary-700)
 * 多条匹配记录背景色不用交替
 *
 * 是否能点击打开点价提示弹窗
 * 是否可以修改
 *
 * content分三个区域，可修改时展示三行，不可修改时展示最后两行
 *  1. 展示内码、过桥标志、过桥信息(bid/ofr)、查看按钮 ----可修改时展示
 *  2. 展示报价信息
 *    a. 支持双击打开修改有：债券代码， 成交价、返点、成交量、备注(打开弹窗)
 *  3. 点价信息
 */

/** 打开点价提示窗口(仅待确认状态) */
const handleOpenTip = (historyInfo: DealRecord) => {
  switch (historyInfo.deal_status) {
    // 成交单待确认
    case BondDealStatus.DealConfirming: {
      if (historyInfo.deal_id == null) return;

      if (historyInfo.source === OperationSource.OperationSourceOffline) {
        if (
          historyInfo?.spot_pricingee?.broker?.user_id === miscStorage.userInfo?.user_id &&
          historyInfo.spot_pricingee?.confirm_status === BondDealStatus.DealConfirming
        ) {
          openWindowByContractID(historyInfo.deal_id);
        }
      } else {
        openWindowByContractID(historyInfo.deal_id);
      }

      break;
    }

    default:
      break;
  }
};

export const Record = () => {
  const { data, containerRef, rowVirtualizer, activeKey, spotInfos, confirmStatusData } = useDealRecord();

  const { virtualItems, totalSize } = rowVirtualizer;
  const setContextVisible = useSetAtom(ctxMenuVisibleAtom);
  const setCurDealRecord = useSetAtom(dealRecordOperatingAtom);
  const setPosition = useSetAtom(anchorPointAtom);

  const paddingTop = virtualItems.length > 0 ? virtualItems?.[0]?.start || 0 : 0;
  const paddingBottom = virtualItems.length > 0 ? totalSize - (virtualItems?.at(-1)?.end || 0) : 0;

  return (
    <ul
      ref={containerRef}
      className={cx('h-0 flex-auto overflow-y-overlay min-w-[672px] pr-2', data.length === 0 && 'flex')}
    >
      {paddingTop > 0 && <div style={{ height: paddingTop }} />}
      {data.length !== 0 ? (
        virtualItems.map(item => {
          const spot = data[item.index];

          const bgColor = spot.isDark ? 'bg-gray-800' : 'bg-gray-700';

          const prev = data[item.index - 1];
          const next = data[item.index + 1];

          const isSameSectionWithPrev = prev != null && spot?.isDark === prev?.isDark;
          const isSameSectionWithNext = next != null && spot?.isDark === next?.isDark;

          const isFirstHistoryRecord = spot.isHistory && (prev == null || !prev.isHistory);
          const isLastCurRecord = !spot.isHistory && (next == null || next.isHistory);

          const isStart = item.index === 0 || isFirstHistoryRecord;
          const isEnd = item.index === data.length - 1 || isLastCurRecord;

          const isActive = spot?.deal_id === activeKey;
          const isPrevActive = prev && prev?.deal_id === activeKey;

          const borderBottom = isSameSectionWithNext ? styles['record-next-samegroup'] : '';

          const spotInfo = spotInfos[spot.spot_pricing_record_id ?? ''];

          const snapshot = confirmStatusData?.find(i => i.deal_id === spot.deal_id);

          return (
            // 成交内容
            <div key={spot?.deal_id}>
              {isFirstHistoryRecord && (
                <div className="flex items-center my-2">
                  <div className="flex-1 bg-gray-600 h-px" />
                  <div className="mx-4 text-gray-300 text-sm">历史成交</div>
                  <div className="flex-1 bg-gray-600 h-px" />
                </div>
              )}
              <li
                className={cx(
                  'flex gap-0.5 border-x border-y-0 border-t border-solid border-gray-600',
                  bgColor,
                  isStart && 'rounded-t-lg',
                  isEnd && 'rounded-b-lg border-b',
                  isActive && '!border-primary-100',
                  isPrevActive && !isStart && 'border-t-primary-100',
                  !(isPrevActive || isActive) && borderBottom
                )}
                style={{
                  contentVisibility: 'auto',
                  containIntrinsicSize: `${item.size}px`,
                  height: `${item.size}px`
                }}
                onContextMenu={evt => {
                  evt.stopPropagation();
                  evt.preventDefault();
                  setCurDealRecord(spot);
                  setContextVisible(true);
                  setPosition({ x: evt.pageX, y: evt.pageY });
                }}
                // 待处理状态下双击打开点价弹窗
                onDoubleClick={() => handleOpenTip(spot)}
              >
                {/* 成交内容 */}
                <RecordContent
                  historyInfo={spot}
                  isHistory={spot?.isHistory}
                  isDark={spot.isDark}
                  spotInfo={!spot.canShowSum || isSameSectionWithPrev ? undefined : spotInfo}
                  snapshot={snapshot?.deal_confirm_snapshot}
                />
              </li>
            </div>
          );
        })
      ) : (
        <Placeholder
          label="暂无数据"
          type="no-data"
        />
      )}
      {paddingBottom > 0 && <div style={{ height: paddingBottom }} />}
    </ul>
  );
};
