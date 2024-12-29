import { Dialog } from '@fepkg/components/Dialog';
import { DialogLayout } from '@/layouts/Dialog';
import { CalcInput } from './CalcInput';
import { CalcResult } from './CalcResult';

export const Panel = () => {
  return (
    <>
      <DialogLayout.Header>
        <Dialog.Header>债券计算器</Dialog.Header>
      </DialogLayout.Header>

      <Dialog.Body id="calculator-dialog-body">
        <div className="h-full w-full grid grid-cols-2 border border-solid border-gray-600 rounded-lg overflow-hidden">
          <CalcInput />
          <CalcResult />
        </div>
      </Dialog.Body>
    </>
  );
};
