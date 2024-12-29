import { BaseOption } from '@fepkg/components/BaseOptionsRender/BaseOption';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconRight } from '@fepkg/icon-park-react';
import { has } from 'lodash-es';
import { Header } from './Header';
import { useSearchInstTrader } from './provider';

export const Body = () => {
  const {
    searchData,
    selectInstId,
    instIndeterminate,
    selectedTraders,
    handleWrapperScroll,
    setSelectInstId,
    handleInstChecked,
    handleTradeChecked,
    instChecked
  } = useSearchInstTrader();
  const list = Object.values(searchData ?? {});

  const currentTraders = list?.find(v => v.inst_id === selectInstId);

  return (
    <div className="flex flex-col flex-auto h-0">
      <Header />

      <div className="flex flex-row py-2 h-[calc(100%_-_40px)]">
        {/* 机构列表 */}
        <div
          onScroll={handleWrapperScroll}
          className="w-[240px] overflow-y-overlay flex flex-col flex-auto gap-1 px-2"
        >
          {list?.map(v => {
            const instName = v.biz_short_name ?? v.inst_name;
            return (
              <BaseOption
                key={v.inst_id}
                className="justify-between"
                onClick={() => setSelectInstId(v.inst_id)}
                checkbox
                hoverActive
                expand={selectInstId === v.inst_id}
                checkboxProps={{
                  onClick: e => e.stopPropagation(),
                  className: 'w-auto',
                  checked: instChecked[v.inst_id],
                  indeterminate: has(instIndeterminate, v.inst_id) ? instIndeterminate[v.inst_id] : false,
                  onChange: () => handleInstChecked(v.inst_id, !instChecked[v.inst_id])
                }}
                suffixNode={v.traders.length === 0 ? null : <IconRight />}
              >
                <Tooltip
                  truncate
                  content={instName}
                >
                  <span className="block truncate max-w-[160px]">{instName}</span>
                </Tooltip>
              </BaseOption>
            );
          })}
        </div>
        <div className="component-dashed-y" />

        {/* 交易员列表 */}
        <div className="w-[240px] overflow-y-overlay flex flex-col gap-1 px-2">
          {currentTraders?.traders.map(v => {
            const isSelected = selectedTraders.some(trader => v.trader_id === trader.trader_id);

            return (
              <BaseOption
                className="hover:bg-gray-500"
                key={v.trader_id}
                checkbox
                hoverActive
                checkboxProps={{
                  checked: isSelected,
                  onClick: e => {
                    e.stopPropagation();
                  },
                  onChange: () => {
                    const currentInstName = currentTraders.biz_short_name ?? currentTraders.inst_name;
                    const cp = `${currentInstName}(${v.name_zh})`;
                    handleTradeChecked(
                      { ...v, instId: currentTraders.inst_id, cp, instName: currentInstName },
                      !isSelected
                    );
                  }
                }}
              >
                {v.name_zh}
              </BaseOption>
            );
          })}
        </div>
      </div>
    </div>
  );
};
