import { Modal } from '@fepkg/components/Modal';
import { Body } from './Body';
import { Footer } from './Footer';
import { SearchInstTraderProvider, useSearchInstTrader } from './provider';
import { SearchInstTraderProps } from './types';

const Inner = (props: SearchInstTraderProps) => {
  const { selectedTraders } = useSearchInstTrader();
  const { visible, onCancel, onConfirm } = props;
  return (
    <Modal
      visible={visible}
      width={480}
      title="变更分组成员"
      keyboard
      footerProps={{ centered: true }}
      onCancel={onCancel}
      onConfirm={() => onConfirm?.(selectedTraders)}
    >
      <div className="h-[480px] flex flex-col">
        <Body />
        {selectedTraders.length > 0 && <div className="border-0 border-solid border-t border-t-gray-600" />}
        {selectedTraders.length > 0 && <Footer />}
      </div>
    </Modal>
  );
};

export const SearchInstTrader = (props: SearchInstTraderProps) => {
  return (
    <SearchInstTraderProvider initialState={{ defaultTraders: props.defaultTraders, productType: props.productType }}>
      <Inner {...props} />
    </SearchInstTraderProvider>
  );
};
