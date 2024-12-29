import cx from 'classnames';
import { Checkbox } from '@fepkg/components/Checkbox';
import { Dialog, FooterButtonProps } from '@fepkg/components/Dialog';

type ISpotFooter = {
  checkboxDisabled: boolean;

  flagInternal: boolean;
  confirmBtnProps?: FooterButtonProps;
  containerCls?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onInternalChange?: (val: boolean) => void;
};

export const SpotFooter = (props: ISpotFooter) => {
  const { checkboxDisabled, confirmBtnProps, containerCls, flagInternal, onConfirm, onCancel, onInternalChange } =
    props;
  return (
    <Dialog.Footer
      className={cx('idc-spot-dialog-footer', containerCls)}
      confirmBtnProps={confirmBtnProps}
      cancelBtnProps={{ onKeyDown: e => e.code === 'Enter' && e.stopPropagation() }}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <div className="bg-gray-700 rounded-lg py-0.5 px-4">
        <Checkbox
          disabled={checkboxDisabled}
          checked={flagInternal}
          onChange={onInternalChange}
        >
          暗盘成交
        </Checkbox>
      </div>
    </Dialog.Footer>
  );
};
