import { useContext, useEffect } from 'react';
import { SpotAppointModalFlow } from '@fepkg/business/constants/log-map';
import { Dialog } from '@fepkg/components/Dialog';
import { isUseLocalServer } from '@/common/ab-rules';
import { useEnterDown } from '@/common/hooks/useEnterDown';
import { trackPoint } from '@/common/utils/logger/point';
import { AlwaysOpenToolView } from '@/components/AlwaysOpenToolView';
import { renderBondNodes } from '@/components/IDCBoard/utils';
import { SpotAppointModalProps } from '@/components/IDCSpot/types';
import { getSpotAppointKey } from '@/components/IDCSpot/utils';
import { DialogLayout } from '@/layouts/Dialog';
import { DialogContext } from '@/layouts/Dialog/Layout';
import { LocalDataProvider } from '@/layouts/LocalDataProvider';
import { LocalServerLoadingProvider } from '@/layouts/LocalDataProvider/LocalServer';
import { SpotFooter } from '../components/SpotFooter';
import { QuoteContainer } from './QuoteContainer';
import { StaticContainer } from './StaticContainer';
import { SpotAppointProvider, useSpotAppoint } from './provider';
import useSubmit from './useSubmit';

const Inner = () => {
  const { defaultValue, disabled, submitLabel, isTkn, flagInternal, submitting, setFlagInternal } = useSpotAppoint();
  const { handleSubmit, onCancel } = useSubmit();

  useEnterDown(handleSubmit);

  return (
    <>
      <AlwaysOpenToolView />
      <DialogLayout.Header
        background={isTkn ? 'bg-secondary-500' : 'bg-orange-500'}
        controllers={['close']}
      >
        <Dialog.Header>
          <div className="text-white">{renderBondNodes(defaultValue?.bond, false, false)}</div>
        </Dialog.Header>
      </DialogLayout.Header>

      <Dialog.Body>
        <QuoteContainer />
        <StaticContainer />
      </Dialog.Body>

      <SpotFooter
        containerCls={isTkn ? 'tkn' : 'gvn'}
        confirmBtnProps={{
          label: submitLabel,
          disabled: !!disabled || submitting,
          type: isTkn ? 'secondary' : 'orange',
          loading: submitting
        }}
        checkboxDisabled={!!disabled}
        flagInternal={!!flagInternal}
        onInternalChange={setFlagInternal}
        onConfirm={handleSubmit}
        onCancel={onCancel}
      />
    </>
  );
};

const Wrapper = ({ context }: { context: SpotAppointModalProps }) => {
  useEffect(() => {
    trackPoint(SpotAppointModalFlow.FlowEnter);
  }, []);
  return (
    <LocalDataProvider>
      <SpotAppointProvider initialState={context}>
        <Inner />
      </SpotAppointProvider>
    </LocalDataProvider>
  );
};

export default () => {
  const context = useContext<SpotAppointModalProps>(DialogContext);
  const key = getSpotAppointKey(context);
  const spotAppointNode = key ? (
    <Wrapper
      key={key}
      context={context}
    />
  ) : null;

  if (isUseLocalServer()) {
    return <LocalServerLoadingProvider>{spotAppointNode}</LocalServerLoadingProvider>;
  }

  return <LocalDataProvider>{spotAppointNode}</LocalDataProvider>;
};
