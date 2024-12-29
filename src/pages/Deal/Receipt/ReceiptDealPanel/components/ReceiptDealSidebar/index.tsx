import { Button } from '@fepkg/components/Button';
import { IconProvider } from '@fepkg/icon-park-react';
import { UserSettingFunction } from '@fepkg/services/types/enum';
import { useAtomValue } from 'jotai';
import { useDialogWindow } from '@/common/hooks/useDialog';
import { useUserSetting } from '@/common/services/hooks/useSettings/useUserSetting';
import { trackPoint } from '@/common/utils/logger/point';
import { useProductParams } from '@/layouts/Home/hooks';
import { receiptDealTableSearchingBondAtom } from '@/pages/Deal/Receipt/ReceiptDealPanel/atoms/table';
import { ReceiptDealTrace } from '@/pages/Deal/Receipt/ReceiptDealPanel/components/ReceiptDealTable/types';
import { preventEnterDefault } from '@/pages/ProductPanel/utils';
import { ReceiptDealFormMode } from '../../../ReceiptDealForm/types';
import { getReceiptDealBatchFormConfig, getReceiptDealFormConfig } from '../../../ReceiptDealForm/utils';
import { DeleteButton } from './Delete/DeleteButton';
import { DestroyButton } from './Destroy/DestroyButton';
import { ReceiptDealAction, btnCommonProps, operatorList } from './constants';
import { useDisabledStatus } from './useDisabledStatus';
import { useLoadingStatus } from './useLoadingStatus';
import { IHandleOpenReceiptDealForm, useSidebarEvent } from './useSidebarEvent';

export const ReceiptDealPanelSidebar = () => {
  const { productType } = useProductParams();
  const { openDialog } = useDialogWindow();
  const searchingBond = useAtomValue(receiptDealTableSearchingBondAtom);

  const { onEvent } = useSidebarEvent();

  const { getSetting } = useUserSetting([UserSettingFunction.UserSettingInitSearchBond]);

  const { disabledStatus } = useDisabledStatus();
  const { loadingStatus, setLoading } = useLoadingStatus();

  const handleOpenTRD: IHandleOpenReceiptDealForm = (mode, defaultReceiptDeal, editable) => {
    openDialog(getReceiptDealFormConfig(productType, { mode, defaultReceiptDeal, editable }));
  };

  const handleOpenTRBatch: IHandleOpenReceiptDealForm = (mode, defaultReceiptDeal) => {
    openDialog(getReceiptDealBatchFormConfig(productType, { mode, defaultReceiptDeal, editable: true }));
  };

  return (
    <IconProvider value={{ size: 24 }}>
      <div className="relative box-content w-20 border-0 border-l border-solid border-gray-600 select-none">
        <div className="w-20">
          <div className="h-10 leading-10 mt-1 mb-4 mx-2 text-gray-000 text-sm font-bold">操作</div>

          <div className="absolute top-12 bottom-0 flex flex-col flex-1 gap-3 mx-2 my-3">
            <div className="flex flex-col gap-3">
              <Button
                tabIndex={-1}
                type="secondary"
                className="!font-heavy w-16"
                ghost
                disabled={disabledStatus.Trade}
                onKeyDown={preventEnterDefault}
                onClick={() => {
                  const searchWithBond = getSetting<number>(UserSettingFunction.UserSettingInitSearchBond);
                  const bond = searchWithBond ? searchingBond : undefined;

                  trackPoint(ReceiptDealTrace.SidebarTrd);
                  handleOpenTRD(ReceiptDealFormMode.Add, bond ? { bond_basic_info: bond } : undefined, true);
                }}
              >
                TRD
              </Button>
              <Button
                tabIndex={-1}
                type="secondary"
                className="!font-heavy w-16"
                ghost
                disabled={disabledStatus.Trade}
                onClick={() => {
                  const searchWithBond = getSetting<number>(UserSettingFunction.UserSettingInitSearchBond);
                  const bond = searchWithBond ? searchingBond : undefined;

                  trackPoint(ReceiptDealTrace.SidebarTrd);
                  handleOpenTRBatch(ReceiptDealFormMode.Add, bond ? { bond_basic_info: bond } : undefined);
                }}
              >
                TRD+
              </Button>
              <Button
                tabIndex={-1}
                type="orange"
                disabled={disabledStatus.Confirm || loadingStatus.Confirm}
                loading={loadingStatus.Confirm}
                className="!font-heavy w-16 h-8"
                onKeyDown={preventEnterDefault}
                onClick={async () => {
                  setLoading(ReceiptDealAction.Confirm, true);

                  await onEvent(ReceiptDealAction.Confirm).finally(() => {
                    setLoading(ReceiptDealAction.Confirm, false);
                  });
                }}
              >
                {/* 加上文本后宽度不足以支持loading，所以loading时仅展示图标 */}
                {loadingStatus.Confirm ? '' : 'Confirm'}
              </Button>
              <Button
                tabIndex={-1}
                type="green"
                disabled={disabledStatus.Submit || loadingStatus.Submit}
                loading={loadingStatus.Submit}
                className="!font-heavy w-16 h-8"
                onKeyDown={preventEnterDefault}
                onClick={async () => {
                  setLoading(ReceiptDealAction.Submit, true);

                  await onEvent(ReceiptDealAction.Submit).finally(() => {
                    setLoading(ReceiptDealAction.Submit, false);
                  });
                }}
              >
                {loadingStatus.Submit ? '' : 'Submit'}
              </Button>
            </div>

            <div className="h-0 border-0 border-t border-gray-500 border-dashed my-1" />

            <div className="flex flex-col gap-3 -mr-2 pr-2 overflow-y-overlay">
              {operatorList.map(i => {
                if (i.key === ReceiptDealAction.Destroy) {
                  return (
                    <DestroyButton
                      key={i.key}
                      disabled={disabledStatus[i.key]}
                    />
                  );
                }
                if (i.key === ReceiptDealAction.Delete) {
                  return (
                    <DeleteButton
                      key={i.key}
                      disabled={disabledStatus[i.key]}
                    />
                  );
                }

                return (
                  <Button
                    {...btnCommonProps}
                    key={i.key}
                    icon={i.icon}
                    disabled={disabledStatus[i.key] || loadingStatus[i.key]}
                    onKeyDown={preventEnterDefault}
                    onClick={async () => {
                      setLoading(i.key, true);

                      await onEvent(i.key, handleOpenTRD).finally(() => {
                        setLoading(i.key, false);
                      });
                    }}
                  >
                    {i.text}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </IconProvider>
  );
};
