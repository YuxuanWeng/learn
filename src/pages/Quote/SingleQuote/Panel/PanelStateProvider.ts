import { useRef } from 'react';
import { TraceName } from '@fepkg/business/constants/trace-map';
import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';
import { useLogger } from '@/common/providers/LoggerProvider';

const PanelStateContainer = createContainer(() => {
  const [panelState, updatePanelState] = useImmer(() => {
    return { lastActionTime: Date.now() };
  });
  const opacityChangedByCancel = useRef(false);

  const { getLogContext, wrapperSubmit } = useLogger();

  const ctx = () => getLogContext(TraceName.SINGLE_QUOTE_SUBMIT);

  return { panelState, ctx, opacityChangedByCancel, updatePanelState, wrapperSubmit };
});

export const PanelStateProvider = PanelStateContainer.Provider;
export const usePanelState = PanelStateContainer.useContainer;
