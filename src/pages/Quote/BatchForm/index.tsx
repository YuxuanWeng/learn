import { Checkbox } from '@fepkg/components/Checkbox';
import { Dialog } from '@fepkg/components/Dialog';
import { Modal } from '@fepkg/components/Modal';
import { BondQuoteType, Side } from '@fepkg/services/types/enum';
import { useAtom, useAtomValue } from 'jotai';
import { FlowLoggerProvider } from '@/common/providers/FlowLoggerProvider';
import { CalcBodyProvider } from '@/components/business/Calc/Body';
import { CalcFooterProvider } from '@/components/business/Calc/Footer';
import { PriceGroupProvider } from '@/components/business/PriceGroup';
import { BrokerSearchProvider } from '@/components/business/Search/BrokerSearch';
import { InstTraderSearchProvider } from '@/components/business/Search/InstTraderSearch';
import { TraderPreferenceProvider } from '@/components/business/Search/TraderSearch';
import { CPBSearchConnectorProvider } from '@/components/business/Search/providers/CPBSearchConnectorProvider';
import { useProductParams } from '@/layouts/Home/hooks';
import { FlagValueProvider, useFlagValue } from '@/pages/Quote/SingleQuote/providers/FlagProvider';
import { quoteBatchFormOpenAtom } from './atoms';
import { BatchQuoteOperProvider, useBatchQuoteOper } from './components/BatchQuoteOper';
import { QuoteBatchFormLayout } from './layouts';
import { QuoteBatchFormProvider, useQuoteBatchForm } from './providers/FormProvider';
import { QuoteBatchFormProps } from './types';

const Inner = () => {
  const { useSubmit, showFooter } = useQuoteBatchForm();
  const { flagValue, updateFlagValue } = useFlagValue();
  const { updateFlagsInfo } = useBatchQuoteOper();

  const { submitting, handleConfirm } = useSubmit?.() ?? {};

  const [open, setOpen] = useAtom(quoteBatchFormOpenAtom);

  const handleCancel = () => {
    setOpen(false);
  };

  const handleInternalChange = (val: boolean) => {
    if (val) {
      updateFlagsInfo(draft => {
        draft.flag_star = 1;
      });
    }

    updateFlagValue(draft => {
      draft.flag_internal = val;
    });
  };

  return (
    <Modal
      visible={open}
      width={632}
      title={<Dialog.Header>批量修改</Dialog.Header>}
      keyboard
      draggable={false}
      footerProps={{ style: { padding: 12 }, confirmBtnProps: { loading: submitting } }}
      footerChildren={
        showFooter && (
          <Dialog.FooterItem>
            <Checkbox
              checked={!!flagValue?.flag_internal}
              onChange={handleInternalChange}
            >
              内部报价
            </Checkbox>
            <Checkbox
              checked={!!flagValue?.flag_urgent}
              onChange={val => {
                updateFlagValue(draft => {
                  draft.flag_urgent = val;
                });
              }}
            >
              紧急
            </Checkbox>
            <Checkbox
              checked={flagValue?.flag_sustained_volume}
              onChange={val => {
                updateFlagValue(draft => {
                  draft.flag_sustained_volume = val;
                });
              }}
            >
              续量
            </Checkbox>
          </Dialog.FooterItem>
        )
      }
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    >
      <QuoteBatchFormLayout />
    </Modal>
  );
};
const Wrapper = () => {
  const { productType } = useProductParams();
  const { loggerInfo } = useQuoteBatchForm();

  return (
    <FlowLoggerProvider initialState={{ ...loggerInfo }}>
      <FlagValueProvider>
        {/* 批量修改面板的价格信息全部取 Side.SideNone 的值 */}
        <PriceGroupProvider initialState={{ side: Side.SideNone, defaultValue: { quote_type: BondQuoteType.Yield } }}>
          <BatchQuoteOperProvider>
            <CalcBodyProvider initialState={{ productType }}>
              <CalcFooterProvider>
                <InstTraderSearchProvider initialState={{ productType }}>
                  <TraderPreferenceProvider>
                    <BrokerSearchProvider initialState={{ productType }}>
                      <CPBSearchConnectorProvider initialState={{ productType, resetBrokerAfterTraderClearing: false }}>
                        <Inner />
                      </CPBSearchConnectorProvider>
                    </BrokerSearchProvider>
                  </TraderPreferenceProvider>
                </InstTraderSearchProvider>
              </CalcFooterProvider>
            </CalcBodyProvider>
          </BatchQuoteOperProvider>
        </PriceGroupProvider>
      </FlagValueProvider>
    </FlowLoggerProvider>
  );
};

export const QuoteBatchForm = (props: QuoteBatchFormProps) => {
  const open = useAtomValue(quoteBatchFormOpenAtom);

  if (!open) return null;

  return (
    <QuoteBatchFormProvider initialState={props}>
      <Wrapper />
    </QuoteBatchFormProvider>
  );
};
