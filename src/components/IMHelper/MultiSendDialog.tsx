import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { ModalUtils } from '@fepkg/components/Modal';
import { IMHelperMsgSendSingleResultForDisplay } from './type';

type MultiSendDialogProps = {
  results: IMHelperMsgSendSingleResultForDisplay[];
  hintLightMode?: boolean;
  onClose?: VoidFunction;
};

export const MultiSendDialog = (props: MultiSendDialogProps) => {
  const { results, onClose, hintLightMode } = props;
  const bgColor = hintLightMode ? 'bg-gray-150' : '';
  const errorHintBgColor = hintLightMode ? 'bg-danger-100' : 'bg-danger-700';
  const innerBgColor = hintLightMode ? 'bg-gray-100' : 'bg-gray-600';
  const traderNameColor = hintLightMode ? 'text-gray-700' : 'text-white';
  const instNameColor = hintLightMode ? 'text-gray-350' : 'text-gray-300';
  const lineBorderColor = hintLightMode ? 'border-gray-150' : 'border-gray-500';
  return (
    <div className={cx('p-3 flex flex-col max-h-[320px]', bgColor)}>
      <div className={cx('h-6 flex items-center justify-center text-xs text-danger-200', errorHintBgColor)}>
        <i className="icon-state_2 mr-2 bg-danger-200 w-4 h-4" />
        以下交易员发送失败！
      </div>
      <div className={cx('mt-2 flex-1 overflow-y-overlay rounded-lg', innerBgColor)}>
        {results.map((r, index) => (
          <div
            key={r.trader_id}
            className={cx('flex items-center h-8', index !== 0 && 'border-0 border-t border-solid', lineBorderColor)}
          >
            <div className="w-[200px] flex">
              <span className={cx('ml-[22px] mr-2 flex-shrink-0', traderNameColor)}>{r.trader_name}</span>
              <span className={cx('truncate w-[100px]', instNameColor)}>{r.inst_name}</span>
            </div>
            <div className={cx('truncate', traderNameColor)}>{r.msg}</div>
          </div>
        ))}
      </div>

      <Button
        type="primary"
        className="mt-2 self-center w-18 rounded"
        onClick={onClose}
      >
        关闭
      </Button>
    </div>
  );
};

export const showMultiSendResult = (results: IMHelperMsgSendSingleResultForDisplay[], hintLightMode: boolean) => {
  const lightModalBorder =
    '[&_.ant-modal-body]:bg-white [&_.ant-modal-content]:!rounded-lg [&_.ant-modal-content]:border-none [&_.ant-modal-content]:drop-shadow-dropdown [&_.ant-modal-body]:!p-0';
  const darkModalBorder = '[&_.ant-modal-content]:!rounded-lg [&_.ant-modal-body]:!p-0';
  const modalBorder = hintLightMode ? lightModalBorder : darkModalBorder;
  const modal = ModalUtils.show({
    width: 480,
    keyboard: false,
    className: modalBorder,
    content: (
      <MultiSendDialog
        results={results}
        hintLightMode={hintLightMode}
        onClose={() => {
          modal?.destroy();
        }}
      />
    )
  });
};
