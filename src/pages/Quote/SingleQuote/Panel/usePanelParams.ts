import { useContext, useRef } from 'react';
import { useMemoizedFn } from 'ahooks';
import { createContainer } from 'unstated-next';
import { DialogContext } from '@/layouts/Dialog/Layout';
import { useDialogLayout } from '@/layouts/Dialog/hooks';
import { QuoteActionMode, QuoteFocusInputType, SingleQuoteDialogContext } from '../types';

/** 获取从外部传入单条报价对话框的上下文入参 */
export const PanelParamsContainer = createContainer(() => {
  const dialogLayout = useDialogLayout();
  const defaultParams = useContext<SingleQuoteDialogContext>(DialogContext);

  const openTime = useRef(defaultParams?.timestamp);

  const reset = useMemoizedFn(() => {
    dialogLayout.setContext({
      ...defaultParams,
      actionMode: QuoteActionMode.ADD,
      defaultValue: undefined,
      disabled: false,
      focusInput: QuoteFocusInputType.BOND
    });
  });

  return { openTime, defaultParams, reset };
});

export const PanelParamsProvider = PanelParamsContainer.Provider;
export const usePanelParams = PanelParamsContainer.useContainer;
