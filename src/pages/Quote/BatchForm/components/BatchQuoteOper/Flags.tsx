import { IconProvider } from '@fepkg/icon-park-react';
import { FlagIcon, FlagIconType } from '@/pages/Quote/SingleQuote/QuoteOper/FlagIcon';
import { useBatchQuoteOper } from '../../providers/BatchQuoteOperProvider';
import { OperItem } from './OperItem';

export const Flags = () => {
  const { flagsInfo, updateFlagsInfo } = useBatchQuoteOper();

  return (
    <IconProvider value={{ size: 20 }}>
      <OperItem label="标签">
        <div className="flex items-center gap-2 h-7">
          <FlagIcon
            type={FlagIconType.SingleStar}
            active={flagsInfo?.flag_star === 1}
            onClick={() => {
              updateFlagsInfo(draft => {
                draft.flag_star = draft?.flag_star === 1 ? void 0 : 1;
              });
            }}
          />
          <FlagIcon
            type={FlagIconType.DoubleStar}
            active={flagsInfo?.flag_star === 2}
            onClick={() => {
              updateFlagsInfo(draft => {
                draft.flag_star = draft?.flag_star === 2 ? void 0 : 2;
              });
            }}
          />

          <FlagIcon
            type={FlagIconType.Oco}
            active={flagsInfo?.flag_oco}
            onClick={() => {
              updateFlagsInfo(draft => {
                draft.flag_oco = !draft?.flag_oco;
                draft.flag_package = void 0;
              });
            }}
          />

          <FlagIcon
            type={FlagIconType.Pack}
            active={flagsInfo?.flag_package}
            onClick={() => {
              updateFlagsInfo(draft => {
                draft.flag_package = !draft?.flag_package;
                draft.flag_oco = void 0;
              });
            }}
          />

          <FlagIcon
            type={FlagIconType.Exchange}
            active={flagsInfo?.flag_exchange}
            onClick={() => {
              updateFlagsInfo(draft => {
                draft.flag_exchange = !draft?.flag_exchange;
              });
            }}
          />
        </div>
      </OperItem>
    </IconProvider>
  );
};
