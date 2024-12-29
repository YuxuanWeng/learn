import { useRef } from 'react';
import { Dialog } from '@fepkg/components/Dialog';
import { Modal } from '@fepkg/components/Modal';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { v4 as uuidv4 } from 'uuid';
import { FlowLoggerProvider } from '@/common/providers/FlowLoggerProvider';
import { originalTextMdlOpenAtom, originalTextMdlTargetMessageAtom } from '../../atoms/modal';
import { OriginalImage } from './components/Image';
import { OriginalTextTable } from './components/Table';

const LOGGER_TRACE_FIELD = 'collaborativeQuoteOriginalTextTraceId';
const LOGGER_FLOW_NAME = 'collaborative-quote-original-text';

const Inner = () => {
  const traceId = useRef(uuidv4());

  const [open, setOpen] = useAtom(originalTextMdlOpenAtom);
  const setTargetMessage = useSetAtom(originalTextMdlTargetMessageAtom);

  const handleCancel = () => {
    setOpen(false);
    setTargetMessage(null);
  };

  return (
    <FlowLoggerProvider
      initialState={{
        traceId: traceId.current,
        traceField: LOGGER_TRACE_FIELD,
        flowName: LOGGER_FLOW_NAME
      }}
    >
      <Modal
        visible={open}
        width={813}
        title={<Dialog.Header childrenCls="select-none">原文信息</Dialog.Header>}
        draggable={false}
        keyboard
        footer={null}
        onCancel={handleCancel}
      >
        <OriginalImage />
        <OriginalTextTable />
      </Modal>
    </FlowLoggerProvider>
  );
};

export const OriginalTextModal = () => {
  const open = useAtomValue(originalTextMdlOpenAtom);

  if (!open) return null;

  return <Inner />;
};
