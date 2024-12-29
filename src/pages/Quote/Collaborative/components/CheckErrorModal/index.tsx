import { ModalUtils } from '@fepkg/components/Modal';
import { IconAttentionFilled } from '@fepkg/icon-park-react';

export type CheckErrorItem = { bondCode?: string; bondName?: string; idx: number[] };

type ModalProps = {
  title: string;
  value: CheckErrorItem[];
};

export const showCheckErrorModal = (props: ModalProps) => {
  const content = () => {
    return (
      <div className="min-w-[288px]">
        <div className="flex items-center w-full justify-center">
          <IconAttentionFilled className="text-orange-100" />
          <span className="ml-2 text-sm text-gray-100"> {props.title}</span>
        </div>

        <div className="mt-3 flex-col max-h-[110px] overflow-y-overlay">
          {props.value.map(v => {
            return (
              <span
                key={JSON.stringify(v)}
                className="w-full text-sm text-gray-000 truncate flex justify-center"
              >
                第{v.idx.join('，')}行，{v.bondCode} {v.bondName}
              </span>
            );
          })}
        </div>
      </div>
    );
  };
  ModalUtils.warning({
    content: content(),
    buttonsCentered: true,
    showIcon: false,
    showTitle: false,
    mask: true,
    maskClosable: false,
    width: 'auto',
    showCancel: false,
    okText: '我知道了'
  });
};
