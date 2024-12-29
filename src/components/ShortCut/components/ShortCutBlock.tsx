import { UserHotkeyFunction } from '@fepkg/services/types/bds-enum';
import { UserHotkey } from '@fepkg/services/types/common';
import { MarketHotkeysSelect } from '@/components/ShortCut/components/MarketHotkeysSelect';
import ShortCutInput, { IShortCutInput } from './ShortCutInput';

type IShortCutBlock = { title: React.ReactNode; list: UserHotkey[] } & Omit<IShortCutInput, 'data'>;

const ShortCutBlock = ({ title, list, ...rest }: IShortCutBlock) => {
  return (
    <div className="mt-6">
      {title}

      <div className="w-[680px] flex flex-wrap gap-x-[72px] gap-y-6 mt-6 pl-6">
        {list.map(s => {
          if (s.function === UserHotkeyFunction.UserHotkeyMarketRotation) {
            return (
              <MarketHotkeysSelect
                key={s.function}
                marketValue={s.value}
                onMarketHotkeyChange={value => rest.updateSelectedRow(value, { ...s, type: rest.type })}
              />
            );
          }
          return (
            <ShortCutInput
              key={s.function}
              data={s}
              {...rest}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ShortCutBlock;
