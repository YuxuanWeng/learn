import { Tips } from '@fepkg/business/components/Tips';
import { BaseOption } from '@fepkg/components/BaseOptionsRender/BaseOption';
import { Tooltip } from '@fepkg/components/Tooltip';
import { useTraderConfig } from '../../providers/TraderConfigContainer';

export const Traders = () => {
  const { traderConfigList, selectedTraderId, traderMapRef, setSelectedTraderId } = useTraderConfig();
  return (
    <div className="w-[100px] px-2 py-1 h-full border-transparent border-solid box-border !border-r-gray-600 flex flex-col gap-1 overflow-y-overlay">
      {traderConfigList?.map(v => {
        const valid = v.flag_valid_inst && v.flag_valid_trader;

        return (
          <BaseOption
            ref={node => {
              if (node == null || traderMapRef.current == null) return;
              traderMapRef.current[v.trader_id] = node;
            }}
            className="overflow-x-hidden h-7"
            hoverActive
            onClick={() => {
              setSelectedTraderId(v.trader_id ?? '');
            }}
            selected={v.trader_id === selectedTraderId}
            key={v.trader_id}
          >
            <Tooltip
              truncate
              content={v.trader_name}
            >
              <span className="block truncate">{v.trader_name}</span>
            </Tooltip>
            <Tips
              // 机构和交易员有一个无效就提示
              show={!valid}
              placement="bottom-start"
              tipsContent="机构/交易员失效，无法参与报价/点价"
            />
          </BaseOption>
        );
      })}
    </div>
  );
};
