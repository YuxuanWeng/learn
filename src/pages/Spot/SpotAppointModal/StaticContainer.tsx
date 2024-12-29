import cx from 'classnames';
import { Tooltip } from '@fepkg/components/Tooltip';
import { Flags } from './components/Flags';
import SubTitle from './components/SubTitle';
import { useSpotAppoint } from './provider';

const BASE_CLS = 'bg-gray-800 w-[220px] h-[60px] flex flex-col justify-center gap-1 px-4';
const BASE_ITEM_CLS = 'flex items-center gap-1';

export const StaticContainer = () => {
  const {
    isTkn,
    isSelf,
    quoteState,
    defaultCp,
    defaultFlags,
    defaultBroker,
    defaultVolume,
    defaultFLagInternal,
    flagInternalIsChanged,
    cpIsChanged,
    volumeIsChanged,
    flagIsChanged,
    defaultLiqSpeed,
    liqSpeedIsChanged,
    brokerIsChanged
  } = useSpotAppoint();

  const { quoteVolume, cp, flagInternal, broker, liqSpeed } = quoteState;

  const volumeChangeDisplay: string[] = [];
  if (volumeIsChanged) volumeChangeDisplay.push(defaultVolume?.toString() ?? '');
  if (flagInternalIsChanged) volumeChangeDisplay.push(defaultFLagInternal);

  return (
    <div className="mt-3 rounded-lg flex flex-col gap-px select-none text-gray-000 text-sm">
      <div className="flex gap-px">
        {/* CP */}
        <div className={cx(BASE_CLS, 'rounded-tl-lg w-[220px]')}>
          <div className={BASE_ITEM_CLS}>
            <SubTitle.Title title="CP" />
            {cpIsChanged && (
              <SubTitle.Icon
                isTkn={isTkn}
                content={defaultCp}
              />
            )}
          </div>
          <Tooltip
            truncate
            content={cp}
          >
            <span className="truncate">{cp}</span>
          </Tooltip>
        </div>

        {/* 报价量 */}
        <div className={cx(BASE_CLS, 'rounded-tr-lg w-[303px]')}>
          <div className={BASE_ITEM_CLS}>
            <SubTitle.Title title="Vol" />
            {(volumeIsChanged || flagInternalIsChanged) && (
              <SubTitle.Icon
                isTkn={isTkn}
                content={volumeChangeDisplay.join(',')}
              />
            )}
          </div>
          <div className="flex flex-row justify-between items-center">
            <span className={cx(flagInternal ? 'text-primary-100' : 'text-gray-000')}>{quoteVolume}</span>
            <div className="flex items-center gap-1">
              <Flags {...quoteState} />
              {flagIsChanged && (
                <SubTitle.Icon
                  isTkn={isTkn}
                  content={
                    <Flags
                      {...defaultFlags}
                      className="flex gap-2"
                    />
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-px">
        {/* Broker */}
        <div className={cx(BASE_CLS, 'rounded-bl-lg w-[220px]')}>
          <div className={BASE_ITEM_CLS}>
            <SubTitle.Title title="Broker" />
            {brokerIsChanged && (
              <SubTitle.Icon
                isTkn={isTkn}
                content={defaultBroker?.name_zh}
              />
            )}
          </div>

          <span
            className={cx(isSelf && 'px-2 rounded-lg border border-solid border-primary-100 text-primary-100 w-fit')}
          >
            {broker?.name_zh ?? '-'}
          </span>
        </div>

        {/* 交割 */}
        <div className={cx(BASE_CLS, 'rounded-br-lg w-[303px]')}>
          <div className={BASE_ITEM_CLS}>
            <SubTitle.Title title="交割" />
            {liqSpeedIsChanged && (
              <SubTitle.Icon
                isTkn={isTkn}
                content={defaultLiqSpeed}
              />
            )}
          </div>
          <Tooltip
            truncate
            content={liqSpeed}
          >
            <span className="truncate">{liqSpeed}</span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
