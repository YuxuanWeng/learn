import { Input } from '@fepkg/components/Input';
import { IconSearch } from '@fepkg/icon-park-react';
import { useSearchInstTrader } from './provider';

export const Header = () => {
  const { instKeyword, setInstKeyword, traderKeyword, setTraderKeyword } = useSearchInstTrader();
  return (
    <div className="h-10 px-2 gap-4 flex items-end">
      <Input
        className="bg-gray-800"
        placeholder="搜索机构"
        suffixIcon={<IconSearch />}
        value={instKeyword}
        onChange={setInstKeyword}
      />

      <Input
        className="bg-gray-800"
        placeholder="搜索交易员"
        suffixIcon={<IconSearch />}
        value={traderKeyword}
        onChange={setTraderKeyword}
      />
    </div>
  );
};
