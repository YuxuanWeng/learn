import { useState } from 'react';
import { Button } from '@fepkg/components/Button';
import { Popconfirm } from '@fepkg/components/Popconfirm';
import { Search, SearchOption } from '@fepkg/components/Search';
import { IconPrecise, IconReset } from '@fepkg/icon-park-react';
import { Trader } from '@fepkg/services/types/common';
import { useTraderConfig } from '../../providers/TraderConfigContainer';
import { traderOptionRender } from '../TraderOptions';

export const ModalTitle = () => {
  const { reset, traderMapRef, setSelectedTraderId, traderConfigList, traderFuzzySearch } = useTraderConfig();
  const { setKeyword, keyword, traderOptions, selectedTrader, setSelectedTrader } = traderFuzzySearch;

  const traders = new Set(traderConfigList?.map(v => v.trader_id) || []);
  const filterOptions = traderOptions.filter(v => traders?.has(v.original.trader_id));

  const handleSelectedTrader = (val: SearchOption<Trader> | null) => {
    setSelectedTrader(val);
    if (!val?.original.trader_id) return;
    const currentTrader = traderMapRef.current[val.original.trader_id];
    if (!currentTrader) return;
    currentTrader.scrollIntoView({ block: 'nearest' });
    setSelectedTraderId(val.original.trader_id);
    setKeyword('');
    setSelectedTrader(null);
  };

  const [popconfirmOpen, setPopconfirmOpen] = useState(false);

  return (
    <div className="flex items-center gap-6">
      <span>挂单设置</span>
      <Search<Trader>
        className="bg-gray-700 !w-[208px] first:child:w-[86px] text-gray-000 !h-7"
        options={filterOptions}
        optionRender={traderOptionRender}
        value={selectedTrader}
        placeholder="输入交易员姓名/机构名"
        onInputChange={setKeyword}
        inputValue={keyword}
        suffixIcon={<IconPrecise />}
        onChange={handleSelectedTrader}
      />
      <Popconfirm
        type="warning"
        trigger="manual"
        floatingProps={{ onKeyDown: evt => evt.stopPropagation() }}
        content="确认要恢复默认值吗？"
        placement="left"
        destroyOnClose
        open={popconfirmOpen}
        onOpenChange={setPopconfirmOpen}
        onConfirm={reset}
      >
        <Button.Icon
          text
          icon={<IconReset />}
          onClick={() => setPopconfirmOpen(true)}
          tooltip={{ placement: 'bottom-end', content: '恢复默认' }}
        />
      </Popconfirm>
    </div>
  );
};
