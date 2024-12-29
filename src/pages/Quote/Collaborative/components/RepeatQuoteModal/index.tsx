import { useRef } from 'react';
import { Dialog } from '@fepkg/components/Dialog';
import { Modal } from '@fepkg/components/Modal';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { v4 as uuidv4 } from 'uuid';
import { FlowLoggerProvider } from '@/common/providers/FlowLoggerProvider';
import {
  repeatQuoteMdlOpenAtom,
  repeatQuoteMdlSelectedBondAtom,
  repeatQuoteMdlSelectedMessageKeyAtom
} from '../../atoms/modal';
import { RepeatQuoteTable } from './components/Table';

const LOGGER_TRACE_FIELD = 'collaborativeQuoteRepeatQuoteTraceId';
const LOGGER_FLOW_NAME = 'collaborative-quote-repeat-quote';

const Inner = () => {
  const traceId = useRef(uuidv4());

  const [open, setOpen] = useAtom(repeatQuoteMdlOpenAtom);
  const [selectedBond, setSelectedBond] = useAtom(repeatQuoteMdlSelectedBondAtom);
  const setSelectedMessageKey = useSetAtom(repeatQuoteMdlSelectedMessageKeyAtom);

  const handleCancel = () => {
    setOpen(false);
    setSelectedBond({});
    setSelectedMessageKey(void 0);
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
        width={681}
        title={<Dialog.Header subtitle={selectedBond?.display_code}>{selectedBond?.short_name}</Dialog.Header>}
        draggable={false}
        keyboard
        footer={null}
        onCancel={handleCancel}
      >
        <RepeatQuoteTable />
      </Modal>
    </FlowLoggerProvider>
  );
};

export const RepeatQuoteModal = () => {
  const open = useAtomValue(repeatQuoteMdlOpenAtom);

  if (!open) return null;

  return <Inner />;
};
