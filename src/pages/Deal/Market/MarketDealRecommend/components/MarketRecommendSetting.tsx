import { useEffect, useRef, useState } from 'react';
import { Button } from '@fepkg/components/Button';
import { Checkbox } from '@fepkg/components/Checkbox';
import { Dialog } from '@fepkg/components/Dialog';
import { Radio } from '@fepkg/components/Radio';
import { DialogLayout } from '@/layouts/Dialog';
import { useDialogLayout } from '@/layouts/Dialog/hooks';
import { useProductParams } from '@/layouts/Home/hooks';
import { SettingOptions } from '../constants';
import { useSettings } from '../hook/useSettings';

export const MarketRecommendSetting = () => {
  const { cancel, confirm } = useDialogLayout();
  const { productType } = useProductParams();
  const okBtnRef = useRef<HTMLButtonElement>(null);
  const { pageSize, setPageSize, isMy, setIsMy } = useSettings(productType);

  const [tmpPageSize, setTmpPageSize] = useState(pageSize);
  const [tmpIsMy, setTmpIsMy] = useState(isMy);

  const onOk = () => {
    setPageSize(tmpPageSize);
    setIsMy(tmpIsMy);
    confirm();
  };

  useEffect(() => {
    // Enter快捷键
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.stopPropagation();
        okBtnRef.current?.click();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <DialogLayout.Header controllers={['close']}>
        <Dialog.Header>设置</Dialog.Header>
      </DialogLayout.Header>

      <div className="mx-auto bg-gray-700">
        <section className="mx-3 my-2 px-5 py-5 h-[100px] border border-solid border-gray-600 rounded-lg grid grid-cols-4 gap-x-3 gap-y-7">
          {SettingOptions.map(o => (
            <Radio
              className="w-[65px] h-4 justify-start"
              checked={tmpPageSize === o.value}
              key={o.value as number}
              onClick={() => {
                setTmpPageSize(o.value as number);
              }}
            >
              {o.label}
            </Radio>
          ))}
        </section>
        <section className="mx-3 mt-3 h-8 border border-solid border-gray-600 rounded-lg flex justify-center items-center">
          <Checkbox
            checked={tmpIsMy}
            onChange={setTmpIsMy}
          >
            我的成交
          </Checkbox>
        </section>
        <div className="mt-2 flex items-center justify-center gap-3 h-12 bg-gray-800">
          <Button
            key="cancel"
            type="gray"
            className="w-[76px] h-7"
            ghost
            onClick={() => cancel()}
          >
            取消
          </Button>
          <Button
            ref={okBtnRef}
            key="confirm"
            type="primary"
            className="w-[76px] h-7"
            onClick={onOk}
          >
            确定
          </Button>
        </div>
      </div>
    </>
  );
};
