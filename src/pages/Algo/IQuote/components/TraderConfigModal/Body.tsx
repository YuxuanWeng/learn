import {
  BargainFlagOptions,
  BigVolumeOptions,
  ClearSpeedOptions,
  InternalOptions
} from '@fepkg/business/constants/options';
import { Radio, RadioGroup } from '@fepkg/components/Radio';
import { Tooltip } from '@fepkg/components/Tooltip';
import { BargainFlagType, BigVolumeType, ClearSpeedType, InternalType } from '@fepkg/services/types/algo-enum';
import { useTraderConfig } from '../../providers/TraderConfigContainer';

const BaseCls = 'bg-gray-800 rounded-lg h-7 flex items-center px-3 gap-2';

export const Body = () => {
  const { currentTrader, save } = useTraderConfig();
  if (!currentTrader) return null;

  const displayHead = `${currentTrader.trader_name + (currentTrader.trader_qq ? `(${currentTrader.trader_qq})` : '')}`;

  return (
    <div className="px-3 py-2 flex flex-1 w-full ">
      <div className="flex flex-col w-full gap-2">
        <div className="flex items-center">
          <Tooltip
            truncate
            content={displayHead}
          >
            <span className="text-gray-000 max-w-[128px] truncate">{displayHead}</span>
          </Tooltip>
          <Tooltip
            truncate
            content={currentTrader.inst_name}
          >
            <span className="ml-2 text-gray-100 text-xs font-normal truncate max-w-[140px] inline-block">
              {currentTrader.inst_name}
            </span>
          </Tooltip>
        </div>

        <div className="component-dashed-x w-full" />

        <div className={BaseCls}>
          <span className="w-14">交割</span>
          <RadioGroup
            className="bg-gray-800 rounded-lg h-7 gap-4"
            type="radio"
            value={[currentTrader.clear_speed_type]}
            onChange={val => {
              save({
                traderId: currentTrader.trader_id,
                key: 'clear_speed_type',
                value: val[0] as unknown as ClearSpeedType
              });
            }}
          >
            {ClearSpeedOptions.map(item => (
              <Radio
                value={item.value}
                key={item.value}
                className={item.value === currentTrader.clear_speed_type ? '!text-gray-000' : 'text-gray-200'}
              >
                {item.label}
              </Radio>
            ))}
          </RadioGroup>
        </div>

        <div className={BaseCls}>
          <span className="w-14">大量</span>
          <RadioGroup
            className="bg-gray-800 rounded-lg h-7 gap-4 "
            type="radio"
            value={[currentTrader.big_volume_type]}
            onChange={val => {
              save({
                traderId: currentTrader.trader_id,
                key: 'big_volume_type',
                value: val[0] as unknown as BigVolumeType
              });
            }}
          >
            {BigVolumeOptions.map(item => (
              <Radio
                value={item.value}
                key={item.value}
                className={item.value === currentTrader.big_volume_type ? '!text-gray-000' : 'text-gray-200'}
              >
                {item.label}
              </Radio>
            ))}
          </RadioGroup>
        </div>

        <div className={BaseCls}>
          <span className="w-14">明/暗盘</span>
          <RadioGroup
            className="bg-gray-800 rounded-lg h-7 gap-4 "
            type="radio"
            value={[currentTrader.internal_type]}
            onChange={val => {
              save({
                traderId: currentTrader.trader_id,
                key: 'internal_type',
                value: val[0] as unknown as InternalType
              });
            }}
          >
            {InternalOptions.map(item => (
              <Radio
                value={item.value}
                key={item.value}
                className={item.value === currentTrader.internal_type ? '!text-gray-000' : 'text-gray-200'}
              >
                {item.label}
              </Radio>
            ))}
          </RadioGroup>
        </div>
        <div className={BaseCls}>
          <span className="w-14">置信度</span>
          <RadioGroup
            className="bg-gray-800 rounded-lg h-7 gap-4 "
            type="radio"
            value={[currentTrader.bargain_flag_type]}
            options={BargainFlagOptions}
            onChange={val => {
              save({
                traderId: currentTrader.trader_id,
                key: 'bargain_flag_type',
                value: val[0] as unknown as BargainFlagType
              });
            }}
          >
            {BargainFlagOptions.map(item => (
              <Radio
                value={item.value}
                key={item.value}
                className={item.value === currentTrader.bargain_flag_type ? '!text-gray-000' : 'text-gray-200'}
              >
                {item.label}
              </Radio>
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};
